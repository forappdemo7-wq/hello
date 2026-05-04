'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { BookingFormData } from '@/app/types';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { useCurrency } from '@/app/context/CurrencyContext';

export const dynamic = 'force-dynamic';

export default function BookingPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { formatPrice } = useCurrency();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tourId = searchParams.get('tourId');
  const cruiseId = searchParams.get('cruiseId');
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [type, setType] = useState<'tour' | 'cruise' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [loadingItem, setLoadingItem] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormData>();
  const travelers = watch('travelers', 1);

  // Redirect if not authenticated
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/booking' + window.location.search);
    }
  }, [sessionStatus, router]);

  // Pre-fill email from session
  useEffect(() => {
    if (session?.user?.email) {
      setValue('email', session.user.email);
    }
  }, [session, setValue]);

  // Fetch the selected item
  useEffect(() => {
    const fetchItem = async () => {
      if (tourId) {
        setLoadingItem(true);
        try {
          const res = await fetch(`/api/tours/${tourId}`);
          if (res.ok) {
            const tour = await res.json();
            setSelectedItem(tour);
            setType('tour');
          } else {
            setSelectedItem(null);
          }
        } catch (err) {
          console.error(err);
          setSelectedItem(null);
        } finally {
          setLoadingItem(false);
        }
      } else if (cruiseId) {
        setLoadingItem(true);
        try {
          const res = await fetch(`/api/cruises/${cruiseId}`);
          if (res.ok) {
            const cruise = await res.json();
            setSelectedItem(cruise);
            setType('cruise');
          } else {
            setSelectedItem(null);
          }
        } catch (err) {
          console.error(err);
          setSelectedItem(null);
        } finally {
          setLoadingItem(false);
        }
      }
    };
    fetchItem();
  }, [tourId, cruiseId]);

  // Auto scroll to top when booking is successfully submitted
  useEffect(() => {
    if (submitted) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [submitted]);

  const onSubmit = async (data: BookingFormData) => {
    if (!session?.user?.email || !selectedItem) return;

    const totalPrice = selectedItem.price * data.travelers;
    
    const bookingData = {
      id: `BK-${Date.now()}`,
      userId: session.user.email,
      userName: data.name,
      userEmail: session.user.email,
      userPhone: data.phone,
      itemId: selectedItem.id,
      itemType: type,
      itemName: selectedItem.name,
      itemImage: selectedItem.image,
      itemPrice: selectedItem.price,
      travelers: data.travelers,
      totalPrice: totalPrice,
      travelDate: data.date,
      specialRequests: data.specialRequests || '',
      status: 'pending',
      bookingDate: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      
      if (res.ok) {
        const savedBooking = await res.json();
        setBookingId(savedBooking.id || `BK-${Date.now()}`);
        setSubmitted(true);
      } else {
        alert('Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  if (sessionStatus === 'loading' || loadingItem) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 pt-24">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Booking Request Submitted!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Your booking request has been sent. You will receive a confirmation once the admin approves it.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Booking ID: <span className="font-mono">{bookingId}</span>
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/my-bookings">
              <Button variant="primary">View My Bookings</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!selectedItem && !loadingItem) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 pt-24">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">No Item Selected</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The tour or cruise you're trying to book could not be found.
          </p>
          <Link href="/tours">
            <Button>Browse Tours</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">Complete Your Booking</h1>
          
          <Card className="mb-8 p-6 bg-white dark:bg-gray-800">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-semibold dark:text-white">{selectedItem.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {type === 'tour' ? selectedItem.location : selectedItem.ship}
                </p>
                <p className="text-blue-600 font-bold mt-1">{formatPrice(selectedItem.price)}/person</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 md:p-8 bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    {...register('phone', { required: 'Phone number is required' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Travelers *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    {...register('travelers', { 
                      required: 'Number of travelers is required',
                      min: { value: 1, message: 'At least 1 traveler' },
                      max: { value: 10, message: 'Maximum 10 travelers' }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.travelers && (
                    <p className="text-red-500 text-sm mt-1">{errors.travelers.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Travel Date *
                  </label>
                  <input
                    type="date"
                    {...register('date', { required: 'Travel date is required' })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  {...register('specialRequests')}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Any dietary restrictions, accessibility needs, or special requests?"
                ></textarea>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 dark:text-gray-400">Price per person:</span>
                  <span className="font-semibold dark:text-white">{formatPrice(selectedItem.price)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 dark:text-gray-400">Number of travelers:</span>
                  <span className="font-semibold dark:text-white">x {travelers}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-lg font-bold dark:text-white">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(selectedItem.price * (travelers || 1))}
                  </span>
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit" size="lg" className="w-full md:w-auto">
                  Submit Booking Request
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}