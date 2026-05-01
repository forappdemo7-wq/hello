import { NextRequest, NextResponse } from 'next/server';
import { readDataFile, writeDataFile, appendToDataFile, deleteFromDataFile } from '@/lib/fileStorage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const FAVORITES_FILE = 'favorites.json';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const favorites = readDataFile<any>(FAVORITES_FILE);
  const userFavorites = favorites.filter(f => f.userEmail === session.user.email);
  return NextResponse.json(userFavorites);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { itemId, itemType, itemName, itemImage, itemPrice } = await req.json();

  const favorites = readDataFile<any>(FAVORITES_FILE);
  const alreadyExists = favorites.some(
    f => f.userEmail === session.user.email && f.itemId === itemId && f.itemType === itemType
  );
  if (alreadyExists) {
    return NextResponse.json({ error: 'Already in favorites' }, { status: 400 });
  }

  const newFavorite = {
    id: Date.now().toString(),
    userEmail: session.user.email,
    itemId,
    itemType,
    itemName,
    itemImage,
    itemPrice,
    addedAt: new Date().toISOString(),
  };
  const added = appendToDataFile(FAVORITES_FILE, newFavorite);
  return NextResponse.json(added, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const deleted = deleteFromDataFile(FAVORITES_FILE, id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: 'Removed from favorites' });
}