import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const baseUrl = 'https://www.playvault.app';

  // Always include home as the first item
  const allItems = [
    { label: 'Home', href: '/' },
    ...items
  ];

  // Generate structured data for breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `${baseUrl}${item.href}` : undefined
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <nav
        className={`flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 ${className}`}
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-2">
          {allItems.map((item, index) => (
            <li key={`breadcrumb-${item.href || item.label}-${index}`} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              )}

              {index === 0 && (
                <Home className="w-4 h-4 mr-2" />
              )}

              {item.href && index < allItems.length - 1 ? (
                <Link
                  to={item.href}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
