import { createWriteStream } from 'fs';
import { get } from 'https';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const GAME_ASSETS = {
  'fifa-24': {
    main: 'https://cdn1.epicgames.com/spt-assets/2a4cbf43f3184e9c9f2e1b1f0f3e3e0d/ea-sports-fc-24-1t1p7.jpg',
    logo: 'https://cdn1.epicgames.com/spt-assets/2a4cbf43f3184e9c9f2e1b1f0f3e3e0d/ea-sports-fc-24-1t1p7.jpg',
    screenshots: [
      'https://cdn1.epicgames.com/spt-assets/2a4cbf43f3184e9c9f2e1b1f0f3e3e0d/ea-sports-fc-24-1t1p7.jpg',
      'https://cdn1.epicgames.com/spt-assets/2a4cbf43f3184e9c9f2e1b1f0f3e3e0d/ea-sports-fc-24-1t1p7.jpg',
      'https://cdn1.epicgames.com/spt-assets/2a4cbf43f3184e9c9f2e1b1f0f3e3e0d/ea-sports-fc-24-1t1p7.jpg',
      'https://cdn1.epicgames.com/spt-assets/2a4cbf43f3184e9c9f2e1b1f0f3e3e0d/ea-sports-fc-24-1t1p7.jpg',
      'https://cdn1.epicgames.com/spt-assets/2a4cbf43f3184e9c9f2e1b1f0f3e3e0d/ea-sports-fc-24-1t1p7.jpg',
      'https://cdn1.epicgames.com/spt-assets/2a4cbf43f3184e9c9f2e1b1f0f3e3e0d/ea-sports-fc-24-1t1p7.jpg'
    ]
  },
  'call-of-duty': {
    main: 'https://cdn1.epicgames.com/offer/05b60579182b4f4ea748b64011197fcd/EGS_CallofDutyModernWarfareIII_SledgehammerGames_S1_2560x1440-db5f15f7ab3f',
    logo: 'https://cdn1.epicgames.com/offer/05b60579182b4f4ea748b64011197fcd/EGS_CallofDutyModernWarfareIII_SledgehammerGames_S1_2560x1440-db5f15f7ab3f',
    screenshots: [
      'https://cdn1.epicgames.com/offer/05b60579182b4f4ea748b64011197fcd/EGS_CallofDutyModernWarfareIII_SledgehammerGames_S1_2560x1440-db5f15f7ab3f',
      'https://cdn1.epicgames.com/offer/05b60579182b4f4ea748b64011197fcd/EGS_CallofDutyModernWarfareIII_SledgehammerGames_S2_2560x1440-5b3ec25f2a52',
      'https://cdn1.epicgames.com/offer/05b60579182b4f4ea748b64011197fcd/EGS_CallofDutyModernWarfareIII_SledgehammerGames_S3_2560x1440-9aa8d9426af9',
      'https://cdn1.epicgames.com/offer/05b60579182b4f4ea748b64011197fcd/EGS_CallofDutyModernWarfareIII_SledgehammerGames_S4_2560x1440-8d3b3c5f0d9e',
      'https://cdn1.epicgames.com/offer/05b60579182b4f4ea748b64011197fcd/EGS_CallofDutyModernWarfareIII_SledgehammerGames_S5_2560x1440-5b3ec25f2a52',
      'https://cdn1.epicgames.com/offer/05b60579182b4f4ea748b64011197fcd/EGS_CallofDutyModernWarfareIII_SledgehammerGames_S6_2560x1440-9aa8d9426af9'
    ]
  },
  'need-for-speed': {
    main: 'https://cdn1.epicgames.com/offer/4b742f57462842e597c26a0cc2d85f98/EGS_NeedforSpeedUnbound_CriterionGames_S1_2560x1440-7a2f8d9d9e6a',
    logo: 'https://cdn1.epicgames.com/offer/4b742f57462842e597c26a0cc2d85f98/EGS_NeedforSpeedUnbound_CriterionGames_S1_2560x1440-7a2f8d9d9e6a',
    screenshots: [
      'https://cdn1.epicgames.com/offer/4b742f57462842e597c26a0cc2d85f98/EGS_NeedforSpeedUnbound_CriterionGames_S1_2560x1440-7a2f8d9d9e6a',
      'https://cdn1.epicgames.com/offer/4b742f57462842e597c26a0cc2d85f98/EGS_NeedforSpeedUnbound_CriterionGames_S2_2560x1440-5b3ec25f2a52',
      'https://cdn1.epicgames.com/offer/4b742f57462842e597c26a0cc2d85f98/EGS_NeedforSpeedUnbound_CriterionGames_S3_2560x1440-9aa8d9426af9',
      'https://cdn1.epicgames.com/offer/4b742f57462842e597c26a0cc2d85f98/EGS_NeedforSpeedUnbound_CriterionGames_S4_2560x1440-8d3b3c5f0d9e',
      'https://cdn1.epicgames.com/offer/4b742f57462842e597c26a0cc2d85f98/EGS_NeedforSpeedUnbound_CriterionGames_S5_2560x1440-5b3ec25f2a52',
      'https://cdn1.epicgames.com/offer/4b742f57462842e597c26a0cc2d85f98/EGS_NeedforSpeedUnbound_CriterionGames_S6_2560x1440-9aa8d9426af9'
    ]
  }
};

async function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(filePath);
    const request = get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
    });

    file.on('finish', () => {
      file.close();
      resolve();
    });

    request.on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadGameAssets() {
  for (const [gameId, assets] of Object.entries(GAME_ASSETS)) {
    console.log(`Downloading assets for ${gameId}...`);
    
    try {
      // Download main image
      const mainPath = join(__dirname, '..', 'public', 'images', 'games', gameId, `${gameId}-main.jpg`);
      console.log(`Downloading main image to ${mainPath}`);
      await downloadImage(assets.main, mainPath);
      
      // Download logo
      const logoPath = join(__dirname, '..', 'public', 'images', 'games', gameId, `${gameId}-logo.jpg`);
      console.log(`Downloading logo to ${logoPath}`);
      await downloadImage(assets.logo, logoPath);
      
      // Download screenshots
      for (let i = 0; i < assets.screenshots.length; i++) {
        const screenshotPath = join(
          __dirname, 
          '..', 
          'public', 
          'images', 
          'games', 
          gameId, 
          `${gameId}-${i + 1}.jpg`
        );
        console.log(`Downloading screenshot ${i + 1} to ${screenshotPath}`);
        await downloadImage(assets.screenshots[i], screenshotPath);
      }
      
      console.log(`Successfully downloaded all assets for ${gameId}`);
    } catch (error) {
      console.error(`Error downloading assets for ${gameId}:`, error.message);
    }
  }
}

// Execute the download
downloadGameAssets()
  .then(() => console.log('All downloads completed!'))
  .catch(error => console.error('Error during download:', error));
