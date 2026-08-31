import { mkdir, writeFile } from "fs/promises";
import { resolve } from "path";
import sharp from "sharp";

const outputDir = resolve("public", "janmashtami-for-kids");

const designs = [
  { slug: "baby-krishna-dp", title: "Happy Janmashtami 2026!", subtitle: "Little Gopal's birthday", bg: "#EC210F", accent: "#FFD166", art: "krishna" },
  { slug: "peacock-feather", title: "Little Gopal's Birthday!", subtitle: "Colour, wonder, and joy", bg: "#0D788C", accent: "#FFE29A", art: "feather" },
  { slug: "butter-pot", title: "Govinda Ala Re!", subtitle: "Butter, giggles, and friends", bg: "#E87927", accent: "#FFF2C7", art: "pot" },
  { slug: "krishna-cow", title: "Jai Shri Krishna", subtitle: "Kind hearts grow together", bg: "#6B3D89", accent: "#FFE3A1", art: "cow" },
  { slug: "crown-colouring", title: "Colour Me — Krishna's Crown!", subtitle: "A little creative time", bg: "#F5D5B8", accent: "#EC210F", art: "crown" },
  { slug: "symbol-grid", title: "Krishna's Favourite Things", subtitle: "Flute · Feather · Butter · Cow", bg: "#2E5FA7", accent: "#FFD166", art: "symbols" },
  { slug: "event-template", title: "[School Event Name]", subtitle: "Janmashtami 2026 · Rainbow Preschools", bg: "#EC210F", accent: "#FFF8EE", art: "event" },
  { slug: "gopal-badge", title: "Proud Little Gopal/Gopi", subtitle: "Rainbow Preschools · Janmashtami 2026", bg: "#F2B84B", accent: "#7E1D1D", art: "badge" },
  { slug: "caption-card", title: "[Insert caption]", subtitle: "A joyful Janmashtami memory", bg: "#9E2C2B", accent: "#FFF8EE", art: "caption" },
  { slug: "colouring-page", title: "My Krishna Coloring Page", subtitle: "Colour with love and joy", bg: "#FFF8EE", accent: "#EC210F", art: "colouring" },
];

function artMarkup(kind: string, accent: string): string {
  if (kind === "krishna") {
    return `<circle cx="540" cy="470" r="155" fill="#5A2E4C"/><circle cx="540" cy="510" r="120" fill="#4C9FC0"/><circle cx="495" cy="475" r="14" fill="#27191A"/><circle cx="585" cy="475" r="14" fill="#27191A"/><path d="M490 550 Q540 585 590 550" fill="none" stroke="#27191A" stroke-width="12" stroke-linecap="round"/><path d="M575 325 Q700 210 730 345 Q650 330 575 380Z" fill="${accent}"/><path d="M700 235 Q650 280 620 360" fill="none" stroke="#0D788C" stroke-width="18"/><rect x="325" y="635" width="430" height="28" rx="14" fill="${accent}" transform="rotate(-12 540 649)"/><circle cx="540" cy="665" r="17" fill="#EC210F"/>`;
  }
  if (kind === "feather") {
    return `<path d="M540 720 C310 590 390 250 650 230 C785 220 850 330 770 465 C700 580 610 635 540 720Z" fill="${accent}" opacity=".9"/><path d="M540 720 C555 520 590 335 700 260" fill="none" stroke="#0D788C" stroke-width="18"/><ellipse cx="675" cy="360" rx="50" ry="85" fill="#23788C"/><ellipse cx="675" cy="360" rx="27" ry="49" fill="#3F559C"/><circle cx="675" cy="360" r="13" fill="#F1C34C"/>`;
  }
  if (kind === "pot") {
    return `<path d="M325 390 Q540 330 755 390 L700 700 Q540 820 380 700Z" fill="${accent}"/><path d="M325 390 Q540 330 755 390 L748 450 Q540 510 332 450Z" fill="#B87548"/><path d="M390 360 Q540 310 690 360" fill="none" stroke="#FFF8EE" stroke-width="28"/><circle cx="540" cy="550" r="34" fill="#EC210F"/><path d="M425 705 Q540 790 655 705" fill="none" stroke="#EC210F" stroke-width="18"/>`;
  }
  if (kind === "cow") {
    return `<ellipse cx="550" cy="540" rx="225" ry="160" fill="#FFF8EE"/><circle cx="755" cy="485" r="100" fill="#FFF8EE"/><path d="M700 415 L650 330 L735 390 M810 415 L860 330 L775 390" fill="#FFF8EE" stroke="#3D2019" stroke-width="12"/><circle cx="730" cy="475" r="12" fill="#3D2019"/><circle cx="780" cy="475" r="12" fill="#3D2019"/><path d="M742 530 Q760 548 778 530" fill="none" stroke="#3D2019" stroke-width="10"/><path d="M430 650 L415 760 M620 650 L635 760" stroke="#3D2019" stroke-width="22" stroke-linecap="round"/><path d="M320 490 Q190 390 275 300" fill="none" stroke="${accent}" stroke-width="22"/>`;
  }
  if (kind === "crown") {
    return `<path d="M280 700 L310 330 L440 490 L540 270 L640 490 L770 330 L800 700Z" fill="none" stroke="${accent}" stroke-width="26" stroke-linejoin="round"/><path d="M290 700 Q540 770 790 700" fill="none" stroke="${accent}" stroke-width="30"/><circle cx="540" cy="270" r="27" fill="${accent}"/><circle cx="440" cy="490" r="23" fill="${accent}"/><circle cx="640" cy="490" r="23" fill="${accent}"/>`;
  }
  if (kind === "symbols") {
    return `<circle cx="390" cy="430" r="112" fill="${accent}"/><circle cx="690" cy="430" r="112" fill="#B7E5E9"/><circle cx="390" cy="700" r="112" fill="#FFD7D0"/><circle cx="690" cy="700" r="112" fill="#FFF8EE"/><path d="M335 430 Q390 370 450 430" fill="none" stroke="#2E5FA7" stroke-width="18"/><path d="M630 500 Q690 350 750 500" fill="none" stroke="#0D788C" stroke-width="22"/><circle cx="390" cy="700" r="40" fill="#B87548"/><path d="M650 700 Q690 650 730 700" fill="none" stroke="#7E1D1D" stroke-width="18"/>`;
  }
  if (kind === "event") {
    return `<rect x="220" y="270" width="640" height="470" rx="34" fill="${accent}" opacity=".96"/><path d="M310 420 H770 M310 500 H650 M310 580 H720" stroke="${accent === "#FFF8EE" ? "#EC210F" : "#FFF8EE"}" stroke-width="24" stroke-linecap="round"/><circle cx="760" cy="620" r="44" fill="#F2B84B"/>`;
  }
  if (kind === "badge") {
    return `<circle cx="540" cy="520" r="230" fill="${accent}" stroke="#FFF8EE" stroke-width="20"/><path d="M440 360 Q540 220 640 360" fill="none" stroke="#0D788C" stroke-width="30"/><circle cx="540" cy="500" r="80" fill="#4C9FC0"/><path d="M490 575 Q540 615 590 575" fill="none" stroke="#3D2019" stroke-width="12"/><path d="M440 740 L640 740" stroke="${accent}" stroke-width="28"/>`;
  }
  if (kind === "caption") {
    return `<rect x="250" y="320" width="580" height="420" rx="28" fill="${accent}"/><path d="M335 450 H745 M335 535 H690 M335 620 H610" stroke="#9E2C2B" stroke-width="22" stroke-linecap="round"/><circle cx="735" cy="675" r="32" fill="#F2B84B"/>`;
  }
  return `<path d="M300 720 L335 350 L440 500 L540 280 L640 500 L745 350 L780 720Z" fill="none" stroke="${accent}" stroke-width="22" stroke-linejoin="round"/><circle cx="540" cy="280" r="20" fill="${accent}"/><path d="M410 650 Q540 700 670 650" fill="none" stroke="${accent}" stroke-width="18"/>`;
}

