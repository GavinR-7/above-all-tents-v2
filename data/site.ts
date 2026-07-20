// ============================================================================
// SINGLE SOURCE OF TRUTH
// All text, phone numbers, photos, inventory items, and the sizing chart.
// Edit here — not in the components.
//
// PRICING: every rentable item has a `price` field. `null` shows a quiet
// "Call for pricing". If Mike ever wants prices, put a string in
// (e.g. "$150/day") and it appears automatically.
// ============================================================================

// --- Business identity ------------------------------------------------------
export const business = {
  name: "Above All Tent Rentals",
  since: 2005,
  phoneDisplay: "631-265-TENT",
  phoneDigits: "8368",
  phoneDial: "16312658368",
  // Mechanical bull books on its own line.
  bullPhoneDisplay: "516-924-0023",
  bullPhoneDial: "5169240023",
  email: "info@abovealltents.com",
  address: "648 Middle Country Road, Suite 1, Saint James, NY 11780",
  mapsEmbed:
    "https://www.google.com/maps?q=648+Middle+Country+Road+Suite+1+Saint+James+NY+11780&output=embed",
  mapsLink: "https://maps.google.com/?q=648+Middle+Country+Road+Suite+1+Saint+James+NY+11780",
  social: {
    instagram: "https://www.instagram.com/above_all_tent_rental_/",
    facebook: "https://www.facebook.com/libounceandslide",
  },
  djSite: "https://inthemooddj.com/",
};

export const CALL_FOR_PRICING = "Call for pricing";

// --- Photos (all real, from Mike's current site) ----------------------------
// ⚠️ Hotlinked from the live site so everything shows real photos today.
// Before his old site comes down, download these into /public and swap paths.
const U = "https://abovealltents.com/wp-content/uploads";

export const photos = {
  logo: `${U}/2022/01/above-all-tent-rentals-logo-invert.svg`, // white + teal, for dark backgrounds
  tents: {
    new1: `${U}/2026/04/image0.jpeg`,
    new2: `${U}/2026/04/image1.jpeg`,
    new3: `${U}/2026/04/image2.jpeg`,
    new4: `${U}/2026/04/image3.jpeg`,
    old1: `${U}/2022/02/web-tents-1.jpg`,
    old2: `${U}/2022/02/web-tents-2.jpg`,
    old3: `${U}/2022/02/web-tents-3.jpg`,
  },
  inflatables: {
    a: `${U}/2022/02/web-inflatables-1.jpg`,
    b: `${U}/2022/02/web-inflatables-2.jpg`,
    c: `${U}/2022/02/web-inflatables-3.jpg`,
    d: `${U}/2022/02/web-inflatables-4.jpg`,
    bull: `${U}/2026/04/web_mech-bull-2.jpeg`,
  },
  lounge: {
    a: `${U}/2022/02/web-lounge-decor-1.jpg`,
    b: `${U}/2022/02/web-lounge-decor-2.jpg`,
    c: `${U}/2022/02/web-lounge-decor-3.jpg`,
    d: `${U}/2022/05/web-Screenshot_20210707-203131_Photos.jpg`,
    e: `${U}/2022/05/web-Screenshot_20201008-233514_Messages.jpg`,
    f: `${U}/2022/05/web-IMG_20220327_101732.jpg`,
    g: `${U}/2022/05/web-IMG_20220312_231534.jpg`,
    h: `${U}/2022/05/web-IMG_20220220_092925.jpg`,
    i: `${U}/2022/05/web-20210909_160731.jpg`,
    j: `${U}/2022/05/web-20200218_173217.jpg`,
    k: `${U}/2022/05/web-20200218_173210.jpg`,
    l: `${U}/2022/05/web-20200218_173201.jpg`,
  },
};

// --- Nav (logo sits in the middle on desktop) -------------------------------
export const navLeft = [
  { label: "Tents", href: "/tents" },
  { label: "Inflatables", href: "/inflatables" },
];
export const navRight = [
  { label: "Lounge & Decor", href: "/lounge-decor" },
  { label: "Contact", href: "/contact" },
];
export const navAll = [...navLeft, ...navRight];

// --- Home: hero carousel ----------------------------------------------------
export const heroSlides = [
  { photo: photos.tents.new1, alt: "High-peak tent set for a backyard party" },
  { photo: photos.tents.new2, alt: "Tent with tables and chairs ready for guests" },
  { photo: photos.inflatables.d, alt: "Inflatable water slide at a summer party" },
  { photo: photos.lounge.b, alt: "High-top tables and stools around a pool" },
  { photo: photos.tents.old1, alt: "Event tent rental on Long Island" },
];

