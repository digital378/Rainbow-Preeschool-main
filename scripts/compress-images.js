import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../attached_assets');
const outputDir = path.join(__dirname, '../public/images/optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const imageFiles = fs.readdirSync(inputDir).filter(file => 
  file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
);

async function compressImages() {
  console.log(`Found ${imageFiles.length} images to compress...`);
  
  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const baseName = file.replace(/\.[^/.]+$/, '').replace(/_\d{10,}$/, '');
    const outputPath = path.join(outputDir, `${baseName}.webp`);
    
    try {
      await sharp(inputPath)
        .resize(1200, 800, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      const inputStats = fs.statSync(inputPath);
      const outputStats = fs.statSync(outputPath);
      const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
      
      console.log(`✓ ${file} -> ${baseName}.webp (${savings}% smaller)`);
    } catch (err) {
      console.error(`✗ Error processing ${file}:`, err.message);
    }
  }
  
  console.log('\nDone! Optimized images saved to public/images/optimized/');
}

compressImages();
