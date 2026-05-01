'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, MapPin, Anchor, LogOut, Compass, User, Trash2 } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Link from 'next/link';
import { useCurrency } from '@/app/context/CurrencyContext';

interface Favorite {
  id: string;
  itemId: number;
  itemType: 'tour' | 'cruise';
  itemName: string;
  itemImage: string;
  itemPrice: number;
  addedAt: string;
}

export default function Dashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const { formatPrice } = useCurrency();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetch('/api/favorites')
        .then(res => res.json())
        .then(data => {
          setFavorites(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else if (sessionStatus === 'unauthenticated') {
      setLoading(false);
    }
  }, [sessionStatus]);

  const removeFavorite = async (id: string) => {
    const res = await fetch(`/api/favorites?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setFavorites(prev => prev.filter(f => f.id !== id));
    }
  };

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (sessionStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4 dark:text-white">Sign In Required</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please sign in to view your dashboard.
              </p>
              <Link href="/auth/signin">
                <Button>Sign In</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white pb-12 pt-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Compass size={28} />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Welcome back, {session?.user?.name?.split(" ")[0] || 'Traveler'}
                </h1>
                <p className="text-gray-400 mt-1">Your personal travel dashboard</p>
              </div>
            </div>
            <Button onClick={() => signOut({ callbackUrl: '/' })} variant="outline" size="sm" className="flex items-center gap-2">
              <LogOut size={16} /> Sign Out
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <Calendar className="text-blue-400" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Quick Actions</h2>
              <p className="text-sm text-gray-400">Jump to important features</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Browse Tours", href: "/tours", icon: "🌍" },
              { label: "Browse Cruises", href: "/cruises", icon: "🚢" },
              { label: "My Bookings", href: "/my-bookings", icon: "📅" },
              { label: "Support", href: "/contact", icon: "✉️" },
            ].map((action, i) => (
              <Link key={i} href={action.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800/50 border border-gray-700 hover:border-gray-600 p-6 rounded-2xl text-center transition-all cursor-pointer"
                >
                  <div className="text-3xl mb-3">{action.icon}</div>
                  <div className="font-medium text-white text-sm">{action.label}</div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Favorites Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center">
              <Heart className="text-rose-400" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Favorites</h2>
              <p className="text-sm text-gray-400">Saved for later</p>
            </div>
          </div>

          {favorites.length === 0 ? (
            <Card className="p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-center">
              <p className="text-gray-400 mb-6">
                No favorites yet. Add tours or cruises to your wishlist.
              </p>
              <Link href="/tours">
                <Button variant="primary">Explore Tours</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((fav) => (
                <Card key={fav.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 overflow-hidden group">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={fav.itemImage}
                      alt={fav.itemName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=No+Image';
                      }}
                    />
                    <button
                      onClick={() => removeFavorite(fav.id)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full hover:bg-red-500 transition"
                      title="Remove from favorites"
                    >
                      <Trash2 size={14} className="text-white" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                      {fav.itemType === 'tour' ? <MapPin size={12} /> : <Anchor size={12} />}
                      <span className="capitalize">{fav.itemType}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">{fav.itemName}</h3>
                    <div className="flex justify-between items-center">
                      {/* Formatted price */}
                      <span className="text-blue-400 font-bold">{formatPrice(fav.itemPrice)}</span>
                      <Link href={`/${fav.itemType}s/${fav.itemId}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>

        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                <User className="text-purple-400" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Profile Info</h2>
                <p className="text-sm text-gray-400">Account details</p>
              </div>
            </div>
            <div className="space-y-2 text-gray-300">
              <p><span className="text-gray-400">Name:</span> {session?.user?.name}</p>
              <p><span className="text-gray-400">Email:</span> {session?.user?.email}</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}