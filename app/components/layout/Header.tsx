'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Menu, X, Compass, User } from 'lucide-react';
import DarkModeToggle from '../ui/DarkModeToggle';
import CurrencySwitcher from '../ui/CurrencySwitcher';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Tours', href: '/tours' },
    { name: 'Cruises', href: '/cruises' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 py-3 shadow-sm'
          : 'bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900 py-5'
      }`}
    >
      <nav className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-1 flex justify-start">
  <Link href="/" className="flex items-center gap-2.5 group">
    <div className="p-2 bg-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
      <Compass className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-500" />
    </div>
    {/* Text color now matches Snippet 2's gradient */}
    <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent hidden sm:block">
      TravelHub
    </span>
  </Link>
</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900 p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-zinc-700 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <CurrencySwitcher />
              <DarkModeToggle />
            </div>

            {/* Auth Button */}
            <div className="hidden md:block">
              {status === 'loading' ? (
                <div className="w-28 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse" />
              ) : session ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all active:scale-95"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-blue-600/30"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-[520px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-5 py-3.5 rounded-2xl text-base font-medium transition-all ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <CurrencySwitcher />
              <DarkModeToggle />
            </div>

            <div className="pt-3">
              {session ? (
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3.5 rounded-2xl font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-5 h-5" />
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-semibold transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}