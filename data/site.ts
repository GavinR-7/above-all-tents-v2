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

// --- Photos (all real) ----------------------------
// Photos downloaded into /public.
const U = "/img";

export const photos = {
  logo: `${U}/2022/01/above-all-tent-rentals-logo-invert.svg`, // white + teal, for dark backgrounds
  tents: {
    old1: `${U}/2022/01/web-slide-1.jpg`, // Mikes house
    old2: `${U}/2022/02/web-tents-2.jpg`, // tent, chairs, tables, linens
    old3: `${U}/2022/02/web-tents-3.jpg`, // just 2 tents
    new1: `${U}/2026/04/image0.jpeg`, // Nice tents and dance floor, tables chairs
    new2: `${U}/2026/04/image1.jpeg`, // tents, tables, chairs, blurry
    new3: `${U}/2026/04/image2.jpeg`, // !Nice tents, lights, red linens
    new4: `${U}/2026/04/image19.jpeg`, // Tent and side walls
    new5: `${U}/2026/04/image8.jpeg`, // tents and chairs on road, barrels, cinder blocks
    new6: `${U}/2026/04/image20.jpeg`, // tent with tables and barrel
    new7: `${U}/2026/04/image25.jpeg`, // tents, tables, chairs, linens

  },
  inflatables: {
    a: `${U}/2022/02/web-inflatables-1.jpg`, // obsticle
    b: `${U}/2022/02/web-inflatables-2.jpg`, // bouncy house
    c: `${U}/2022/02/web-inflatables-3.jpg`, // basic water slide
    d: `${U}/2022/02/web-inflatables-4.jpg`, // obsticle course
    e: `${U}/2022/01/web-slide-2.jpg`, // pirate ship
    f: `${U}/2026/04/image6.jpeg`, // bouncy house
    g: `${U}/2026/04/image7.jpeg`, // obstacle course 
    h: `${U}/2026/04/image9.jpeg`, // bouncy house
    i: `${U}/2026/04/image23.jpeg`, // water slide, palm tree
    j: `${U}/2026/04/image26.jpeg`, // slip and slide


    bull0: `${U}/2026/04/image5.jpeg`, // brown bull
    bull1: `${U}/2026/04/image4.jpeg`, // red bull
    bullPoster: `${U}/2026/04/image29.jpeg`, // still frame for the bull video poster
  },
  lounge: {
    a: `${U}/2022/02/web-lounge-decor-1.jpg`, // just round table and chairs
    b: `${U}/2022/02/web-lounge-decor-2.jpg`, // tables, chairs, linens, tent
    c: `${U}/2022/02/web-lounge-decor-3.jpg`, // high chairs, light boxes
    d: `${U}/2022/05/web-Screenshot_20210707-203131_Photos.jpg`,
    e: `${U}/2022/05/web-Screenshot_20201008-233514_Messages.jpg`,
    f: `${U}/2022/05/web-IMG_20220327_101732.jpg`,
    g: `${U}/2022/05/web-IMG_20220312_231534.jpg`,
    h: `${U}/2022/05/web-IMG_20220220_092925.jpg`,
    i: `${U}/2022/05/web-20210909_160731.jpg`,
    j: `${U}/2022/05/web-20200218_173217.jpg`,
    k: `${U}/2022/05/web-20200218_173210.jpg`,
    l: `${U}/2022/05/web-20200218_173201.jpg`,
    m: `${U}/2026/04/image17.jpeg`, // Dance Floor
    n: `${U}/2026/04/image13.jpeg`, // !Nice wedding chairs
    o: `${U}/2026/04/image14.jpeg`, // !Nice few wedding chairs
    p: `${U}/2026/04/image16.jpeg`, // high tables with linens
    q: `${U}/2026/04/image22.jpeg`, // wedding dinner, tables, linens, chairs
    r: `${U}/2026/04/image27.jpeg`, // bar, side
    s: `${U}/2026/04/image28.jpeg`, // bar, front

  },
};

