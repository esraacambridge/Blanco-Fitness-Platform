import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface LayoutProps {
  children?: ReactNode;
  showFooter?: boolean;
}

export function PublicLayout({ children, showFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-blanco-black">
      <Navbar />
      <main className="flex-1 pt-20">
        {children ?? <Outlet />}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
