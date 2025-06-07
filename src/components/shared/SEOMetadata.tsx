import { useEffect } from 'react';
import type { GameResource } from '@/types/games';

interface SEOMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'game';
  game?: GameResource;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
}

export function SEOMetadata({
  title = "PlayVault - Premium Mobile Games Downloads",
  description = "Download premium mobile games for Android and iOS. PlayVault is your ultimate library for the best mobile gaming experience.",
  image = "/images/logos/new/logo-full.png",
  url = window.location.href,
  canonical,
  type = "website",
  game,
  publishedTime,
  modifiedTime,
  author = "PlayVault",
  keywords = ["mobile games", "game downloads", "android games", "ios games"]
}: SEOMetadataProps) {
  // Ensure image URL is absolute
  const imageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;

  useEffect(() => {
    let currentTitle = title;
    let currentDescription = description;

    // Enhance title and description for specific games
    if (game?.id === 'carx-street') {
      currentTitle = 'Download CarX Street APK - Open World Mobile Racing | PlayVault';
      currentDescription = 'Experience CarX Street: ultra-realistic mobile street racing, wild open world, deep car tuning, online play, stunning visuals, and more. Download APK now!';
    }
    if (game?.id === 'tabletop-racing-world-tour') {
      currentTitle = 'Tabletop Racing: World Tour Mobile - Mini Combat Racing | PlayVault';
      currentDescription = 'Battle and boost through power-up-laden tabletop tracks in Tabletop Racing: World Tour! Miniaturized cars, split-screen, and online racing battles!';
    }

    // Update title
    document.title = currentTitle;

    // Update meta description
    let metaDescriptionElement = document.querySelector('meta[name="description"]');
    if (!metaDescriptionElement) {
      metaDescriptionElement = document.createElement('meta');
      metaDescriptionElement.setAttribute('name', 'description');
      document.head.appendChild(metaDescriptionElement);
    }
    metaDescriptionElement.setAttribute('content', currentDescription);

    // Update keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords.join(', '));

    // Open Graph metadata
    const ogTags: Record<string, string> = {
      'og:title': currentTitle,
      'og:description': currentDescription,
      'og:image': imageUrl,
      'og:url': url,
      'og:type': type === 'game' ? 'product' : type,
    };

    // Add game-specific og tags if available
    if (game) {
      ogTags['og:price:amount'] = '0';
      ogTags['og:price:currency'] = 'USD';
      ogTags['product:availability'] = 'in stock';
      ogTags['product:condition'] = 'new';
      ogTags['product:category'] = game.category;
    }

    // Add article specific tags if needed
    if (type === 'article' && publishedTime) {
      ogTags['article:published_time'] = publishedTime;
      ogTags['article:author'] = author;
      if (modifiedTime) {
        ogTags['article:modified_time'] = modifiedTime;
      }
    }

    // Twitter card
    const twitterTags: Record<string, string> = {
      'twitter:card': 'summary_large_image',
      'twitter:title': currentTitle,
      'twitter:description': currentDescription,
      'twitter:image': imageUrl,
    };

    // Update or create OG and Twitter meta tags
    for (const [key, value] of Object.entries({ ...ogTags, ...twitterTags })) {
      let metaTag = document.querySelector(`meta[property="${key}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', key);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', value as string);
    }

    // Add schema.org structured data if game is provided
    if (game) {
      addGameStructuredData(game);
    } else {
      // Remove any existing schema.org data when not on a game page
      const existingScript = document.querySelector('script#schema-org-data');
      if (existingScript) {
        existingScript.remove();
      }
    }

    // Cleanup function - in a real app you might want to restore previous values
    return () => {
      // Optional: remove custom tags on component unmount
    };
  }, [title, description, imageUrl, url, type, game, publishedTime, modifiedTime, author, keywords]);

  // Add structured data for games
  const addGameStructuredData = (game: GameResource) => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: game.title,
      description: game.description,
      applicationCategory: `Game, ${game.category} Game`,
      operatingSystem: game.platforms.join(', '),
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: game.rating.toString(),
        ratingCount: Math.floor(game.unlocks / 10), // Rough estimate of ratings based on downloads
        bestRating: '5',
        worstRating: '1'
      },
      image: game.image.startsWith('http') ? game.image : `${window.location.origin}${game.image}`,
      datePublished: game.releaseDate || new Date().toISOString().split('T')[0],
      publisher: {
        '@type': 'Organization',
        name: game.developer
      }
    };

    // Remove any existing schema.org data
    const existingScript = document.querySelector('script#schema-org-data');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new schema.org data
    const script = document.createElement('script');
    script.id = 'schema-org-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  };

  // This component doesn't render anything visible
  return null;
}
