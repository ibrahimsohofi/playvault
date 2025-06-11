import type React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEOMetadata } from '../components/shared/SEOMetadata';
import { ResourceLibrary } from '../components/resources/ResourceLibrary';

const GamesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Get category name for display
  const getCategoryDisplayName = (category: string | null) => {
    if (!category) return 'All Games';
    return `${category.charAt(0).toUpperCase()}${category.slice(1)} Games`;
  };

  const title = getCategoryDisplayName(categoryParam);
  const description = categoryParam
    ? `Browse ${categoryParam} games on PlayVault. Download the best ${categoryParam} games for mobile.`
    : 'Browse all available games on PlayVault. Download popular mobile games across various categories.';

  return (
    <>
      <SEOMetadata
        title={`${title} - PlayVault`}
        description={description}
        url={`/games${categoryParam ? `?category=${categoryParam}` : ''}`}
      />
      <div className="min-h-screen pt-16">
        <div className="container-custom py-8">
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {categoryParam ? (
                <>
                  <span className="text-[#00f7ff]">{categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}</span> Games
                </>
              ) : (
                <>
                  All <span className="text-[#00f7ff]">Games</span>
                </>
              )}
            </h1>
            <p className="text-muted-foreground text-lg">
              {categoryParam
                ? `Discover and download the best ${categoryParam} games. All games are free and available for immediate download.`
                : 'Discover and download the latest mobile games. All games are free and available for immediate download.'
              }
            </p>
          </div>
        </div>

        <ResourceLibrary initialCategory={categoryParam} />
      </div>
    </>
  );
};

export default GamesPage;
