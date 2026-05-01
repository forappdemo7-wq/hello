import { NextRequest, NextResponse } from 'next/server';
import { readDataFile, writeDataFile, appendToDataFile, deleteFromDataFile } from '@/lib/fileStorage';
import { verifyAdmin } from '@/lib/adminAuth';

const BOOKINGS_FILE = 'bookings.json';

interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  itemId: number;
  itemType: 'tour' | 'cruise';
  itemName: string;
  itemImage: string;
  itemPrice: number;
  travelers: number;
  totalPrice: number;
  travelDate: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const bookings = readDataFile<Booking>(BOOKINGS_FILE);
  if (email) {
    const userBookings = bookings.filter((b) => b.userEmail === email);
    return NextResponse.json(userBookings);
  }
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const newBooking = appendToDataFile<Booking>(BOOKINGS_FILE, data);
  return NextResponse.json(newBooking, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { id, status } = await req.json();
  const auth = await verifyAdmin(req);
  const isAdmin = !!auth;

  const bookings = readDataFile<Booking>(BOOKINGS_FILE);
  const booking = bookings.find((b) => b.id === id);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  // Non‑admin (user) can only cancel, and only within allowed rules
  if (!isAdmin) {
    if (status !== 'cancelled') {
      return NextResponse.json({ error: 'You can only cancel a booking.' }, { status: 403 });
    }

    const now = new Date();
    const bookingDate = new Date(booking.bookingDate);
    const hoursSinceBooking = (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60);

    if (booking.status === 'completed') {
      return NextResponse.json({ error: 'Cannot cancel a completed booking.' }, { status: 400 });
    }
    if (booking.status === 'cancelled') {
      return NextResponse.json({ error: 'Booking already cancelled.' }, { status: 400 });
    }
    if (booking.status === 'confirmed' && hoursSinceBooking > 48) {
      return NextResponse.json({ error: 'Cancellation period (48 hours) has expired.' }, { status: 400 });
    }
    // Allowed – proceed
  }

  const index = bookings.findIndex((b) => b.id === id);
  if (index !== -1) {
    bookings[index].status = status;
    writeDataFile(BOOKINGS_FILE, bookings);
    return NextResponse.json(bookings[index]);
  }

  return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing booking id' }, { status: 400 });
  }

  const deleted = deleteFromDataFile(BOOKINGS_FILE, id);
  if (!deleted) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Booking deleted successfully' });
}