function makeSvg(design: (typeof designs)[number]): string {
  const textColor = design.bg === "#FFF8EE" || design.bg === "#F5D5B8" || design.bg === "#F2B84B" ? "#7E1D1D" : "#FFF8EE";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
    <rect width="1080" height="1080" fill="${design.bg}"/>
    <circle cx="140" cy="135" r="90" fill="${design.accent}" opacity=".25"/>
    <circle cx="940" cy="880" r="150" fill="${design.accent}" opacity=".18"/>
    <path d="M80 855 Q280 740 490 855 T1000 855" fill="none" stroke="${design.accent}" stroke-width="5" opacity=".6"/>
    ${artMarkup(design.art, design.accent)}
    <text x="540" y="130" text-anchor="middle" fill="${textColor}" font-family="Verdana, sans-serif" font-size="42" font-weight="700">${design.title.replace(/&/g, "&amp;")}</text>
    <text x="540" y="925" text-anchor="middle" fill="${textColor}" font-family="Verdana, sans-serif" font-size="25">${design.subtitle.replace(/&/g, "&amp;")}</text>
    <text x="945" y="1015" text-anchor="end" fill="${textColor}" font-family="Verdana, sans-serif" font-size="18" font-weight="700">RAINBOW PRESCHOOLS</text>
  </svg>`;
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  for (const design of designs) {
    const svg = makeSvg(design);
    const input = Buffer.from(svg);
    await writeFile(resolve(outputDir, `janmashtami-2026-rps-${design.slug}.svg`), input);
    await sharp(input).resize(1080, 1080).webp({ quality: 78 }).toFile(resolve(outputDir, `janmashtami-2026-rps-${design.slug}.webp`));
    await sharp(input).resize(1080, 1080).jpeg({ quality: 78 }).toFile(resolve(outputDir, `janmashtami-2026-rps-${design.slug}.jpg`));
  }
  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 153 >>
stream
q
1 0 0 1 0 0 cm
0.92 0.13 0.06 RG
4 w
120 180 m 145 620 l 210 445 l 297 700 l 384 445 l 450 620 l 475 180 l 120 180 l S
BT /F1 20 Tf 160 750 Td (My Krishna Coloring Page) Tj ET
Q
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000300 00000 n 
0000000370 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
575
%%EOF`;
  await writeFile(resolve(outputDir, "janmashtami-2026-rps-colouring-page.pdf"), pdf);
  console.log(`Generated ${designs.length} Janmashtami artwork sets in ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});