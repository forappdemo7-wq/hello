'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowUpRight, Sparkles } from 'lucide-react';

const DESTINATIONS = [
  { 
    id: 1, 
    name: 'Santorini', 
    country: 'Greece', 
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2000&auto=format&fit=crop', 
    size: 'lg' 
  },
  { 
    id: 2, 
    name: 'Kyoto', 
    country: 'Japan', 
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop', 
    size: 'sm' 
  },
  { 
    id: 3, 
    name: 'Amalfi Coast', 
    country: 'Italy', 
    image: 'https://images.unsplash.com/photo-1633321088355-d0f81134ca3b?q=80&w=2000&auto=format&fit=crop', 
    size: 'sm' 
  },
  { 
    id: 4, 
    name: 'Bali', 
    country: 'Indonesia', 
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop', 
    size: 'lg' 
  },
];

export default function DestinationsPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-slate-950 selection:bg-blue-500/30">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <header className="max-w-3xl mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm">
            <Sparkles size={16} />
            <span>Curated Escapes</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-slate-900 dark:text-white">
            World <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">Wonders</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed max-w-2xl">
            From the sun-drenched cliffs of the Mediterranean to the tranquil temples of the East, explore our handpicked collection of global retreats.
          </p>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
          {DESTINATIONS.map((dest) => (
            <Link 
              key={dest.id}
              href={`/destinations/${dest.name.toLowerCase()}`}
              className={`group relative overflow-hidden rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 ${
                dest.size === 'lg' ? 'lg:col-span-2' : 'lg:col-span-1'
              }`}
            >
              {/* Image & Overlays */}
              <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-700" />
              <Image 
                src={dest.image} 
                alt={dest.name}
                fill
                priority={dest.id === 1}
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end z-30">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 text-blue-400 mb-3">
                    <MapPin size={16} />
                    <span className="text-xs uppercase tracking-[0.2em] font-bold">{dest.country}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-md">
                    {dest.name}
                  </h3>
                </div>
                
                {/* Action Button */}
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-8 group-hover:translate-y-0 duration-500 hover:bg-blue-600 hover:border-blue-500">
                  <ArrowUpRight size={24} className="group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
      </div>
    </main>
  );
}