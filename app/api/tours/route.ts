import { NextRequest, NextResponse } from 'next/server';
import { readDataFile, appendToDataFile } from '@/lib/fileStorage';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET() {
  const tours = readDataFile('tours.json');
  return NextResponse.json(tours);
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  const newTour = appendToDataFile('tours.json', data);
  return NextResponse.json(newTour, { status: 201 });
}