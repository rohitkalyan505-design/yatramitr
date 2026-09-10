import { NextResponse } from 'next/server';
import { askMitra, isGroqConfigured } from '@/lib/groq-service';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// POST /api/chat — body: { message }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    if (!message) {
      return NextResponse.json({ error: 'message required' }, { status: 400 });
    }
    if (message.length > 1000) {
      return NextResponse.json({ error: 'message too long' }, { status: 400 });
    }

    const result = await askMitra(message);
    return NextResponse.json({ ...result, groqConfigured: isGroqConfigured });
  } catch {
    return NextResponse.json(
      {
        reply:
          'Something went wrong on my side. I still work in a limited way — try asking about experiences, places or prices, or use the navigation to explore.',
        intent: 'general',
        usedGroq: false,
        suggestions: [{ label: 'Find My Yatra', href: '/find-my-yatra' }],
        dataUsed: [],
      },
      { status: 200 }
    );
  }
}
