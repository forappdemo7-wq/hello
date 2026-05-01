'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Users, MapPin, Anchor, Clock, AlertCircle } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
// --- CURRENCY FIX START ---
import { useCurrency } from '@/app/context/CurrencyContext'; 
// --- CURRENCY FIX END ---

interface Booking {
  id: string;
  itemType: 'tour' | 'cruise';
  itemName: string;
  itemImage: string;
  travelers: number;
  totalPrice: number;
  travelDate: string;
  status: string;
  bookingDate: string;
}

export default function MyBookingsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- CURRENCY FIX START ---
  const { formatPrice } = useCurrency();
  // --- CURRENCY FIX END ---

  useEffect(() => {
    if (sessionStatus === 'authenticated' && session?.user?.email) {
      fetchBookings();
    } else if (sessionStatus === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, sessionStatus]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(session?.user?.email ?? '')}`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string, currentStatus: string, bookingDate: string) => {
    // Check cancellation eligibility
    const now = new Date();
    const bookingDateTime = new Date(bookingDate);
    const hoursSinceBooking = (now.getTime() - bookingDateTime.getTime()) / (1000 * 60 * 60);

    if (currentStatus === 'completed') {
      alert('Completed bookings cannot be cancelled.');
      return;
    }
    if (currentStatus === 'cancelled') {
      alert('This booking is already cancelled.');
      return;
    }
    if (currentStatus === 'confirmed' && hoursSinceBooking > 48) {
      alert('You can only cancel a confirmed booking within 48 hours of making it.');
      return;
    }
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: 'cancelled' }),
      });
      if (res.ok) {
        alert('Booking cancelled successfully.');
        fetchBookings(); // refresh list
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to cancel booking.');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    }
  };

  const getDeadlineMessage = (status: string, bookingDate: string) => {
    if (status !== 'confirmed') return null;
    const deadline = new Date(new Date(bookingDate).getTime() + 48 * 60 * 60 * 1000);
    const now = new Date();
    if (now > deadline) {
      return <p className="text-xs text-red-500 mt-1">Cancellation period has expired.</p>;
    }
    return (
      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
        Cancel before {deadline.toLocaleString()}
      </p>
    );
  };

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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
                Please sign in to view your bookings.
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white">My Bookings</h1>
          <p className="text-gray-600 dark:text-gray-400">All your travel reservations in one place</p>
        </div>

        {bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">No Bookings Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't made any bookings. Start exploring!
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/tours"><Button variant="primary">Browse Tours</Button></Link>
              <Link href="/cruises"><Button variant="outline">Browse Cruises</Button></Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden hover:shadow-xl transition-all group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={booking.itemImage}
                    alt={booking.itemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 px-2 py-1 rounded-lg">
                    <div className="flex items-center gap-1">
                      {booking.itemType === 'tour' ? (
                        <MapPin className="w-3 h-3 text-blue-600" />
                      ) : (
                        <Anchor className="w-3 h-3 text-blue-600" />
                      )}
                      <span className="text-xs font-semibold uppercase">{booking.itemType}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(booking.travelDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold dark:text-white line-clamp-1">{booking.itemName}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Users size={14} />
                    <span>{booking.travelers} traveler(s)</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
                    {/* --- CURRENCY FIX START: Replaced hardcoded $ --- */}
                    <div className="text-xl font-bold text-blue-600">
                      {formatPrice(booking.totalPrice)}
                    </div>
                    {/* --- CURRENCY FIX END --- */}
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Cancellation deadline message */}
                  {getDeadlineMessage(booking.status, booking.bookingDate)}

                  {/* Cancel button – shown only if cancellation is possible */}
                  {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                    <button
                      onClick={() => cancelBooking(booking.id, booking.status, booking.bookingDate)}
                      className="mt-4 w-full text-red-600 hover:text-red-700 text-sm font-medium py-2 border border-red-300 rounded-lg hover:bg-red-50 transition"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}