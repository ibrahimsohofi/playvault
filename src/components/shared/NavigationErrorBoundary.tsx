import type React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface NavigationErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function NavigationErrorFallback({ error, resetErrorBoundary }: NavigationErrorFallbackProps) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-[#00f7ff] mb-4">Navigation Error</h2>
        <p className="text-muted-foreground mb-4">
          Something went wrong while loading this page. This usually happens due to a routing issue.
        </p>
        <details className="mb-4 text-left">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
            Error Details
          </summary>
          <pre className="mt-2 p-2 bg-card rounded text-xs text-red-400 overflow-auto">
            {error.message}
          </pre>
        </details>
        <div className="flex gap-4 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-[#00f7ff] text-black rounded hover:bg-[#00c4cc] transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => { window.location.href = '/'; }}
            className="px-4 py-2 border border-[#00f7ff]/30 text-[#00f7ff] rounded hover:bg-[#00f7ff]/10 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

interface NavigationErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
}

export function NavigationErrorBoundary({ children, onReset }: NavigationErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={NavigationErrorFallback}
      onError={(error, errorInfo) => {
        console.error('NavigationErrorBoundary caught an error:', error, errorInfo);

        // Log specific navigation-related errors
        if (error.message.includes('Loading chunk') ||
            error.message.includes('dynamically imported module') ||
            error.message.includes('Failed to fetch') ||
            error.message.includes('Minified React error #426')) {
          console.error('Lazy loading/Suspense error detected during navigation:', error);
        }

        // Log React error #426 specifically
        if (error.message.includes('426')) {
          console.error('React error #426 detected - this is typically caused by Suspense boundary issues during navigation');
        }
      }}
      onReset={() => {
        // Clear any cached module errors and force page reload if needed
        console.log('Attempting to clear navigation cache and reset...');

        // For React error #426, we might need to clear the location state
        if (window.history.state?.error) {
          window.history.replaceState(null, '', window.location.pathname);
        }

        // Call the parent onReset if provided
        if (onReset) {
          onReset();
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
