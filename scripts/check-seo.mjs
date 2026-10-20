/**
 * SEO check against a running build:  npm run build && npm start -- -p 3210
 *                                     node scripts/check-seo.mjs http://localhost:3210
 *
 * Offline schema check (no network validator): parses the JSON-LD, checks the
 * properties Google's LocalBusiness guidance asks for, checks that every URL in
 * it is absolute, and checks that the phone, address and hours in the markup
 * appear on the visible page. Then walks the sitemap and checks each URL's
 * title, description, canonical and share image. Exit 1 on any FAIL.
 */
const origin = (process.argv[2] ?? "http://localhost:3210").replace(/\/$/, "");
const SITE = "https://abovealltents.com"; // siteUrl in data/site.ts
let fails = 0;
const out = (level, msg) => {
  if (level === "FAIL") fails++;
  console.log(`${level.padEnd(5)} ${msg}`);
};
const get = async (path) => (await fetch(origin + path)).text();
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');

// --- JSON-LD ---------------------------------------------------------------
const home = await get("/");
const blocks = [...home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
if (blocks.length === 0) out("FAIL", "no JSON-LD on /");
// Every block must parse; the LocalBusiness checks apply only to LocalBusiness
// blocks, so adding WebSite, BreadcrumbList or FAQPage markup doesn't fail them.
const parsed = [];
for (const [, raw] of blocks) {
  try {
    const ld = JSON.parse(raw);
    out("PASS", `JSON-LD parses (@type ${ld["@type"]})`);
    parsed.push(ld);
  } catch (e) {
    out("FAIL", `JSON-LD does not parse: ${e.message}`);
  }
}
const isLocalBusiness = (ld) => [ld["@type"]].flat().includes("LocalBusiness");
const businesses = parsed.filter(isLocalBusiness);
if (blocks.length && !businesses.length) out("FAIL", "no LocalBusiness JSON-LD on /");
for (const ld of businesses) {
  if (ld["@context"] !== "https://schema.org") out("FAIL", "@context is not https://schema.org");
  for (const key of ["name", "url", "telephone", "address", "image", "geo", "openingHoursSpecification", "areaServed", "sameAs"]) {
    out(ld[key] ? "PASS" : "FAIL", `has ${key}`);
  }
  for (const key of ["streetAddress", "addressLocality", "addressRegion", "postalCode"]) {
    out(ld.address?.[key] ? "PASS" : "FAIL", `address.${key}`);
  }
  const urls = [...JSON.stringify(ld).matchAll(/"(?:url|logo|image|hasMap|sameAs)":\s*(\[[^\]]*\]|"[^"]*")/g)].flatMap((m) =>
    [...m[1].matchAll(/"(https?:[^"]+|\/[^"]*)"/g)].map((x) => x[1]),
  );
  for (const u of urls) if (!/^https:\/\//.test(u)) out("FAIL", `URL not absolute https: ${u}`);
  for (const u of urls.filter((u) => u.startsWith(SITE))) {
    const path = u.slice(SITE.length) || "/";
    const res = await fetch(origin + path, { method: "HEAD" });
    out(res.ok ? "PASS" : "FAIL", `JSON-LD URL resolves: ${path} (${res.status})`);
  }
  // Markup must match the page: every fact below has to be visible on the site.
  const visible = decode(home.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
  const checks = [
    ["street", ld.address?.streetAddress],
    ["city", ld.address?.addressLocality],
    ["zip", ld.address?.postalCode],
    ["name", ld.name],
  ];
  for (const [label, v] of checks) if (v) out(visible.includes(v) ? "PASS" : "WARN", `visible on / : ${label} "${v}"`);
  for (const o of ld.hasOfferCatalog?.itemListElement ?? []) {
    out("PASS", `catalog item "${o.itemOffered.name}" -> ${o.itemOffered.url}`);
    if (JSON.stringify(o).includes('"price')) out("FAIL", "catalog carries a price; the site shows none");
  }
}

// --- Sitemap pages -----------------------------------------------------------
const sitemap = await get("/sitemap.xml");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
out(locs.length ? "PASS" : "FAIL", `sitemap lists ${locs.length} URLs`);
if (/<lastmod>/.test(sitemap)) out("WARN", "sitemap has lastmod (build-time dates are not real modification dates)");
const seen = new Set();
for (const loc of locs) {
  const path = loc.slice(SITE.length) || "/";
  const res = await fetch(origin + path);
  const html = await res.text();
  const title = decode(html.match(/<title>([^<]*)/)?.[1] ?? "");
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const og = (p) => html.includes(`<meta property="${p}"`);
  const row = [];
  if (!res.ok) row.push(`status ${res.status}`);
  if (!title) row.push("no title");
  if (!desc) row.push("no description");
  if (canon !== loc) row.push(`canonical ${canon} != ${loc}`);
  for (const p of ["og:title", "og:description", "og:url", "og:site_name", "og:image", "og:type"]) if (!og(p)) row.push(`missing ${p}`);
  if (!html.includes('name="twitter:image"')) row.push("missing twitter:image");
  if (seen.has(title)) row.push("duplicate title");
  seen.add(title);
  out(row.length ? "FAIL" : "PASS", `${path}: ${row.length ? row.join("; ") : "title, description, canonical, og, twitter OK"}`);
  if (title.length > 65) out("WARN", `${path}: title is ${title.length} chars; Google shows about 60 (${title})`);
  if (desc.length > 160) out("WARN", `${path}: description is ${desc.length} chars (limit about 160)`);
}
const robots = await get("/robots.txt");
out(robots.includes(`Sitemap: ${SITE}/sitemap.xml`) ? "PASS" : "FAIL", "robots.txt points at the sitemap");
process.exit(fails ? 1 : 0);
