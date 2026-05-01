import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Providers from './providers';
import ScrollProgress from '@/app/components/ui/ScrollProgress';
import { CurrencyProvider } from '@/app/context/CurrencyContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TravelHub - Your Gateway to Amazing Adventures',
  description:
    "Discover unforgettable travel experiences with curated tours to the world's most amazing destinations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Added data-scroll-behavior to prevent Next.js route transition conflicts
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <CurrencyProvider>
          <Providers>
            <ScrollProgress />
            <Header />
            <main>{children}</main>
            <Footer />
          </Providers>
        </CurrencyProvider>
      </body>
    </html>
  );
}