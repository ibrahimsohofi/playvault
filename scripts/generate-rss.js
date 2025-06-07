import { writeFileSync } from 'fs';

const baseUrl = 'https://www.playvault.app';
const today = new Date().toISOString();

// Sample game data for RSS
const featuredGames = [
  {
    id: "gta-san-andreas",
    title: "Grand Theft Auto: San Andreas",
    description: "Five years ago, Carl Johnson escaped from the pressures of life in Los Santos, San Andreas... Experience the iconic open-world crime game on mobile.",
    category: "action",
    rating: 4.9,
    image: "https://ext.same-assets.com/2135583099/804061532.png"
  },
  {
    id: "fifa-24",
    title: "EA SPORTS FC 24",
    description: "EA SPORTS FC 24 brings you closer to football than ever before, powered by three cutting-edge technologies that deliver unrivaled realism.",
    category: "sports",
    rating: 4.8,
    image: "https://ext.same-assets.com/2135583099/3783537154.jpeg"
  },
  {
    id: "call-of-duty-mw3",
    title: "Call of Duty: Modern Warfare III",
    description: "The ultimate threat in Call of Duty returns as the fearsome villain Makarov in an epic direct sequel to the record-breaking Call of Duty: Modern Warfare II.",
    category: "shooter",
    rating: 4.7,
    image: "https://ext.same-assets.com/2135583099/939883035.png"
  }
];

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PlayVault - Premium Mobile Games</title>
    <description>Download the best premium mobile games for Android and iOS. Free, safe, and verified downloads.</description>
    <link>${baseUrl}</link>
    <language>en-US</language>
    <lastBuildDate>${today}</lastBuildDate>
    <pubDate>${today}</pubDate>
    <ttl>1440</ttl>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.svg</url>
      <title>PlayVault</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>

${featuredGames.map(game => `    <item>
      <title>${game.title} - Free Download</title>
      <description>${game.description}</description>
      <link>${baseUrl}/games/${game.id}</link>
      <guid>${baseUrl}/games/${game.id}</guid>
      <pubDate>${today}</pubDate>
      <category>${game.category}</category>
      <enclosure url="${game.image}" type="image/jpeg"/>
      <content:encoded><![CDATA[
        <img src="${game.image}" alt="${game.title}" style="max-width: 100%; height: auto;"/>
        <p>${game.description}</p>
        <p><strong>Rating:</strong> ${game.rating}/5 stars</p>
        <p><strong>Category:</strong> ${game.category}</p>
        <p><a href="${baseUrl}/games/${game.id}">Download ${game.title} for free on PlayVault</a></p>
      ]]></content:encoded>
    </item>`).join('\n')}

  </channel>
</rss>`;

// Write RSS feed to public folder
writeFileSync('public/rss.xml', rssXml);

console.log(`Generated RSS feed with ${featuredGames.length} featured games`);
