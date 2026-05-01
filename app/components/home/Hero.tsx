'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

export default function Hero() {
  return (
    <div className="relative h-screen min-h-[750px] flex items-center overflow-hidden bg-slate-950">
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105" // Slight scale to prevent edge flickering
          poster="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-slate-950/80" />
        <div className="absolute inset-0 bg-slate-950/30 backdrop-radial from-transparent to-slate-950/60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-8 text-white">
              Discover Your Next
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 animate-gradient-x">
                Adventure
              </span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-200/90 max-w-2xl mb-12 leading-relaxed font-light"
          >
            Curated luxury travel experiences to the world's most extraordinary destinations. 
            Create memories that last a lifetime.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-5 items-start"
          >
            <Link href="/tours">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white text-lg px-10 py-7 rounded-2xl transition-all duration-300 shadow-2xl shadow-blue-500/20"
              >
                <span className="relative z-10 flex items-center">
                  Explore Tours
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>

            <Link href="/cruises">
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-10 py-7 rounded-2xl border-white/20 text-white hover:bg-white/10 backdrop-blur-md transition-all duration-300"
              >
                Explore Cruises
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Aesthetic Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
      >
        <button 
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="group flex flex-col items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 group-hover:text-blue-400 transition-colors duration-500">
            Scroll to Explore
          </span>
          <div className="relative w-px h-12 bg-gradient-to-b from-white/20 to-transparent overflow-hidden">
            <motion.div 
              animate={{ y: [0, 48] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-full h-1/2 bg-blue-400"
            />
          </div>
        </button>
      </motion.div>
    </div>
  );
}