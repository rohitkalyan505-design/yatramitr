import { NextResponse } from 'next/server';
import { checkPrice } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

// GET /api/price-check?price=900&hours=4&transport=1&food=1&tickets=1
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const price = Number(searchParams.get('price'));
    if (!price || price <= 0) {
      return NextResponse.json({ error: 'Provide a quoted price (?price=)' }, { status: 400 });
    }
    const hours = Number(searchParams.get('hours')) || 3;
    const includesTransport = searchParams.get('transport') === '1';
    const includesFood = searchParams.get('food') === '1';
    const includesEntryTickets = searchParams.get('tickets') === '1';

    const result = checkPrice({
      service: 'Local guiding experience',
      location: 'Hyderabad',
      quotedPrice: price,
      hours,
      includesTransport,
      includesFood,
      includesEntryTickets,
    });

    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ error: 'Unable to check price' }, { status: 500 });
  }
}
