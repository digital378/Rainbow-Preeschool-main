/**
 * National Symbols of India (Symbol Trail) — Craft Trail activities.
 *
 * Single source of truth shared by the client page
 * (client/src/pages/national-symbols-of-india.tsx) and the bot-SSR entry
 * (server/ssr-pages.ts, HowTo JSON-LD) so visible crafts and schema can't drift.
 *
 * Text is client-specified — keep verbatim. The flag craft is intentionally
 * NOT here; it lives in the Independence Day guide and is linked, not repeated.
 */

export interface NationalSymbolCraft {
  name: string;
  instruction: string;
  time: string;
  ages: string;
  zone: "identity" | "wild" | "nature";
}

export const NATIONAL_SYMBOLS_CRAFTS: NationalSymbolCraft[] = [
  { name: "Lion Coin Rubbing (Emblem)", instruction: "Place a coin under a sheet of paper and gently rub a crayon over it until the lions appear.", time: "10 mins", ages: "Ages 3–6", zone: "identity" },
  { name: "₹ Symbol Stamp Card (Currency)", instruction: "Cut a sponge into the ₹ shape, dip in paint, and stamp it onto a handmade greeting card.", time: "15 mins", ages: "Ages 2–5", zone: "identity" },
  { name: "Stripy Tiger Mask", instruction: "Paint orange and black stripes on a paper plate, cut eye-holes, and attach elastic string.", time: "20 mins", ages: "Ages 3–6", zone: "wild" },
  { name: "Handprint Peacock", instruction: "Paint a handprint in blues and greens, then add a peacock body and googly eye.", time: "15 mins", ages: "Ages 2–5", zone: "wild" },
  { name: "Elephant Handprint", instruction: "Grey paint on the palm (head) with spread fingers (trunk and ears).", time: "15 mins", ages: "Ages 1.5–4", zone: "wild" },
  { name: "Potato-Print Lotus", instruction: "Carve a potato half into a petal shape, dip in pink and white paint, and print a blooming lotus.", time: "20 mins", ages: "Ages 3–6", zone: "nature" },
  { name: "Banyan Leaf Rubbing", instruction: "Place a real leaf under paper and rub gently with a crayon to reveal its veins.", time: "10 mins", ages: "Ages 2–6", zone: "nature" },
  { name: "Pumpkin Seed Sensory Bin", instruction: "Scoop, count and wash real pumpkin seeds in a bowl with small cups and spoons.", time: "20 mins", ages: "Ages 1.5–4", zone: "nature" },
];
