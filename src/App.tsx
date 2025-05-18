import { useState, useEffect } from 'react';
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

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

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

function AdBlockerDialog({ open }: { open: boolean }) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-xs sm:max-w-md text-center p-8 border-2 border-[#00f7ff]/50 shadow-xl animate-in fade-in slide-in-from-top-4">
        <div className="flex flex-col items-center mb-2">
          <AlertTriangle className="h-12 w-12 text-[#00f7ff] mb-3 animate-bounce" />
          <DialogTitle className="text-2xl font-bold mb-2 text-[#00f7ff]">AdBlocker Detected</DialogTitle>
          <p className="text-base text-muted-foreground mb-2">
            Please disable your ad blocker to access PlayVault and support our service. Refresh after whitelisting the site. Thank you!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function useAdBlockDetected(): boolean {
  const [adBlock, setAdBlock] = useState(false);
  useEffect(() => {
    const bait = document.createElement('div');
    bait.className = 'adsbox';
    bait.style.position = 'absolute';
    bait.style.height = '10px';
    bait.style.width = '10px';
    bait.style.left = '-999px';
    document.body.appendChild(bait);
    setTimeout(() => {
      // Some AdBlockers (like uBlock/Adblock Plus) will hide/remove .adsbox
      if (
        window.getComputedStyle(bait).display === 'none' ||
        bait.offsetParent === null
      )
        setAdBlock(true);
      document.body.removeChild(bait);
    }, 150);
  }, []);
  return adBlock;
}

// App with routes configured
export function App() {
  const adBlockDetected = useAdBlockDetected();
  return (
    <WishlistProvider>
      <BrowserRouter>
        <AdBlockerDialog open={adBlockDetected} />
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
