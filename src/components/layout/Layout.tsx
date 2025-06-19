import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { OfflineIndicator } from '@/components/shared/OfflineIndicator';
import { DebugControls } from '@/components/shared/DebugControls';

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OfflineIndicator />
      <Header />
      <main className="flex-1 w-full flex flex-col ">

          {children}

      </main>
      <Footer />
      <MobileBottomNav />
      <DebugControls />
    </div>
  );
}
