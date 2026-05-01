'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Star, MapPin, Clock, Search, Filter, X, ChevronRight, Compass, Heart } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { useCurrency } from '@/app/context/CurrencyContext';

interface Tour {
  id: string;
  name: string;
  location: string;
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

export default function ToursPage() {
  const { data: session } = useSession();
  const { formatPrice } = useCurrency();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favLoading, setFavLoading] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(3000);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch tours
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/tours');
        if (!res.ok) throw new Error('Failed to fetch tours');
        const data = await res.json();
        setTours(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load tours. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  // Fetch user's favorites if logged in
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

  const isFavorite = (tourId: string) => favorites.some(f => f.itemId === tourId && f.itemType === 'tour');

  const toggleFavorite = async (tour: Tour) => {
    if (!session) {
      alert('Please sign in to add favorites.');
      return;
    }

    const alreadyFavorite = isFavorite(tour.id);
    setFavLoading(tour.id);

    try {
      if (alreadyFavorite) {
        const fav = favorites.find(f => f.itemId === tour.id && f.itemType === 'tour');
        if (fav) {
          const res = await fetch(`/api/favorites?id=${fav.id}`, { method: 'DELETE' });
          if (res.ok) {
            setFavorites(prev => prev.filter(f => f.id !== fav.id));
          } else {
            throw new Error('Failed to remove');
          }
        }
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemId: tour.id,
            itemType: 'tour',
            itemName: tour.name,
            itemImage: tour.image,
            itemPrice: tour.price,
          }),
        });
        if (res.ok) {
          const newFav = await res.json();
          setFavorites(prev => [...prev, newFav]);
        } else {
          throw new Error('Failed to add');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update favorites');
    } finally {
      setFavLoading(null);
    }
  };

  // Filtered tours
  const filteredTours = useMemo(() => {
    return tours
      .filter((tour) =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((tour) => tour.price <= priceRange)
      .sort((a, b) => a.price - b.price);
  }, [tours, searchTerm, priceRange]);

  const hasActiveFilters = searchTerm !== '' || priceRange !== 3000;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-100 dark:border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-6 text-slate-500 dark:text-slate-400 font-medium tracking-wide">Mapping your next adventure...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="rounded-full px-8 py-2.5 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Header - Deep Ocean Adventure Theme */}
      <div className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        
        <div className="container relative mx-auto px-4 text-center z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 shadow-lg border border-white/20">
            <Compass className="w-10 h-10 text-cyan-300" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Expeditions</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-50/80 max-w-2xl mx-auto font-light">
            Immerse yourself in breathtaking landscapes and vibrant cultures. Discover the world's hidden gems.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        
        {/* Floating Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 p-4 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search by tour name or magnificent destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900/50 border-transparent rounded-2xl 
                           focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           text-slate-900 dark:text-white transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors"
                >
                  <X className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-medium transition-all duration-200 whitespace-nowrap border
                ${showFilters 
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Filters'}
              {hasActiveFilters && (
                <span className="ml-1 flex h-2 w-2 rounded-full bg-blue-500"></span>
              )}
            </button>
          </div>

          {/* Expandable Price Filter */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'max-h-48 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="max-w-xl">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Budget Range
                    </label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Set your maximum price per person</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${priceRange}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
                />
                <div className="flex justify-between text-xs font-medium text-slate-400 dark:text-slate-500 mt-3">
                  <span>$0</span>
                  <span>$500</span>
                  <span>$1000</span>
                  <span>$1500</span>
                  <span>$2000</span>
                  <span>$2500</span>
                  <span>$3000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-8 px-2">
          <p className="text-slate-500 dark:text-slate-400">
            Showing <span className="font-bold text-slate-900 dark:text-white text-lg mx-1">{filteredTours.length}</span> adventures
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchTerm('');
                setPriceRange(3000);
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Reset Filters
            </button>
          )}
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <Card key={tour.id} className="group flex flex-col h-full bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border-0 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative">
              
              {/* Favorite Heart Button - Top Left */}
              <button
                onClick={() => toggleFavorite(tour)}
                className="absolute top-4 left-4 z-20 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-110 transition"
                disabled={favLoading === tour.id}
              >
                {favLoading === tour.id ? (
                  <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isFavorite(tour.id) ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  />
                )}
              </button>

              {/* Image Section */}
              <div className="relative h-72 overflow-hidden bg-slate-100 dark:bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent z-10"></div>
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 
                      'https://via.placeholder.com/800x600/e7e5e4/a8a29e?text=No+Image+Available';
                  }}
                />
                
                {/* Rating Badge - Top Right */}
                <div className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{tour.rating}</span>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-white/90 text-sm font-medium">
                  <div className="flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-md">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="truncate max-w-[120px]">{tour.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-md">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    {tour.duration}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-col flex-grow p-6">
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {tour.name}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
                  {tour.description}
                </p>
                
                <div className="flex items-end justify-between pt-5 border-t border-slate-100 dark:border-slate-700/50 mt-auto">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">Starting from</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {formatPrice(tour.price)}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">/pp</span>
                    </div>
                  </div>
                  <Link href={`/tours/${tour.id}`}>
                    <Button variant="outline" size="sm" className="rounded-full group/btn hover:bg-blue-50 dark:hover:bg-blue-950/20 border-slate-200 dark:border-slate-700">
                      Explore <ChevronRight className="w-4 h-4 ml-1 inline group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTours.length === 0 && (
          <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm mt-8">
            <div className="mx-auto w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800">
              <Compass className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">No expeditions found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto text-lg">
              We couldn't find any tours matching your current path. Try clearing your filters to discover more.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setPriceRange(3000);
              }} 
              variant="primary"
              className="px-8 py-3 rounded-full shadow-lg shadow-blue-500/30"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}