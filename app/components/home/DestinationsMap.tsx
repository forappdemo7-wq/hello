'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Only import leaflet on the client
let L: any;
if (typeof window !== 'undefined') {
  L = require('leaflet');
  // Fix marker icons
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const destinations = [
  { name: 'Bali, Indonesia', lat: -8.4095, lng: 115.1889, tours: ['Bali Paradise Explorer'] },
  { name: 'Tokyo, Japan', lat: 35.6895, lng: 139.6917, tours: ['Japanese Cultural Journey'] },
  { name: 'Santorini, Greece', lat: 36.3932, lng: 25.4615, tours: ['Santorini Romance'] },
  { name: 'Swiss Alps, Switzerland', lat: 46.561, lng: 8.767, tours: ['Swiss Alps Adventure'] },
];

export default function DestinationsMap() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <section className="py-32 bg-slate-950 flex justify-center items-center min-h-[600px]">
        <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className="py-32 bg-slate-950 relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Footprint</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
            Discover our curated selection of breathtaking destinations across the globe. Hover and explore your next journey.
          </p>
        </motion.div>

        {/* Animated Map Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative p-1 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent shadow-2xl shadow-blue-900/20 max-w-6xl mx-auto"
        >
          {/* Inner masking div for border radius */}
          <div className="rounded-[31px] overflow-hidden bg-slate-900 relative">
            
            {/* Overlay tint to make map blend better with the site */}
            <div className="absolute inset-0 bg-blue-900/10 z-[400] pointer-events-none mix-blend-overlay" />
            
            <MapContainer
              center={[25, 10]}
              zoom={2.5}
              style={{ height: '550px', width: '100%', backgroundColor: '#0f172a' }} // matches slate-900
              scrollWheelZoom={false}
              className="z-0"
            >
              {/* Dark Theme TileLayer */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {destinations.map((dest, i) => (
                <Marker key={i} position={[dest.lat, dest.lng]}>
                  <Popup>
                    <div className="p-1">
                      <strong className="text-slate-900 block mb-1 font-semibold">{dest.name}</strong>
                      <span className="text-blue-600 text-sm font-medium">{dest.tours.join(', ')}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}