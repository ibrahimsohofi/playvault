import { useEffect, lazy, Suspense, startTransition, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ThemeProvider } from './context/ThemeContext';
import { DialogProvider } from "@/context/DialogContext";
import { GlobalDialogManager } from './components/layout/GlobalDialogManager';
import { NavigationErrorBoundary } from './components/shared/NavigationErrorBoundary';

// Lazy load page components for better code splitting
const AdminPage = lazy(() => import('./pages/AdminPage'));
const GameDetailPage = lazy(() => import('./pages/GameDetailPage'));
const GamesPage = lazy(() => import('./pages/GamesPage'));
const GameCategoriesPage = lazy(() => import('./pages/GameCategoriesPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const RecommendationsPage = lazy(() => import('./pages/RecommendationsPage'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Import homepage components directly (no lazy loading for homepage sections)
import { Hero } from './components/home/Hero';
import { ResourceLibrary } from './components/resources/ResourceLibrary';
import { HowItWorks } from './components/home/HowItWorks';
import { Testimonials } from './components/home/Testimonials';
import { Faq } from './components/home/Faq';
import { HomePageSkeleton } from './components/shared/HomePageSkeleton';

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>
);

// HomePage component that includes all the current sections - no lazy loading to prevent errors
const HomePage = () => (
  <>
    <Hero />
    <ResourceLibrary />
    <HowItWorks />
    <Testimonials />
    <Faq />
  </>
);

// Scroll restoration for smooth navigation
function ScrollToTopOnNavigation() {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log('PlayVault: Navigating to:', pathname);

    // Scroll to top when pathname changes
    if (pathname) {
      startTransition(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      });
    }
  }, [pathname]); // Re-run effect when pathname changes

  return null;
}

// Main App component
function App() {
  const [routeKey, setRouteKey] = useState(0);

  return (
    <DialogProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToTopOnNavigation />
          <GlobalDialogManager />
          <Layout>
            <NavigationErrorBoundary
              key={routeKey}
              onReset={() => setRouteKey(prev => prev + 1)}
            >
              <Routes key={`routes-${routeKey}`}>
              {/* Routes with their own skeleton loading */}
              <Route key="game-detail-id" path="/games/:gameId" element={
                <Suspense fallback={<PageLoader />}>
                  <GameDetailPage />
                </Suspense>
              } />
              <Route key="game-detail-alt" path="/game/:gameId" element={
                <Suspense fallback={<PageLoader />}>
                  <GameDetailPage />
                </Suspense>
              } />
              <Route key="home" path="/" element={<HomePage />} />
              <Route key="categories" path="/categories" element={
                <Suspense fallback={<PageLoader />}>
                  <GameCategoriesPage />
                </Suspense>
              } />

              {/* Routes with fallback spinner */}
              <Route key="games" path="/games" element={
                <Suspense fallback={<PageLoader />}>
                  <GamesPage />
                </Suspense>
              } />
              <Route key="wishlist" path="/wishlist" element={
                <Suspense fallback={<PageLoader />}>
                  <WishlistPage />
                </Suspense>
              } />
              <Route key="recommendations" path="/recommendations" element={
                <Suspense fallback={<PageLoader />}>
                  <RecommendationsPage />
                </Suspense>
              } />
              <Route key="admin" path="/admin" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminPage />
                </Suspense>
              } />
              <Route key="terms" path="/terms" element={
                <Suspense fallback={<PageLoader />}>
                  <TermsOfService />
                </Suspense>
              } />
              <Route key="privacy" path="/privacy" element={
                <Suspense fallback={<PageLoader />}>
                  <PrivacyPolicy />
                </Suspense>
              } />
              <Route key="faq" path="/faq" element={
                <Suspense fallback={<PageLoader />}>
                  <FaqPage />
                </Suspense>
              } />
              <Route key="not-found" path="*" element={
                <Suspense fallback={<PageLoader />}>
                  <NotFoundPage />
                </Suspense>
              } />
              </Routes>
            </NavigationErrorBoundary>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </DialogProvider>
  );
}

export default App;