// --- Nav (logo sits in the middle on desktop) -------------------------------
export const navLeft = [
  { label: "Tents", href: "/tents" },
  { label: "Inflatables", href: "/inflatables" },
  { label: "Mechanical Bull", href: "/mechanical-bull" },
];
export const navRight = [
  { label: "Tables & Chairs", href: "/tables-chairs" },
  { label: "Contact", href: "/contact" },
];
export const navAll = [...navLeft, ...navRight];

// --- Home: hero carousel ----------------------------------------------------
export type Slide =
  | { kind: "photo"; src: string; alt: string }
  | { kind: "video"; src: string; poster: string; alt: string };

export const heroSlides: Slide[] = [
  {
    kind: "video",
    src: "/video/hero.mp4",
    poster: "/video/hero-poster.jpg",
    alt: "Above All Tent Rentals highlight reel",
  },
  /*
  { kind: "photo", src: photos.tents.old1, alt: "Event tent rental on Long Island" },
  { kind: "photo", src: photos.inflatables.f, alt: "Inflatable bouncy castle" },
  //{ kind: "photo", src: photos.inflatables.i, alt: "Palm Tree inflatable water slide" },
  { kind: "photo", src: photos.tents.new1, alt: "High-peak tent set for a backyard party" },
  { kind: "photo", src: photos.tents.new3, alt: "Tent with tables and chairs ready for guests" },
  { kind: "photo", src: photos.lounge.c, alt: "High-top tables and stools around a pool" },
  { kind: "photo", src: photos.inflatables.c, alt: "Inflatable water slide at a summer party" },
   */
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
    photo: photos.tents.old1,
    blurb: "Five sizes, from backyard birthdays to full tented events.",
  },
  {
    name: "Inflatables",
    href: "/inflatables",
    photo: photos.inflatables.g,
    blurb: "Bounce houses, water slides, Obstacle Courses.",
  },
  {
    name: "Tables & Chairs",
    href: "/tables-chairs",
    photo: photos.lounge.c,
    blurb: "Tables, chairs, linens, lighting, and LED pieces.",
  },
];

export const featureTile = {
  eyebrow: "The showstopper",
  name: "The Mechanical Bull",
  href: "/mechanical-bull",
  photo: photos.inflatables.bull0,
  blurb:
    "A pro operator, a big soft arena, and the thing everyone talks about for weeks. Books on its own line.",
};

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
// Each table can fit up to 10.
// `seatsMax` = tables × 10.
export type Tent = {
  size: string;
  w: number;
  l: number;
  sqft: number;
  tables: number;
  seatsMax: number;
  price: string | null;
};

// --- Gallery items (photo or video) -----------------------------------------
export type GalleryItem =
  | { kind: "photo"; src: string }
  | { kind: "video"; src: string; poster: string };

const photo = (src: string): GalleryItem => ({ kind: "photo", src });

const t = (w: number, l: number, tables: number): Tent => ({
  size: `${w} × ${l}`,
  w,
  l,
  sqft: w * l,
  tables,
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
    "High-peak frame tents in many sizes, delivered and set up anywhere on Long Island. Tell us your guest count and we'll size it for you — or use the guide below.",
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
    photo(photos.tents.new1),
    photo(photos.tents.new2),
    photo(photos.tents.new3),
    photo(photos.tents.new4),
    photo(photos.tents.new5),
    photo(photos.tents.new6),
    photo(photos.tents.new7),
    photo(photos.tents.old1),
    photo(photos.tents.old2),
    photo(photos.tents.old3),
  ],
};

