import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/lib/adminAuth';

// GET all tours
export async function GET() {
  const tours = await prisma.tour.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(tours);
}

// CREATE tour
export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();

  const tour = await prisma.tour.create({
    data: {
      title: data.title,
      location: data.location,
      price: Number(data.price),
      description: data.description,
      image: data.image || null,
    },
  });

  return NextResponse.json(tour, { status: 201 });
}