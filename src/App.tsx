import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useParams } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Hero } from './components/home/Hero';
import { ResourceLibrary } from './components/resources/ResourceLibrary';
import { Testimonials } from './components/home/Testimonials';
import { HowItWorks } from './components/home/HowItWorks';
import { Faq } from './components/home/Faq';

import { GameDetailPage } from './pages/GameDetailPage';
import { GameCategoriesPage } from './pages/GameCategoriesPage';
import { WishlistPage } from './pages/WishlistPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { DownloadHandlerPage } from './pages/DownloadHandlerPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { WishlistProvider } from './context/WishlistContext';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

// HomePage component that includes all the current sections
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
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [pathname]); // Re-run effect when pathname changes

  return null;
}

// Wrapper for GameCategoriesPage to pass categoryId param if present
function GameCategoriesPageWithCategoryId() {
  const { categoryId } = useParams();
  // Pass categoryId as a prop to GameCategoriesPage for filtering
  return <GameCategoriesPage categoryId={categoryId} />;
}

// App with routes configured
export function App() {
  return (
    <WishlistProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </WishlistProvider>
  );
}

// Separate component for routes so we can use the useLocation hook
function AppRoutes() {
  return (
    <>
      <ScrollToTopOnNavigation />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/games/:gameId" element={<GameDetailPage />} />
          <Route path="/categories" element={<GameCategoriesPage />} />
          <Route path="/categories/:categoryId" element={<GameCategoriesPageWithCategoryId />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/download-handler" element={<DownloadHandlerPage />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
