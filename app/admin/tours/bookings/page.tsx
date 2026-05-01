'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, Users, MapPin, Anchor, CheckCircle, XCircle, 
  AlertCircle, RefreshCw, Trash2, Search, Filter, ArrowLeft,
  CheckCircle2, Info
} from 'lucide-react';

interface Booking {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  itemType: 'tour' | 'cruise';
  itemName: string;
  itemImage: string;
  travelers: number;
  totalPrice: number;
  travelDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
  specialRequests?: string;
}

export default function AdminBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Auto-fetch and Auth guard
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchBookings();
  }, [router]);

  // Toast Notification Logic
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Optimized Filtering logic
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = 
        b.userName.toLowerCase().includes(searchStr) ||
        b.userEmail.toLowerCase().includes(searchStr) ||
        b.itemName.toLowerCase().includes(searchStr);
      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, searchTerm]);

  const fetchBookings = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load data');
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      setNotification({ type: 'error', msg: 'Could not synchronize bookings.' });
    } finally {
      setLoading(false);
    }
  };

  // Updated with confirmation alert
  const updateStatus = async (id: string, newStatus: Booking['status']) => {
    let message = '';

    switch (newStatus) {
      case 'confirmed':
        message = 'Confirm this booking?';
        break;
      case 'completed':
        message = 'Mark this booking as Completed?';
        break;
      case 'cancelled':
        message = 'Cancel this booking? This action cannot be easily undone.';
        break;
      case 'pending':
        message = 'Restore this booking to Pending status?';
        break;
      default:
        message = 'Change booking status?';
    }

    if (!confirm(message)) return;

    // Optimistic Update
    const previousState = [...bookings];
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setNotification({ type: 'success', msg: `Booking marked as ${newStatus}` });
    } catch (error) {
      setBookings(previousState);
      setNotification({ type: 'error', msg: 'Update failed. Reverting changes.' });
    }
  };

  // Updated with confirmation alert
  const handleDelete = async (id: string) => {
    if (!confirm('⚠️ Permanently delete this booking?\n\nThis action cannot be undone.')) {
      return;
    }

    // Optimistic Update
    const previousState = [...bookings];
    setBookings(prev => prev.filter(b => b.id !== id));

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/bookings?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setNotification({ type: 'success', msg: 'Booking deleted successfully' });
    } catch (error) {
      setBookings(previousState);
      setNotification({ type: 'error', msg: 'Deletion failed. Reverting changes.' });
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    const configs = {
      confirmed: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
      pending: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: AlertCircle },
      cancelled: { color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', icon: XCircle },
      completed: { color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', icon: CheckCircle2 },
    };
    const { color, icon: Icon } = configs[status] || configs.pending;
    return (
      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${color}`}>
        <Icon size={12} /> <span className="capitalize">{status}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500/20 border-t-blue-500"></div>
        <p className="text-gray-500 text-sm animate-pulse">Loading secure records...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-950 sticky top-0 z-50 border-none">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center border-none">
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-base font-medium">Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold">Manage Bookings</h1>   {/* Fixed typo: Testimonials → Bookings */}
          <button onClick={fetchBookings} className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Toast Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            <Info size={18} />
            <span className="text-sm font-medium">{notification.msg}</span>
          </div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search customers or tours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-600"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 focus-within:ring-2 focus-within:ring-blue-500/50">
            <Filter size={16} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent py-2.5 outline-none text-sm font-medium cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-800/50 border-b border-gray-800">
                <tr className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Package Details</th>
                  <th className="px-6 py-4 text-center">Travelers</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-white">{booking.userName}</div>
                      <div className="text-xs text-gray-500">{booking.userEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {booking.itemType === 'tour' ? <MapPin size={14} className="text-blue-400" /> : <Anchor size={14} className="text-indigo-400" />}
                        <span className="text-sm text-gray-200 font-medium">{booking.itemName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-md">
                        <Users size={12} /> {booking.travelers}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-white">
                        ${booking.totalPrice.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(booking.travelDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {booking.status === 'pending' && (
                          <button 
                            onClick={() => updateStatus(booking.id, 'confirmed')} 
                            className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors" 
                            title="Confirm Booking"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {booking.status === 'confirmed' && (
                          <button 
                            onClick={() => updateStatus(booking.id, 'completed')} 
                            className="p-2 text-sky-400 hover:bg-sky-400/10 rounded-lg transition-colors" 
                            title="Mark as Completed"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button 
                            onClick={() => updateStatus(booking.id, 'cancelled')} 
                            className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors" 
                            title="Cancel Booking"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                        {booking.status === 'cancelled' && (
                          <button 
                            onClick={() => updateStatus(booking.id, 'pending')} 
                            className="p-2 text-gray-400 hover:bg-white/10 rounded-lg transition-colors" 
                            title="Restore to Pending"
                          >
                            <RefreshCw size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(booking.id)} 
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors" 
                          title="Delete Booking"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredBookings.length === 0 && (
            <div className="text-center py-24 bg-gray-900/50">
              <div className="bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-700">
                <Search className="text-gray-500" size={28} />
              </div>
              <h3 className="text-white font-semibold">No records match your search</h3>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => {setSearchTerm(''); setStatusFilter('all');}}
                className="mt-6 text-blue-400 text-sm font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}