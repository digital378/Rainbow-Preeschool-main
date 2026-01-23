import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const HERO_WIDTH = 1200;
const HERO_QUALITY = 75;
const GALLERY_WIDTH = 800;
const GALLERY_QUALITY = 70;

const outputDir = 'public/images/optimized';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImage(inputPath, outputName, width, quality) {
  const outputPath = path.join(outputDir, outputName);
  
  try {
    const info = await sharp(inputPath)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality })
      .toFile(outputPath);
    
    const inputSize = fs.statSync(inputPath).size;
    console.log(`✓ ${path.basename(inputPath)} → ${outputName}`);
    console.log(`  ${(inputSize / 1024).toFixed(0)}KB → ${(info.size / 1024).toFixed(0)}KB (${((1 - info.size / inputSize) * 100).toFixed(0)}% smaller)`);
    return true;
  } catch (err) {
    console.error(`✗ Failed: ${inputPath}`, err.message);
    return false;
  }
}

async function main() {
  console.log('=== Optimizing Hero Banners ===\n');
  
  const heroBanners = [
    { input: 'attached_assets/RPS_Hero_Banner_1_1766120180205.jpg', output: 'hero-banner-1.webp' },
    { input: 'attached_assets/RPS_Hero_Banner_2_1766120180204.jpg', output: 'hero-banner-2.webp' },
    { input: 'attached_assets/RPS_Hero_Banner_3_1766120180205.jpg', output: 'hero-banner-3.webp' },
    { input: 'attached_assets/RPS_Hero_Banner_4_1766120180204.jpg', output: 'hero-banner-4.webp' },
  ];
  
  for (const banner of heroBanners) {
    if (fs.existsSync(banner.input)) {
      await optimizeImage(banner.input, banner.output, HERO_WIDTH, HERO_QUALITY);
    }
  }
  
  console.log('\n=== Optimizing Gallery/Classroom Images ===\n');
  
  const galleryImages = fs.readdirSync('attached_assets')
    .filter(f => f.startsWith('DSC') && f.endsWith('.jpg'))
    .slice(0, 12);
  
  for (const img of galleryImages) {
    const outputName = img.replace(/\.jpg$/, '.webp').replace(/_\d+\.webp$/, '.webp');
    await optimizeImage(
      path.join('attached_assets', img),
      outputName,
      GALLERY_WIDTH,
      GALLERY_QUALITY
    );
  }
  
  console.log('\n=== Summary ===');
  const files = fs.readdirSync(outputDir);
  let totalSize = 0;
  for (const f of files) {
    totalSize += fs.statSync(path.join(outputDir, f)).size;
  }
  console.log(`Total optimized images: ${files.length}`);
  console.log(`Total size: ${(totalSize / 1024).toFixed(0)}KB`);
}

main().catch(console.error);
