import { createWriteStream, existsSync, mkdirSync, unlink } from 'fs';
import { get } from 'https';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Game configurations
const games = [
  {
    name: 'fifa-24',
    displayName: 'EA SPORTS FC 24',
    logoUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/60eca2ac155247e8e0d9a9a4d3c1b9a2e2f7c8d5a9b1c2d3e4f5a6b7c8d9e0f1.png',
    screenshots: [
      'https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/60eca2ac155247e8e0d9a9a4d3c1b9a2e2f7c8d5a9b1c2d3e4f5a6b7c8d9e0f1.png',
      'https://media.contentapi.ea.com/content/dam/ea/fc/fc-24/gameplay/sep-23/29/fc24-screenshot-16x9-1.jpg.adapt.crop191x100.1200w.jpg',
      'https://media.contentapi.ea.com/content/dam/ea/fc/fc-24/gameplay/sep-23/29/fc24-screenshot-16x9-2.jpg.adapt.crop191x100.1200w.jpg',
      'https://media.contentapi.ea.com/content/dam/ea/fc/fc-24/gameplay/sep-23/29/fc24-screenshot-16x9-3.jpg.adapt.crop191x100.1200w.jpg',
      'https://media.contentapi.ea.com/content/dam/ea/fc/fc-24/gameplay/sep-23/29/fc24-screenshot-16x9-4.jpg.adapt.crop191x100.1200w.jpg',
      'https://media.contentapi.ea.com/content/dam/ea/fc/fc-24/gameplay/sep-23/29/fc24-screenshot-16x9-5.jpg.adapt.crop191x100.1200w.jpg',
      'https://media.contentapi.ea.com/content/dam/ea/fc/fc-24/gameplay/sep-23/29/fc24-screenshot-16x9-6.jpg.adapt.crop191x100.1200w.jpg'
    ]
  },
  {
    name: 'call-of-duty',
    displayName: 'Call of Duty: Modern Warfare III',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Call_of_Duty_Modern_Warfare_III_logo.svg/1200px-Call_of_Duty_Modern_Warfare_III_logo.svg.png',
    screenshots: [
      'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/mw3/media/screenshots/mw3-screenshot-001.jpg',
      'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/mw3/media/screenshots/mw3-screenshot-002.jpg',
      'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/mw3/media/screenshots/mw3-screenshot-003.jpg',
      'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/mw3/media/screenshots/mw3-screenshot-004.jpg',
      'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/mw3/media/screenshots/mw3-screenshot-005.jpg',
      'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/mw3/media/screenshots/mw3-screenshot-006.jpg'
    ]
  },
  {
    name: 'need-for-speed',
    displayName: 'Need for Speed Unbound',
    logoUrl: 'https://media.ea.com/content/dam/gin/images/2022/10/06/ea-featured-image-nfs-unbound-keyart.jpg',
    screenshots: [
      'https://media.ea.com/content/dam/gin/images/2022/10/06/nfs-unbound-screenshot-01.jpg',
      'https://media.ea.com/content/dam/gin/images/2022/10/06/nfs-unbound-screenshot-02.jpg',
      'https://media.ea.com/content/dam/gin/images/2022/10/06/nfs-unbound-screenshot-03.jpg',
      'https://media.ea.com/content/dam/gin/images/2022/10/06/nfs-unbound-screenshot-04.jpg',
      'https://media.ea.com/content/dam/gin/images/2022/10/06/nfs-unbound-screenshot-05.jpg',
      'https://media.ea.com/content/dam/gin/images/2022/10/06/nfs-unbound-screenshot-06.jpg'
    ]
  }
];

// Function to download a file
async function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(filepath);
    get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Handle redirect
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: Status ${response.statusCode}`));
        return;
      }
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

// Download all games
async function downloadAllGames() {
  for (const game of games) {
    const gameDir = join(__dirname, '..', 'public', 'images', 'games', game.name);
    
    // Create game directory if it doesn't exist
    if (!existsSync(gameDir)) {
      mkdirSync(gameDir, { recursive: true });
    }
    
    console.log(`\nDownloading ${game.displayName}...`);
    
    try {
      // Download logo
      const logoPath = join(gameDir, 'logo.jpg');
      await downloadFile(game.logoUrl, logoPath);
      console.log(`✓ Downloaded ${game.name} logo`);
      
      // Download screenshots
      for (let i = 0; i < game.screenshots.length; i++) {
        const screenshotUrl = game.screenshots[i];
        const screenshotPath = join(gameDir, `screenshot-${i + 1}.jpg`);
        await downloadFile(screenshotUrl, screenshotPath);
        console.log(`✓ Downloaded ${game.name} screenshot ${i + 1}`);
        
        // Add a small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`✗ Error downloading ${game.name}:`, error.message);
    }
  }
}

// Run the download
downloadAllGames()
  .then(() => console.log('\nAll downloads completed!'))
  .catch(error => console.error('An error occurred:', error));