export const hero = {
  eyebrow: "Planning your next event?",
  title: "We've Got You Covered!",
  subtitle: `Tents, inflatables, and party rentals — family-owned and serving all of Long Island since ${business.since}.`,
};

// --- Home: category tiles (B&W → color on hover, like his current site) -----
export const categoryTiles = [
  {
    name: "Tents",
    href: "/tents",
    photo: photos.tents.new4,
    blurb: "Five sizes, from backyard birthdays to full tented events.",
  },
  {
    name: "Inflatables",
    href: "/inflatables",
    photo: photos.inflatables.d,
    blurb: "Bounce houses, water slides, dunk tanks — and the mechanical bull.",
  },
  {
    name: "Lounge & Decor",
    href: "/lounge-decor",
    photo: photos.lounge.b,
    blurb: "Tables, chairs, linens, lighting, and LED lounge pieces.",
  },
];

// --- Home: about band -------------------------------------------------------
export const about = {
  title: "Celebrating Over 20 Years",
  subtitle: "Servicing All of Long Island",
  body: `Since ${business.since}, Above All Tent Rentals has been providing party equipment rentals throughout Long Island. We're a family-owned business, and we take pride in delivering the newest, cleanest, and most attractive equipment available — delivered, set up, and taken down for you.`,
  photo: photos.tents.new3,
};

// ============================================================================
// TENTS
// ============================================================================
// Capacity math (confirmed): each tent fits ~1 round table per 100 sq ft.
// We recommend 8 chairs per table; each table can fit up to 10.
// `seatsRec` = tables × 8, `seatsMax` = tables × 10.
export type Tent = {
  size: string;
  w: number;
  l: number;
  sqft: number;
  tables: number;
  seatsRec: number;
  seatsMax: number;
  price: string | null;
};

const t = (w: number, l: number, tables: number): Tent => ({
  size: `${w} × ${l}`,
  w,
  l,
  sqft: w * l,
  tables,
  seatsRec: tables * 8,
  seatsMax: tables * 10,
  price: null,
});

export const tents: Tent[] = [
  t(10, 20, 2),
  t(15, 20, 3),
  t(20, 20, 4),
  t(30, 20, 6),
  t(40, 20, 8),
];

export const tentPage = {
  title: "Tent Rentals",
  intro:
    "High-peak frame tents in five sizes, delivered and set up anywhere on Long Island. Tell us your guest count and we'll size it for you — or use the guide below.",
  sidewalls: {
    name: "Tent Sidewalls",
    blurb:
      "Add sidewalls to any tent for shade, privacy, or weather protection. Available for every size.",
    price: null as string | null,
  },
  addOnsNote:
    "Tables, chairs, linens, and lighting are add-ons — each priced on its own, so you only rent what you need.",
  goodToKnow: [
    "Tents are anchored with stakes, or weighted with water barrels or blocks, on at least two corners.",
    "We need flat, open ground big enough for the tent footprint.",
    "Have someone there to show the crew the exact spot — it goes up right the first time.",
  ],
  gallery: [
    photos.tents.new1,
    photos.tents.new2,
    photos.tents.new3,
    photos.tents.new4,
    photos.tents.old1,
    photos.tents.old2,
    photos.tents.old3,
  ],
};

export const calculatorCopy = {
  title: "What size tent do you need?",
  sub: "We recommend 8 chairs per table for comfort — each table can fit up to 10.",
  overflow:
    "For bigger parties we combine tents to cover everyone — here's what we'd suggest:",
  callLine: "Every yard is different — call and we'll plan the exact layout with you.",
};

// ============================================================================
// INFLATABLES
// ============================================================================
export type RentalItem = {
  name: string;
  blurb: string;
  photo: string | null; // null = no dedicated photo yet (Mike to supply)
  price: string | null;
};

export const inflatablesPage = {
  title: "Inflatables",
  intro:
    "Clean, sanitized, and inspected before every event — delivered and set up at your home, office, park, or venue anywhere on Long Island.",
  items: [
    {
      name: "Bounce Houses",
      blurb: "The classic. Clean, colorful, and always the kids' favorite corner of the party.",
      photo: photos.inflatables.a,
      price: null,
    },
    {
      name: "Water Slides",
      blurb: "Big slides for hot Long Island summers — graduation party essential.",
      photo: photos.inflatables.d,
      price: null,
    },
    {
      name: "Obstacle Courses",
      blurb: "Head-to-head races through tunnels, walls, and slides. Great for all ages.",
      photo: photos.inflatables.b,
      price: null,
    },
    {
      name: "Slip & Slides",
      blurb: "A backyard water-park lane. Pairs perfectly with a water slide.",
      photo: photos.inflatables.c,
      price: null,
    },
    {
      name: "Dunk Tanks",
      blurb: "Fundraiser and block-party favorite. Somebody's going in.",
      photo: null,
      price: null,
    },
  ] as RentalItem[],
  gallery: [
    photos.inflatables.a,
    photos.inflatables.b,
    photos.inflatables.c,
    photos.inflatables.d,
  ],
};

