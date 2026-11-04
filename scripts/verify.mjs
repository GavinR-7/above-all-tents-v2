/**
 * Typecheck, production build, then a Chrome pass over the routes.
 *
 * This repo did not have a verify script. The motion refresh needs one place
 * that fails if the filmstrip overflows a phone, the hero heading is hidden,
 * or a gallery thumbnail stays invisible. Lighthouse is not part of it: the
 * site has no score gate, and adding one would judge pages this change does
 * not touch.
 *
 * Writes verify-output/summary.md and exits non-zero on any failure.
 */
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { setTimeout as delay } from "node:timers/promises";

const CHROME = process.env.CHROME_BIN || "/usr/local/bin/google-chrome";
const PORT = 4173;
const DEBUG = 9333;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const ROUTES = ["/", "/tents", "/inflatables", "/mechanical-bull", "/tables-chairs", "/contact"];
const WIDTHS = [360, 390, 430, 1280];

const lines = [];
const failures = [];

function note(step, result, detail = "") {
  lines.push(`| ${step} | ${result} | ${detail} |`);
  if (result === "FAIL") failures.push(`${step}: ${detail}`);
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`));
    });
  });
}

function killTree(child) {
  if (!child?.pid) return;
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    try {
      child.kill("SIGTERM");
    } catch {
      // Already gone.
    }
  }
}

function spawnReady(cmd, args, ready) {
  const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"], detached: true });
  let buffer = "";
  const done = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${cmd} did not become ready`)), 30000);
    const onData = (chunk) => {
      buffer += chunk.toString();
      process.stdout.write(chunk);
      if (ready(buffer)) {
        clearTimeout(timer);
        resolve();
      }
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`${cmd} exited ${code} before it was ready`));
    });
  });
  return { child, done };
}

function cdp(ws) {
  let id = 0;
  const pending = new Map();
  const listeners = new Set();
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const waiter = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) waiter.reject(new Error(message.error.message || "cdp error"));
      else waiter.resolve(message.result);
      return;
    }
    for (const listener of listeners) listener(message);
  });
  const send = (method, params = {}, sessionId) => {
    const msgId = ++id;
    return new Promise((resolve, reject) => {
      pending.set(msgId, { resolve, reject });
      const payload = { id: msgId, method, params };
      if (sessionId) payload.sessionId = sessionId;
      ws.send(JSON.stringify(payload));
    });
  };
  const once = (method, sessionId) =>
    new Promise((resolve) => {
      const listener = (message) => {
        if (message.method !== method) return;
        if (sessionId && message.sessionId !== sessionId) return;
        listeners.delete(listener);
        resolve(message.params);
      };
      listeners.add(listener);
    });
  return { send, once };
}

async function waitForChrome() {
  const started = Date.now();
  while (Date.now() - started < 15000) {
    try {
      const response = await fetch(`http://127.0.0.1:${DEBUG}/json/version`);
      if (response.ok) return response.json();
    } catch {
      // Chrome is still starting.
    }
    await delay(200);
  }
  throw new Error("Chrome did not open a debugging port");
}

async function evaluate(send, sessionId, expression) {
  const result = await send(
    "Runtime.evaluate",
    { expression, returnByValue: true, awaitPromise: true },
    sessionId,
  );
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "evaluate failed");
  }
  return result.result.value;
}

const startedAt = new Date();

try {
  const t0 = Date.now();
  await run("npx", ["tsc", "--noEmit"]);
  note("typecheck", "PASS", `${((Date.now() - t0) / 1000).toFixed(0)}s`);
} catch (error) {
  note("typecheck", "FAIL", error.message);
}

try {
  const t0 = Date.now();
  await run("npx", ["next", "build"]);
  note("build", "PASS", `${((Date.now() - t0) / 1000).toFixed(0)}s`);
} catch (error) {
  note("build", "FAIL", error.message);
}

if (failures.length > 0) {
  writeSummary(startedAt);
  process.exit(1);
}

