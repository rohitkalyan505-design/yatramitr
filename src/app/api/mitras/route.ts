import { NextResponse } from 'next/server';
import { fetchMitras } from '@/lib/data-service';
import type { PlaceCategory } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let mitras = await fetchMitras();
    if (category && category !== 'All') {
      mitras = mitras.filter((m) => m.categories.includes(category as PlaceCategory));
    }

    return NextResponse.json({ count: mitras.length, mitras });
  } catch {
    return NextResponse.json({ error: 'Unable to load mitras' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { getAdminDb } = await import('@/lib/firebase-admin');
    const adminDb = getAdminDb();
    if (adminDb) {
      const ref = await adminDb.collection('mitraVerifications').add({
        ...body,
        identityStatus: 'pending',
        residencyStatus: 'pending',
        knowledgeStatus: 'pending',
        safetyStatus: 'not_verified',
        referencesStatus: 'not_verified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, id: ref.id }, { status: 201 });
    }
    return NextResponse.json({ success: true, localOnly: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Unable to save mitra application' }, { status: 500 });
  }
}