export const bull = {
  eyebrow: "The showstopper",
  title: "The Mechanical Bull",
  body: [
    "Tired of parties where everyone stands around on their phones? The bull turns any backyard, birthday, block party, or corporate event into the thing people talk about for weeks.",
    "A professional operator runs every ride — controlling the speed and keeping riders safe — inside a big, soft inflatable arena that's cleaned and inspected before each event. We handle delivery, setup, operation, and takedown.",
  ],
  features: [
    "Professional operator included",
    "Fun for all ages",
    "Big inflatable safety arena",
    "Cleaned & inspected before every event",
    "Delivery, setup & takedown handled",
  ],
  note: "Weekends book fast — especially in summer.",
  price: null as string | null,
  photo: photos.inflatables.bull,
};

// ============================================================================
// LOUNGE & DECOR (includes tables, chairs & extras)
// ============================================================================
export const loungePage = {
  title: "Lounge & Decor",
  intro:
    "Everything that furnishes the party — tables, chairs, linens, lighting, and lounge pieces that set your event apart. Each item is rented on its own, so you only pay for what you need.",
  items: [
    {
      name: "Round Tables",
      blurb: "Seats 8 comfortably, up to 10. The standard for dinners and parties.",
      photo: photos.lounge.a,
      price: null,
    },
    {
      name: "Banquet Tables",
      blurb: "Long tables for buffets, gifts, or family-style seating.",
      photo: photos.lounge.j,
      price: null,
    },
    {
      name: "High-Top Tables & Stools",
      blurb: "Cocktail-height tables that keep the crowd mingling.",
      photo: photos.lounge.b,
      price: null,
    },
    {
      name: "Chairs",
      blurb: "Clean white folding chairs, delivered and set up with your tables.",
      photo: photos.lounge.k,
      price: null,
    },
    {
      name: "Table Linens",
      blurb: "Linens in the colors of your event, fitted to every table size.",
      photo: photos.lounge.f,
      price: null,
    },
    {
      name: "LED Lucite Tables & Bars",
      blurb: "Glowing, color-shifting pieces that transform an evening event.",
      photo: photos.lounge.d,
      price: null,
    },
    {
      name: "Lounge Furniture",
      blurb: "Seating vignettes that give guests somewhere to land between dances.",
      photo: photos.lounge.e,
      price: null,
    },
    {
      name: "Event Lighting",
      blurb: "String lights and uplighting under the tent and around the yard.",
      photo: photos.lounge.i,
      price: null,
    },
  ] as RentalItem[],
  note: "Don't see what you're looking for? Ask — if we don't have it, we'll help you find it.",
  gallery: [
    photos.lounge.d,
    photos.lounge.e,
    photos.lounge.f,
    photos.lounge.g,
    photos.lounge.h,
    photos.lounge.i,
    photos.lounge.j,
    photos.lounge.k,
    photos.lounge.l,
    photos.lounge.c,
  ],
};

// ============================================================================
// CONTACT / QUOTE FORM
// ============================================================================
export const eventTypes = [
  "Graduation party",
  "Birthday",
  "Wedding",
  "Corporate / Fundraiser",
  "Block party",
  "Other",
];

export const interests = [
  "Tent",
  "Inflatables",
  "Mechanical bull",
  "Tables & chairs",
  "Linens",
  "Lounge & decor",
  "Not sure yet",
];

// Mirrors his current site's options, plus Instagram.
export const referralSources = [
  "Google",
  "Facebook",
  "Instagram",
  "Personal referral",
  "Truck signage",
  "YouTube",
  "Other",
];

export const contactCopy = {
  title: "Let's plan your event.",
  body: "Tell us a little about your day and we'll put together a quote — or just call, we're happy to talk it through. Summer weekends book up early.",
};

// --- Footer photo strip (like his current site) -----------------------------
export const footerStrip = [
  photos.tents.old3,
  photos.inflatables.b,
  photos.lounge.a,
  photos.inflatables.d,
];
