import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEOMetadata } from '@/components/shared/SEOMetadata';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <SEOMetadata
        title="Page Not Found | 404 Error"
        description="The page you're looking for doesn't exist or has been moved. Return to the homepage to continue browsing."
        type="website"
      />
      <h1 className="text-6xl font-bold text-[#00f7ff] mb-6">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button className="btn-primary px-8">Back to Home</Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
