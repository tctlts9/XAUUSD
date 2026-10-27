import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const svgPath = path.join(rootDir, 'public', 'icon.svg');

async function generate() {
  const svgBuffer = fs.readFileSync(svgPath);

  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(rootDir, 'public', 'pwa-192x192.png'));
  console.log('Created pwa-192x192.png');

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(rootDir, 'public', 'pwa-512x512.png'));
  console.log('Created pwa-512x512.png');

  // Apple touch icon 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(rootDir, 'public', 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // Maskable 512x512 with 15% safe padding
  // Inner icon resized to 410x410 and centered on 512x512 #030712 canvas
  const innerIcon = await sharp(svgBuffer)
    .resize(410, 410)
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 3, g: 7, b: 18, alpha: 1 }
    }
  })
    .composite([{ input: innerIcon, gravity: 'center' }])
    .png()
    .toFile(path.join(rootDir, 'public', 'pwa-maskable-512x512.png'));
  console.log('Created pwa-maskable-512x512.png');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
