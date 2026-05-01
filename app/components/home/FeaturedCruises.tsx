'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Star, Anchor, Clock, ArrowRight, Ship, Heart } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useCurrency } from '@/app/context/CurrencyContext';

interface Cruise {
  id: string;
  name: string;
  ship: string;
  destination: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
  description: string;
}

interface Favorite {
  id: string;
  itemId: string;
  itemType: 'tour' | 'cruise';
}

export default function FeaturedCruises() {
  const { data: session } = useSession();
  const { formatPrice } = useCurrency();
  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favLoading, setFavLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/cruises')
      .then(res => res.json())
      .then(data => setCruises(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/favorites')
        .then(res => res.json())
        .then(data => setFavorites(data))
        .catch(console.error);
    } else {
      setFavorites([]);
    }
  }, [session]);

  const isFavorite = (cruiseId: string) =>
    favorites.some(f => f.itemId === cruiseId && f.itemType === 'cruise');

  const toggleFavorite = async (cruise: Cruise) => {
    if (!session) {
      alert('Please sign in to add favorites.');
      return;
    }

    const alreadyFavorite = isFavorite(cruise.id);
    setFavLoading(cruise.id);

    try {
      if (alreadyFavorite) {
        const fav = favorites.find(f => f.itemId === cruise.id && f.itemType === 'cruise');
        if (fav) {
          const res = await fetch(`/api/favorites?id=${fav.id}`, { method: 'DELETE' });
          if (res.ok) setFavorites(prev => prev.filter(f => f.id !== fav.id));
        }
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemId: cruise.id,
            itemType: 'cruise',
            itemName: cruise.name,
            itemImage: cruise.image,
            itemPrice: cruise.price,
          }),
        });
        if (res.ok) {
          const newFav = await res.json();
          setFavorites(prev => [...prev, newFav]);
        }
      }
    } catch (err) {
      alert('Failed to update favorites');
    } finally {
      setFavLoading(null);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading luxury cruises...</p>
        </div>
      </section>
    );
  }

  if (cruises.length === 0) return null;

  const featuredCruises = cruises.slice(0, 3);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <Ship className="w-9 h-9 text-blue-600" />
            <span className="uppercase tracking-[3px] text-sm font-semibold text-blue-600">
              Luxury at Sea
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Featured Cruises</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Experience the world from the deck of our handpicked luxury vessels
          </p>
        </div>

        {/* Cruises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCruises.map((cruise) => {
            const formattedPrice = formatPrice(cruise.price);

            return (
              <Card
                key={cruise.id}
                className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden rounded-t-3xl">
                  <img
                    src={cruise.image}
                    alt={cruise.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://via.placeholder.com/800x600/1f2937/9ca3af?text=Cruise';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3.5 py-1 rounded-2xl shadow flex items-center gap-1 text-sm font-semibold">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    {cruise.rating}
                  </div>

                  {/* Heart Button */}
                  <button
                    onClick={() => toggleFavorite(cruise)}
                    disabled={favLoading === cruise.id}
                    className="absolute top-4 left-4 p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-2xl hover:scale-110 transition-all shadow-sm"
                  >
                    {favLoading === cruise.id ? (
                      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          isFavorite(cruise.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
                        }`}
                      />
                    )}
                  </button>

                  {/* Duration & Cruise Badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-2xl text-white text-xs font-medium flex items-center gap-1.5">
                      <Anchor className="w-3.5 h-3.5" />
                      CRUISE
                    </div>
                    <div className="bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-2xl text-white text-xs font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {cruise.duration}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="font-semibold text-blue-600">{cruise.ship}</span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="line-clamp-1">{cruise.destination}</span>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 line-clamp-2 min-h-[3.25rem] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">
                    {cruise.name}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-[15px] line-clamp-3 mb-8 flex-1 leading-relaxed">
                    {cruise.description}
                  </p>

                  {/* Price & Button */}
                  <div className="mt-auto pt-6 border-t border-gray-100 dark:border-zinc-800">
                    <div className="flex items-end justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Starting from</div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                          {formattedPrice}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">per person</div>
                      </div>

                      <Link href={`/cruises/${cruise.id}`} className="flex-shrink-0">
                        <Button
                          variant="primary"
                          size="sm"
                          className="rounded-2xl px-7 py-2.5 text-sm font-medium"
                        >
                          View Details
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link href="/cruises">
            <Button variant="primary" size="lg" className="rounded-2xl px-10 py-3.5">
              View All Luxury Cruises
              <ArrowRight className="inline-block ml-3 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}