export const calculatorCopy = {
  title: "What size tent do you need?",
  sub: "Each round table seats 10 guests",
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
      photo: photos.inflatables.f,
      price: null,
    },
    {
      name: "Water Slides",
      blurb: "Big slides for hot Long Island summers — graduation party essential.",
      photo: photos.inflatables.i,
      price: null,
    },
    {
      name: "Obstacle Courses",
      blurb: "Head-to-head races through tunnels, walls, and slides. Great for all ages.",
      photo: photos.inflatables.g,
      price: null,
    },
    {
      name: "Slip & Slides",
      blurb: "A backyard water-park lane. Pairs perfectly with a water slide.",
      photo: photos.inflatables.j,
      price: null,
    },
  ] as RentalItem[],
  gallery: [
    photo(photos.inflatables.a),
    photo(photos.inflatables.b),
    photo(photos.inflatables.c),
    photo(photos.inflatables.d),
    photo(photos.inflatables.f),
    photo(photos.inflatables.g),
    photo(photos.inflatables.h),
    photo(photos.inflatables.i),
    photo(photos.inflatables.j),
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
    "Cleaned & inspected before use",
    "Delivery, setup & takedown handled",
  ],
  note: "Weekends book fast — especially in summer.",
  price: null as string | null,
  photo: photos.inflatables.bull0,
  gallery: [
    photo(photos.inflatables.bull0),
    photo(photos.inflatables.bull1),
    { kind: "video", src: "/video/bull.mp4", poster: photos.inflatables.bullPoster },
  ] as GalleryItem[],
};

// ============================================================================
// LOUNGE & DECOR (includes tables, chairs & extras)
// ============================================================================
export const loungePage = {
  title: "Tables & Chairs",
  subtitle: "Tables, chairs, linens, lighting & more",
  intro:
    "Everything that furnishes the party — tables, chairs, linens, lighting, and lounge pieces that set your event apart. Each item is rented on its own, so you only pay for what you need.",
  items: [
    {
      name: "Round Tables",
      blurb: "Seats 10. The standard for dinners and parties.",
      photo: photos.lounge.a,
      price: null,
    },
    {
      name: "Banquet Tables",
      blurb: "Long tables for buffets, gifts, or family-style seating.",
      photo: photos.lounge.q,
      price: null,
    },
    {
      name: "High-Top Tables",
      blurb: "Cocktail-height tables that keep the crowd mingling.",
      photo: photos.lounge.p,
      price: null,
    },
    {
      name: "Stools and Light boxes",
      blurb: "White stools that pair with high-tops, plus glowing light boxes for evening events.",
      photo: photos.lounge.c,
      price: null,
    },
    {
      name: "Wedding Chairs",
      blurb: "Padded white wood folding chairs with a clean, finished look — the upgrade for weddings and formal events.",
      photo: photos.lounge.o,
      price: null,
    },
    {
      name: "Chairs",
      blurb: "Clean white folding chairs, delivered and set up with your tables.",
      photo: photos.tents.new7,
      price: null,
    },
    {
      name: "Table Linens",
      blurb: "Linens in the colors of your event, fitted to every table size.",
      photo: photos.lounge.b,
      price: null,
    },
    {
      name: "Bar",
      blurb: "A versatile 6-foot mobile bar with a bright white finish that adapts to any event aesthetic.",
      photo: photos.lounge.s,
      price: null,
    },
    {
      name: "Event Lighting",
      blurb: "String lights and uplighting under the tent and around the yard.",
      photo: photos.tents.new3,
      price: null,
    },
    {
      name: "Dance Floor",
      blurb: "A professional dance floor laid out cleanly underneath the tent for the party.",
      photo: photos.lounge.m,
      price: null,
    },
  ] as RentalItem[],
  note: "Don't see what you're looking for? Ask — if we don't have it, we'll help you find it.",
  gallery: [
    photo(photos.lounge.a),
    photo(photos.lounge.b),
    photo(photos.lounge.c),
    photo(photos.lounge.m),
    photo(photos.lounge.n),
    photo(photos.lounge.o),
    photo(photos.lounge.p),
    photo(photos.lounge.q),
    photo(photos.lounge.r),
    photo(photos.lounge.s),
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
  photos.tents.new6,
  photos.inflatables.f,
  photos.lounge.a,
  photos.inflatables.i,
];
