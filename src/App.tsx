import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ThemeProvider } from './context/ThemeContext';
import { DialogProvider } from "@/context/DialogContext";
import { GlobalDialogManager } from './components/layout/GlobalDialogManager';
import { ProtectionCheck } from './components/shared/ProtectionCheck';

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

// Lazy load shared components
const LazyHero = lazy(() => import('./components/home/Hero').then(module => ({ default: module.Hero })));
const LazyResourceLibrary = lazy(() => import('./components/resources/ResourceLibrary').then(module => ({ default: module.ResourceLibrary })));
const LazyHowItWorks = lazy(() => import('./components/home/HowItWorks').then(module => ({ default: module.HowItWorks })));
const LazyTestimonials = lazy(() => import('./components/home/Testimonials').then(module => ({ default: module.Testimonials })));
const LazyFaq = lazy(() => import('./components/home/Faq').then(module => ({ default: module.Faq })));

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>
);

// HomePage component that includes all the current sections
const HomePage = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyHero />
    <LazyResourceLibrary />
    <LazyHowItWorks />
    <LazyTestimonials />
    <LazyFaq />
  </Suspense>
);

// Scroll restoration for smooth navigation
function ScrollToTopOnNavigation() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    if (pathname) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [pathname]); // Re-run effect when pathname changes

  return null;
}

// Main App component
function App() {
  return (
    <DialogProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToTopOnNavigation />
          <ProtectionCheck />
          <GlobalDialogManager />
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/games/:gameId" element={<GameDetailPage />} />
                <Route path="/game/:gameId" element={<GameDetailPage />} />
                <Route path="/categories" element={<GameCategoriesPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </DialogProvider>
  );
}

export default App;
