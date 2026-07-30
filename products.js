/* ============================================================
   Marginalia — product data
   16 fictional books. Categories double as "spine colour".
   ============================================================ */

const CATEGORY_COLORS = {
  "Fiction":     "#7A2E2E",
  "Sci-Fi":      "#2E4A5C",
  "Fantasy":     "#4B3F72",
  "Mystery":     "#26241F",
  "Poetry":      "#8C6B4F",
  "Biography":   "#3D5A45",
  "Classics":    "#A9793F",
  "Non-Fiction": "#5C4A72"
};

const PRODUCTS = [
  { id: 1,  title: "The Salt House",              author: "Marguerite Vane",   category: "Fiction",     price: 12.99, featured: true,
    blurb: "A crumbling house on a tidal island holds three generations of a family's unspoken bargains. When the youngest daughter returns to sell it, the sea has other plans." },
  { id: 2,  title: "Nine Winters",                 author: "Callum Reyes",      category: "Fiction",     price: 11.50, featured: false,
    blurb: "Told backward, one winter at a time, this is the story of a marriage unravelling in reverse — from a quiet ending to the loud, reckless beginning." },
  { id: 3,  title: "The Glass Meridian",            author: "Odalys Kern",       category: "Sci-Fi",      price: 14.00, featured: true,
    blurb: "A cartographer aboard a generation ship discovers the stars they're navigating by no longer exist — and neither, perhaps, does home." },
  { id: 4,  title: "Static Orbit",                  author: "Theo Marsh",        category: "Sci-Fi",      price: 13.50, featured: false,
    blurb: "On a satellite repair crew with a two-week memory limit, one technician starts finding notes in her own handwriting she doesn't remember writing." },
  { id: 5,  title: "The Cartographer's Oath",       author: "Wren Halloway",     category: "Fantasy",     price: 15.99, featured: true,
    blurb: "Maps in this kingdom don't just show the land — they hold it in place. A disgraced mapmaker is the only one who can redraw a border before it collapses." },
  { id: 6,  title: "Ashes of the Hollow King",       author: "Idris Fenn",        category: "Fantasy",     price: 16.50, featured: false,
    blurb: "The old king is dead and his crown answers to no one. Five claimants, one burning throne room, and a debt older than the kingdom itself." },
  { id: 7,  title: "The Quiet Ledger",               author: "Nora Pemberton",    category: "Mystery",     price: 10.99, featured: true,
    blurb: "A small-town accountant finds a decades-old debt in the books that was never supposed to be paid — and someone is now paying it, in full." },
  { id: 8,  title: "A Door Left Ajar",                author: "Simeon Locke",      category: "Mystery",     price: 11.25, featured: false,
    blurb: "Every house on the street has the same floor plan. Only one of them has a room that isn't on any blueprint." },
  { id: 9,  title: "Small Weather",                   author: "June Alcott",       category: "Poetry",      price: 9.50,  featured: true,
    blurb: "A collection of quiet, domestic poems about the weather inside a house — kettles, drafts, the particular light of a Tuesday." },
  { id: 10, title: "Tongues of Dust",                 author: "Rafael Ondo",       category: "Poetry",      price: 9.99,  featured: false,
    blurb: "Poems written from the drought years, tracing what a land remembers even after the rain finally comes back." },
  { id: 11, title: "Underfoot: A Life in Gardens",     author: "Eleanor Voss",      category: "Biography",   price: 13.75, featured: true,
    blurb: "The memoir of a self-taught landscaper who spent sixty years turning neglected plots into the gardens no one asked for but everyone needed." },
  { id: 12, title: "The Long Apprenticeship",           author: "Marcus Tade",       category: "Biography",   price: 14.25, featured: false,
    blurb: "A luthier's account of forty years learning an instrument-maker's trade from a master who never once said 'well done.'" },
  { id: 13, title: "The Widow's Almanac",               author: "H. G. Thorne",      category: "Classics",    price: 8.99,  featured: false,
    blurb: "A beloved 19th-century novel of manners, inheritance, and one widow's quiet refusal to remarry for anyone's convenience but her own." },
  { id: 14, title: "Letters from the Faraway Room",      author: "C. M. Radcliffe",   category: "Classics",    price: 8.50,  featured: false,
    blurb: "An epistolary classic: a governess writes home from a house with too many locked doors, one letter a week, for a year." },
  { id: 15, title: "The Grammar of Rivers",              author: "Priya Nandakumar",  category: "Non-Fiction", price: 16.99, featured: false,
    blurb: "A field naturalist explains how rivers 'speak' through sediment, sound, and shape — and what we lose when we straighten them." },
  { id: 16, title: "How Cities Forget",                   author: "Dominic Ashworth",  category: "Non-Fiction", price: 15.50, featured: false,
    blurb: "An urban historian traces the buildings, streets, and rituals that cities quietly erase, and the ones that refuse to be forgotten." }
];

function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

/* ------------------------------------------------------------
   Generates a book-cover as an inline SVG data URI.
   Keeps every "product image" consistent, on-brand, and
   dependency-free (no external image hosting required).
   ------------------------------------------------------------ */
function wrapTitle(title, maxChars) {
  const words = title.split(" ");
  const lines = [];
  let line = "";
  words.forEach(word => {
    const trial = line ? line + " " + word : word;
    if (trial.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = trial;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function coverSVG(book) {
  const base = CATEGORY_COLORS[book.category] || "#7A2E2E";
  const lines = wrapTitle(book.title, 14);
  const startY = 130 - (lines.length - 1) * 13;
  const titleTspans = lines.map((l, i) =>
    `<tspan x="100" y="${startY + i * 26}">${escapeXML(l)}</tspan>`
  ).join("");

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
    <defs>
      <linearGradient id="g${book.id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${base}"/>
        <stop offset="100%" stop-color="${shade(base, -18)}"/>
      </linearGradient>
    </defs>
    <rect width="200" height="300" fill="url(#g${book.id})"/>
    <rect x="10" y="10" width="180" height="280" fill="none" stroke="rgba(251,248,242,0.35)" stroke-width="1.5"/>
    <line x1="24" y1="60" x2="176" y2="60" stroke="rgba(251,248,242,0.5)" stroke-width="1"/>
    <text x="100" y="45" text-anchor="middle" font-family="Karla, sans-serif" font-size="9" letter-spacing="3" fill="rgba(251,248,242,0.75)">${escapeXML(book.category.toUpperCase())}</text>
    <text text-anchor="middle" font-family="'Fraunces', Georgia, serif" font-size="21" font-weight="600" fill="#FBF8F2">${titleTspans}</text>
    <line x1="70" y1="${startY + lines.length * 26 - 2}" x2="130" y2="${startY + lines.length * 26 - 2}" stroke="rgba(251,248,242,0.5)" stroke-width="1"/>
    <text x="100" y="270" text-anchor="middle" font-family="Karla, sans-serif" font-size="11" letter-spacing="1" fill="rgba(251,248,242,0.85)">${escapeXML(book.author)}</text>
  </svg>`.trim();

  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function shade(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) + Math.round(2.55 * percent);
  let g = ((num >> 8) & 0x00ff) + Math.round(2.55 * percent);
  let b = (num & 0x0000ff) + Math.round(2.55 * percent);
  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);
  return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

function escapeXML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatPrice(n) {
  return "£" + n.toFixed(2);
}
