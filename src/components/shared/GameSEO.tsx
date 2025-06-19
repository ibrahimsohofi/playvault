import { Helmet } from 'react-helmet-async';
import type { GameResource } from '../../types/games';

interface GameSEOProps {
  game: GameResource;
}

export function GameSEO({ game }: GameSEOProps) {
  const baseUrl = 'https://www.playvault.app';
  const gameUrl = `${baseUrl}/games/${game.id}`;

  // Generate structured data for the game
  const gameSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": game.title,
    "description": game.description,
    "url": gameUrl,
    "image": game.image,
    "logo": game.logo,
    "applicationCategory": "GameApplication",
    "operatingSystem": game.platforms.join(", "),
    "author": {
      "@type": "Organization",
      "name": game.developer
    },
    "datePublished": `${game.publishYear}-01-01`,
    "version": game.version,
    "fileSize": game.size,
    "contentRating": game.ageRating,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": game.rating,
      "ratingCount": Math.floor(game.unlocks / 100), // Approximate review count
      "bestRating": 5,
      "worstRating": 1
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "screenshot": game.screenshots,
    "keywords": game.tags?.join(", ") || "",
    "genre": game.category,
    "gamePlatform": game.platforms,
    "playMode": game.tags?.includes("multiplayer") ? "MultiPlayer" : "SinglePlayer"
  };

  // Generate review schema if we have ratings
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "SoftwareApplication",
      "name": game.title
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": game.rating,
      "bestRating": 5
    },
    "author": {
      "@type": "Organization",
      "name": "PlayVault"
    },
    "reviewBody": `${game.title} is an excellent ${game.category} game with ${game.rating}/5 rating. ${game.description.substring(0, 150)}...`
  };

  const pageTitle = `${game.title} - Download Free | PlayVault`;
  const pageDescription = `Download ${game.title} for free on PlayVault. ${game.description.substring(0, 150)}... Rating: ${game.rating}/5 stars.`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={`${game.title}, ${game.tags?.join(', ') || ''}, ${game.category} games, free download, mobile games, ${game.developer}`} />

      {/* Canonical URL */}
      <link rel="canonical" href={gameUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={game.image} />
      <meta property="og:url" content={gameUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="PlayVault" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={game.image} />

      {/* Game-specific meta tags */}
      <meta name="game:developer" content={game.developer} />
      <meta name="game:category" content={game.category} />
      <meta name="game:rating" content={game.rating.toString()} />
      <meta name="game:platforms" content={game.platforms.join(', ')} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(gameSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(reviewSchema)}
      </script>

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="PlayVault" />
      <meta name="publisher" content={game.developer} />
    </Helmet>
  );
}