const userData = mkdtempSync(`${tmpdir()}/tents-chrome-`);
const server = spawnReady("npx", ["next", "start", "-H", "127.0.0.1", "-p", String(PORT)], (text) =>
  text.includes("Ready"),
);
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    `--remote-debugging-port=${DEBUG}`,
    `--user-data-dir=${userData}`,
    "--no-first-run",
    "about:blank",
  ],
  { stdio: "ignore", detached: true },
);

try {
  await server.done;
  const version = await waitForChrome();
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  const { send, once } = cdp(ws);
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  await send("Page.enable", {}, sessionId);
  await send("Runtime.enable", {}, sessionId);
  await send(
    "Page.addScriptToEvaluateOnNewDocument",
    {
      source: `new PerformanceObserver((list)=>{const last=list.getEntries().at(-1);const el=last&&last.element;window.__lcp=el?{tag:el.tagName,className:String(el.className||""),text:(el.innerText||"").slice(0,80),alt:el.getAttribute?el.getAttribute("alt")||"":"",reveal:el.hasAttribute("data-reveal")||!!el.closest("[data-reveal]"),marquee:!!el.closest(".marquee")}:{url:last&&last.url||""}}).observe({type:"largest-contentful-paint",buffered:true});`,
    },
    sessionId,
  );

  async function open(path, width, height, reduce) {
    await send(
      "Emulation.setDeviceMetricsOverride",
      { width, height, deviceScaleFactor: 1, mobile: width < 800 },
      sessionId,
    );
    await send(
      "Emulation.setEmulatedMedia",
      {
        features: [{ name: "prefers-reduced-motion", value: reduce ? "reduce" : "no-preference" }],
      },
      sessionId,
    );
    const loaded = once("Page.loadEventFired", sessionId);
    await send("Page.navigate", { url: `${ORIGIN}${path}` }, sessionId);
    await loaded;
    await delay(600);
  }

  for (const width of WIDTHS) {
    for (const path of ROUTES) {
      await open(path, width, width < 800 ? 800 : 900, false);
      const box = await evaluate(
        send,
        sessionId,
        `({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})`,
      );
      const overflow = box.scroll - box.client;
      note(
        `overflow ${width}px ${path}`,
        overflow <= 1 ? "PASS" : "FAIL",
        `scroll ${box.scroll} client ${box.client}`,
      );
    }
  }

  await open("/", 390, 844, false);
  const hero = await evaluate(
    send,
    sessionId,
    `(() => {
      const h1 = document.querySelector("h1");
      const poster = document.querySelector('img[alt="Above All Tent Rentals highlight reel"]');
      const track = document.querySelector("[data-marquee-track]");
      const link = document.querySelector('.marquee')?.parentElement?.querySelector("a");
      const photo = document.querySelector(".marquee img");
      const cs = h1 ? getComputedStyle(h1) : null;
      const linkBox = link ? link.getBoundingClientRect() : null;
      return {
        h1: h1 ? h1.textContent : "",
        h1Opacity: cs ? cs.opacity : "",
        h1Reveal: h1 ? h1.hasAttribute("data-reveal") : true,
        posterOpacity: poster ? getComputedStyle(poster).opacity : "missing",
        posterReveal: poster ? !!poster.closest("[data-reveal]") : true,
        duration: track ? getComputedStyle(track).animationDuration : "",
        name: track ? getComputedStyle(track).animationName : "",
        linkH: linkBox ? Math.round(linkBox.height) : 0,
        photoTop: photo ? Math.round(photo.getBoundingClientRect().top) : -1,
      };
    })()`,
  );
  note(
    "hero heading visible",
    hero.h1 === "We've Got You Covered!" && hero.h1Opacity === "1" && hero.h1Reveal === false
      ? "PASS"
      : "FAIL",
    `opacity ${hero.h1Opacity}`,
  );
  note(
    "hero poster not revealed",
    hero.posterOpacity === "1" && hero.posterReveal === false ? "PASS" : "FAIL",
    `opacity ${hero.posterOpacity}`,
  );
  note(
    "marquee duration",
    hero.name !== "none" && hero.duration === "113s" ? "PASS" : "FAIL",
    `${hero.name} ${hero.duration}`,
  );
  note("filmstrip link height", hero.linkH >= 44 ? "PASS" : "FAIL", `${hero.linkH}px`);
  note(
    "filmstrip below the first screen",
    hero.photoTop >= 844 ? "PASS" : "FAIL",
    `first photo top ${hero.photoTop}px`,
  );

  await delay(1200);
  const lcp = await evaluate(send, sessionId, `window.__lcp || null`);
  const lcpOk = lcp && lcp.marquee === false && lcp.reveal === false;
  note(
    "homepage LCP",
    lcpOk ? "PASS" : "FAIL",
    lcp ? `${lcp.tag} ${lcp.alt || lcp.text || lcp.className}` : "no entry",
  );

  const motion = await evaluate(
    send,
    sessionId,
    `(() => {
      const strip = document.querySelector(".marquee");
      strip.scrollIntoView({ block: "center", behavior: "instant" });
      const track = strip.querySelector("[data-marquee-track]");
      const before = getComputedStyle(track).animationPlayState;
      const rect = strip.getBoundingClientRect();
      return { before, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, paused: strip.hasAttribute("data-paused") };
    })()`,
  );
  await delay(300);
  const playing = await evaluate(
    send,
    sessionId,
    `getComputedStyle(document.querySelector("[data-marquee-track]")).animationPlayState`,
  );
  await send(
    "Input.dispatchMouseEvent",
    { type: "mouseMoved", x: motion.x, y: motion.y },
    sessionId,
  );
  await delay(100);
  const hovered = await evaluate(
    send,
    sessionId,
    `getComputedStyle(document.querySelector("[data-marquee-track]")).animationPlayState`,
  );
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 2, y: 2 }, sessionId);
  await delay(100);
  const left = await evaluate(
    send,
    sessionId,
    `getComputedStyle(document.querySelector("[data-marquee-track]")).animationPlayState`,
  );
  note(
    "marquee runs, pauses on hover, resumes",
    playing === "running" && hovered === "paused" && left === "running" ? "PASS" : "FAIL",
    `before scroll settle ${motion.before}; on screen ${playing}; hover ${hovered}; away ${left}`,
  );

  await open("/", 360, 800, true);
  const reduced = await evaluate(
    send,
    sessionId,
    `(() => {
      const dup = document.querySelector("[data-marquee-duplicate]");
      const row = document.querySelector("[data-marquee-row]");
      const track = document.querySelector("[data-marquee-track]");
      const dupBox = dup ? dup.getBoundingClientRect() : null;
      const rowBox = row ? row.getBoundingClientRect() : null;
      return {
        dupDisplay: dup ? getComputedStyle(dup).display : "missing",
        anim: track ? getComputedStyle(track).animationName : "",
        rowRight: rowBox ? Math.round(rowBox.right) : 0,
        rowLeft: rowBox ? Math.round(rowBox.left) : 0,
        dupW: dupBox ? Math.round(dupBox.width) : -1,
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
        h1: getComputedStyle(document.querySelector("h1")).opacity,
      };
    })()`,
  );
  const reducedOk =
    reduced.dupDisplay === "none" &&
    reduced.anim === "none" &&
    reduced.scroll <= reduced.client + 1 &&
    reduced.rowRight <= 360 &&
    reduced.rowLeft >= 0 &&
    reduced.h1 === "1";
  note(
    "reduced motion wraps the strip",
    reducedOk ? "PASS" : "FAIL",
    `dup ${reduced.dupDisplay} anim ${reduced.anim} row ${reduced.rowLeft}–${reduced.rowRight} scroll ${reduced.scroll}`,
  );

  await open("/tents", 390, 844, false);
  const galleryBefore = await evaluate(
    send,
    sessionId,
    `(() => {
      const buttons = [...document.querySelectorAll("[data-reveal]")];
      const hidden = buttons.filter((el) => getComputedStyle(el).opacity === "0").length;
      return { count: buttons.length, hidden, revealed: buttons.filter((el) => el.hasAttribute("data-revealed")).length };
    })()`,
  );
  await evaluate(
    send,
    sessionId,
    `document.querySelector('[aria-label^="Open slide"]')?.scrollIntoView({block:"center"})`,
  );
  await delay(1200);
  await evaluate(send, sessionId, `document.querySelector('[aria-label^="Open slide"]')?.click()`);
  await delay(400);
  const galleryAfter = await evaluate(
    send,
    sessionId,
    `(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const box = dialog ? dialog.getBoundingClientRect() : null;
      const buttons = [...document.querySelectorAll('[aria-label^="Open slide"]')];
      const visible = buttons.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < innerHeight;
      });
      return {
        revealed: visible.filter((el) => el.hasAttribute("data-revealed")).length,
        visible: visible.length,
        opacity: visible.length ? getComputedStyle(visible[0]).opacity : "",
        dialogTop: box ? Math.round(box.top) : -1,
        dialogW: box ? Math.round(box.width) : 0,
        dialogH: box ? Math.round(box.height) : 0,
        innerH: window.innerHeight,
      };
    })()`,
  );
  note(
    "gallery thumbnails start hidden",
    galleryBefore.count >= 10 && galleryBefore.hidden >= 10 ? "PASS" : "FAIL",
    `${galleryBefore.hidden}/${galleryBefore.count} hidden, ${galleryBefore.revealed} revealed`,
  );
  note(
    "gallery reveals and the dialog stays full screen",
    galleryAfter.visible > 0 &&
      galleryAfter.revealed === galleryAfter.visible &&
      galleryAfter.opacity === "1" &&
      galleryAfter.dialogTop === 0 &&
      galleryAfter.dialogW >= 380 &&
      galleryAfter.dialogH >= galleryAfter.innerH - 2
      ? "PASS"
      : "FAIL",
    `${galleryAfter.revealed}/${galleryAfter.visible} revealed, dialog top ${galleryAfter.dialogTop} ${galleryAfter.dialogW}×${galleryAfter.dialogH}`,
  );

  await open("/tents", 360, 800, true);
  const galleryReduced = await evaluate(
    send,
    sessionId,
    `(() => {
      const buttons = [...document.querySelectorAll("[data-reveal]")];
      const hidden = buttons.filter((el) => getComputedStyle(el).opacity !== "1").length;
      return { count: buttons.length, hidden, scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth };
    })()`,
  );
  note(
    "gallery visible under reduced motion",
    galleryReduced.hidden === 0 && galleryReduced.scroll <= galleryReduced.client + 1 ? "PASS" : "FAIL",
    `${galleryReduced.hidden} hidden, scroll ${galleryReduced.scroll}`,
  );

  ws.close();
} catch (error) {
  note("browser", "FAIL", error instanceof Error ? error.stack || error.message : String(error));
} finally {
  killTree(server.child);
  killTree(chrome);
}

writeSummary(startedAt);
process.exit(failures.length > 0 ? 1 : 0);

function writeSummary(started) {
  mkdirSync("verify-output", { recursive: true });
  const result = failures.length === 0 ? "PASS" : "FAIL";
  const body = [
    `# verify`,
    ``,
    `Result: ${result}`,
    `When: ${started.toISOString()}`,
    ``,
    `| Step | Result | Detail |`,
    `| --- | --- | --- |`,
    ...lines,
    ``,
    failures.length ? `Failures:\n\n${failures.map((item) => `- ${item}`).join("\n")}\n` : ``,
  ].join("\n");
  writeFileSync("verify-output/summary.md", body);
  console.log(`\n${body}`);
}
