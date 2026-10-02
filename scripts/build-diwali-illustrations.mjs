/**
 * Original, non-photo festival artwork. No children or event imagery.
 * The palette follows the existing Navratri guide; Sharp produces delivery
 * formats from the same SVG drawings so the hero and social card stay aligned.
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const directory = resolve("public/images");
await mkdir(resolve(directory, "og"), { recursive: true });
const palette = ["#EC210F", "#B9862A", "#2E7A4E", "#33507F"];
const wrap = (content, width = 1200, height = 900) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#FFFAF3"/><stop offset="1" stop-color="#FBEEDA"/></linearGradient><linearGradient id="clay" x2="0" y2="1"><stop stop-color="#F0803A"/><stop offset="1" stop-color="#A83E13"/></linearGradient><linearGradient id="flame" x2="0" y2="1"><stop stop-color="#FFE9B0"/><stop offset="1" stop-color="#F5A623"/></linearGradient></defs>${content}</svg>`;
const diya = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})"><ellipse cx="0" cy="85" rx="130" ry="20" fill="#241A12" opacity=".09"/><path d="M-122 0Q0 50 122 0Q109 98 0 98Q-109 98-122 0" fill="url(#clay)"/><ellipse cy="0" rx="122" ry="32" fill="#F5934B" stroke="#B9862A" stroke-width="5"/><ellipse cy="-1" rx="100" ry="23" fill="#FBEEDA"/><path d="M0-10C-63-63-3-100 5-162C15-118 64-80 37-35Q18-5 0-10" fill="url(#flame)"/><path d="M9-19C-20-42 9-61 15-93Q43-40 9-19" fill="#FFFAF3"/><path d="M-92 47Q0 83 92 47" fill="none" stroke="#FFD98A" stroke-width="6" stroke-linecap="round"/>${[-65,-32,0,32,65].map(x => `<circle cx="${x}" cy="45" r="5" fill="#FFD98A"/>`).join("")}</g>`;
const rangoli = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})">${Array.from({length: 12}, (_, i) => `<g transform="rotate(${i*30})"><ellipse cy="-98" rx="23" ry="69" fill="${palette[i % palette.length]}" opacity=".82"/><ellipse cy="-111" rx="9" ry="32" fill="#FFFAF3" opacity=".78"/><circle cy="-185" r="7" fill="#B9862A"/></g>`).join("")}<circle r="54" fill="#F6EAD1" stroke="#B9862A" stroke-width="5"/><circle r="26" fill="#EC210F"/><circle r="9" fill="#FFD98A"/></g>`;
const kandil = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0-160V-95" stroke="#B9862A" stroke-width="5"/><path d="M0-105L78-42V49L0 83L-78 49V-42Z" fill="#EC210F" stroke="#A9140A" stroke-width="5"/><path d="M0-105V83M-78-42L0-8L78-42M-78 49L0-8L78 49" fill="none" stroke="#FFD98A" stroke-width="6"/><path d="M-78-42L0-8L0 83L-78 49Z" fill="#B9862A" opacity=".45"/>${[-58,-29,0,29,58].map((x,i)=>`<path d="M${x} 78V${160+(i%2)*20}" stroke="${i%2?'#B9862A':'#EC210F'}" stroke-width="17"/>`).join("")}</g>`;
const lotus = (x, y, scale=1) => `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0 75Q-148 17-151-68Q-51-49 0 75M0 75Q148 17 151-68Q51-49 0 75" fill="#EC210F" opacity=".7"/><path d="M0 75Q-101-55 0-173Q101-55 0 75" fill="#EC210F"/><path d="M-130 79Q0 119 130 79" fill="none" stroke="#2E7A4E" stroke-width="18" stroke-linecap="round"/></g>`;
const fort = (x,y,scale=1) => `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-145-80h36v-35h32v35h36v-35h32v35h36v-35h32v35h36v-35h32v35h38v156h-310Z" fill="#C69563" stroke="#8F6316" stroke-width="5"/><path d="M-32 77V7a32 32 0 0 1 64 0v70" fill="#8F6316"/><path d="M-145-23h310M-145 29h104M41 29h124M-90-77v54M80-77v54" stroke="#8F6316" stroke-width="5" opacity=".5"/><path d="M-107-117v-81M-107-193l59 20-59 20" stroke="#EC210F" stroke-width="6" fill="#EC210F"/></g>`;
const stars = `<g fill="#B9862A">${[[91,117],[1050,668],[218,661],[996,356],[645,107],[86,450]].map(([x,y])=>`<path transform="translate(${x} ${y})" d="M0-12L4-4L12 0L4 4L0 12L-4 4L-12 0L-4-4Z"/>`).join("")}</g>`;
const hero = wrap(`<rect width="1200" height="900" rx="70" fill="url(#paper)"/><rect x="28" y="28" width="1144" height="844" rx="54" fill="none" stroke="#EAD8BE" stroke-width="3"/><circle cx="605" cy="443" r="282" fill="#F6EAD1"/><circle cx="605" cy="443" r="249" fill="none" stroke="#B9862A" stroke-width="2" stroke-dasharray="4 12"/>${rangoli(600,445,1.13)}${kandil(249,208,.82)}${kandil(963,183,.72)}${diya(592,654,1.48)}${diya(269,750,.59)}${diya(923,750,.59)}${stars}`);
const heroName = "diwali-activities-for-kindergarten-2026-hero";
await writeFile(resolve(directory, `${heroName}.svg`), hero);
for (const width of [320,480,640,960,1200]) {
  const base = sharp(Buffer.from(hero)).resize(width, Math.round(width * .75));
  await base.clone().webp({quality:82}).toFile(resolve(directory, `${heroName}-${width}.webp`));
  await base.clone().avif({quality:52,effort:5}).toFile(resolve(directory, `${heroName}-${width}.avif`));
}
await sharp(Buffer.from(hero)).webp({quality:85}).toFile(resolve(directory, `${heroName}.webp`));
await sharp(Buffer.from(hero)).avif({quality:55,effort:5}).toFile(resolve(directory, `${heroName}.avif`));
await sharp(Buffer.from(hero))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({quality:88,mozjpeg:true})
  .toFile(resolve(directory,"og","diwali-activities-for-kindergarten-2026-og.jpg"));

const paintArt = `<g stroke-width="14" stroke-linecap="round">${Array.from({length:10},(_,i)=>`<path transform="translate(600 420) rotate(${i*36})" d="M0-75V-175" stroke="${palette[i%4]}"/>`).join("")}</g>`;
const card = `<rect x="350" y="215" width="500" height="470" rx="18" fill="#FFF" stroke="#EAD8BE" stroke-width="8"/><path d="M600 217v466" stroke="#EAD8BE" stroke-width="5"/>${diya(607,480,.85)}`;
const handprint = `<g fill="#EC210F" transform="translate(600 490)"><ellipse rx="98" ry="118"/>${[-77,-37,4,47,86].map((x,i)=>`<rect x="${x-14}" y="${-235+Math.abs(i-2)*19}" width="29" height="177" rx="15" transform="rotate(${(i-2)*7} ${x} -100)"/>`).join("")}<path d="M-77-31Q-189-141-212-65Q-179 32-78 65Z"/></g>${diya(600,625,.55)}`;
const matching = `${rangoli(600,389,1)}${palette.map((color,i)=>`<rect x="${370+i*125}" y="650" width="95" height="60" rx="14" fill="${color}"/>`).join("")}`;
const count = `${[-1,0,1].map((i)=>diya(600+i*235,440,.70)).join("")}${[365,600,835].map((x,i)=>`<g fill="#B9862A">${Array.from({length:i+1},(_,j)=>`<circle cx="${x+(j-i/2)*25}" cy="620" r="8"/>`).join("")}</g>`).join("")}`;
const crafts = [
  ["diwali-craft-for-kids-paper-plate-diya",diya(600,490,1.3)],
  ["diwali-craft-for-kids-clay-diya",diya(600,490,1.3)],
  ["diwali-craft-for-kids-handprint-diya",handprint],
  ["easy-rangoli-for-kids",rangoli(600,445,1.4)],
  ["akash-kandil-for-kids",kandil(600,380,1.5)],
  ["diwali-greeting-card-for-kids",card],
  ["diwali-lotus-craft-for-kids",lotus(600,500,1.5)],
  ["diwali-firework-paint-art-for-kids",paintArt],
  ["counting-diyas-for-kids",count],
  ["rangoli-colour-matching-for-kids",matching],
  ["mini-killa-fort-for-kids",fort(600,490,1.45)],
];
for (const [name, drawing] of crafts) {
  const art = wrap(`<rect width="1200" height="900" rx="70" fill="url(#paper)"/>${drawing}`);
  await sharp(Buffer.from(art)).resize(320,240).webp({quality:83}).toFile(resolve(directory, `${name}.webp`));
}
console.log(`Created original Diwali hero, responsive AVIF/WebP sizes, 1200×630 OG and ${crafts.length} craft illustrations.`);