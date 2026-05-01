'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Compass, ArrowRight } from 'lucide-react';

// 1. Define Navigation Data for easier updates
const EXPLORE_LINKS = [
  { name: 'Our Tours', href: '/tours' },
  { name: 'Cruises', href: '/cruises' },
  { name: 'Travel Guides', href: '/guides' },
];

const LEGAL_LINKS = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Cookie Policy', href: '/cookies' },
];

export default function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white pt-24 pb-12 mt-20 relative overflow-hidden border-t border-gray-200 dark:border-gray-800">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-8 group w-fit">
              <div className="p-2 bg-blue-600 rounded-xl group-hover:rotate-[360deg] transition-transform duration-1000">
                <Compass className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-extrabold tracking-tighter bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
                TravelHub
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm text-lg font-light">
              Crafting bespoke journeys for the modern explorer. We turn your travel dreams into vivid reality.
            </p>
            <div className="mt-8 flex gap-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Functional Explore Section */}
          <div className="lg:col-span-2 lg:ml-auto">
            <h4 className="text-gray-900 dark:text-white font-bold mb-8 tracking-wide uppercase text-xs">Explore</h4>
            <ul className="space-y-4">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="lg:col-span-3 lg:ml-auto">
            <h4 className="text-gray-900 dark:text-white font-bold mb-8 tracking-wide uppercase text-xs">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <MdPhone size={20} />
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <MdEmail size={20} />
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">hello@travelhub.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-gray-900 dark:text-white font-bold mb-8 tracking-wide uppercase text-xs">The Newsletter</h4>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white pl-5 pr-14 py-4 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl transition-all">
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section with Cookie Policy Link */}
        <div className="mt-20 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-sm font-light">
            © {year} <span className="text-gray-800 dark:text-gray-300 font-medium">TravelHub Global</span>.
          </div>
          <div className="flex gap-8 text-sm">
            {LEGAL_LINKS.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}