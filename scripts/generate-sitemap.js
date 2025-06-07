import { writeFileSync } from 'fs';

// Game data for sitemap generation (manually maintained for build stability)
const GAME_RESOURCES = [
  { id: "clash-of-clans", category: "strategy" },
  { id: "clash-royale", category: "strategy" },
  { id: "minecraft", category: "adventure" },
  { id: "pubg-mobile", category: "shooter" },
  { id: "among-us", category: "adventure" },
  { id: "candy-crush", category: "puzzle" },
  { id: "subway-surfers", category: "adventure" },
  { id: "roblox", category: "adventure" },
  { id: "genshin-impact", category: "rpg" },
  { id: "pokemon-go", category: "adventure" },
  { id: "free-fire", category: "shooter" },
  { id: "valorant-mobile", category: "shooter" },
  { id: "call-of-duty-mw3", category: "shooter" },
  { id: "baseball-9", category: "sports" }
];

const baseUrl = 'https://www.playvault.app';
const today = new Date().toISOString().split('T')[0];

// Main pages
const staticPages = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/games', changefreq: 'weekly', priority: '0.9' },
  { url: '/categories', changefreq: 'weekly', priority: '0.8' },
  { url: '/about', changefreq: 'monthly', priority: '0.7' },
  { url: '/contact', changefreq: 'monthly', priority: '0.6' },
  { url: '/privacy', changefreq: 'monthly', priority: '0.5' },
  { url: '/terms', changefreq: 'monthly', priority: '0.5' },
  { url: '/faq', changefreq: 'monthly', priority: '0.6' },
  { url: '/wishlist', changefreq: 'weekly', priority: '0.6' },
];

// Generate game pages
const gamePages = GAME_RESOURCES.map(game => ({
  url: `/games/${game.id}`,
  changefreq: 'weekly',
  priority: '0.8'
}));

// Generate category pages
const categories = [...new Set(GAME_RESOURCES.map(game => game.category))];
const categoryPages = categories.map(category => ({
  url: `/categories/${category.toLowerCase().replace(/\s+/g, '-')}`,
  changefreq: 'weekly',
  priority: '0.7'
}));

// Combine all pages
const allPages = [...staticPages, ...gamePages, ...categoryPages];

// Generate XML sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

// Write sitemap to public folder
writeFileSync('public/sitemap.xml', sitemap);

// Generate robots.txt
const robotsTxt = `# Allow all web crawlers
User-agent: *
Allow: /

# Disallow admin pages (if any)
Disallow: /admin/
Disallow: /api/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1`;

writeFileSync('public/robots.txt', robotsTxt);

console.log(`Generated sitemap with ${allPages.length} pages`);
console.log(`- Static pages: ${staticPages.length}`);
console.log(`- Game pages: ${gamePages.length}`);
console.log(`- Category pages: ${categoryPages.length}`);
