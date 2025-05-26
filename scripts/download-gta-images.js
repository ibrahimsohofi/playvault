import { createWriteStream, existsSync, mkdirSync, unlink } from 'fs';
import { get } from 'https';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create images directory if it doesn't exist
const imagesDir = join(__dirname, '../public/images/games/truck-simulator');
if (!existsSync(imagesDir)) {
  mkdirSync(imagesDir, { recursive: true });
}

// Function to download a file
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(filepath);
    get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Download GTA: San Andreas screenshots (1-10)
async function downloadScreenshots() {
  console.log('Downloading GTA: San Andreas screenshots...');
  
  for (let i = 1; i <= 10; i++) {
    const url = `https://imag.malavida.com/mvimgbig/download-fs/gta-san-andreas-5044-${i}.jpg`;
    const filename = `screenshot-${i}.jpg`;
    const filepath = join(imagesDir, filename);
    
    try {
      await downloadFile(url, filepath);
      console.log(`✓ Downloaded ${filename}`);
    } catch (error) {
      console.error(`✗ Failed to download ${filename}:`, error.message);
    }
    
    // Add a small delay between downloads to be respectful to the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Download GTA: San Andreas logo
async function downloadLogo() {
  console.log('\nDownloading GTA: San Andreas logo...');
  
  const logoUrl = 'https://i.pinimg.com/736x/49/b2/c2/49b2c276de1754f15977f1de177e7ac2.jpg';
  const logoPath = join(imagesDir, 'logo.jpg');
  
  try {
    await downloadFile(logoUrl, logoPath);
    console.log('✓ Downloaded logo.jpg');
  } catch (error) {
    console.error('✗ Failed to download logo:', error.message);
  }
}

// Run the downloads
async function main() {
  try {
    await downloadScreenshots();
    await downloadLogo();
    console.log('\nAll downloads completed!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
