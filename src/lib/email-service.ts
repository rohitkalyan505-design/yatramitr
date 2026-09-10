// ============================================================
// EMAIL SERVICE — clean abstraction + development fallback
// ============================================================
// Provider-agnostic transactional email. If EMAIL_API_KEY is
// configured, sends via a Resend-compatible REST call; otherwise
// logs the message and records it in-memory so the app is never
// blocked on email. Password reset is handled by Firebase Auth
// directly and does NOT go through this service.
// ============================================================

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailSendResult {
  sent: boolean;
  provider: 'resend' | 'fallback';
  detail?: string;
}

const sentLog: EmailMessage[] = [];

export function getSentEmailLog(): EmailMessage[] {
  return [...sentLog];
}

export async function sendEmail(message: EmailMessage): Promise<EmailSendResult> {
  const apiKey = process.env.EMAIL_API_KEY;
  const from = process.env.EMAIL_FROM ?? 'Yatra Mitra <onboarding@resend.dev>';

  if (!apiKey) {
    // Development fallback: record + log. Never blocks the app.
    sentLog.push(message);
    if (sentLog.length > 100) sentLog.shift();
    console.log(`[email:fallback] To: ${message.to} | Subject: ${message.subject}`);
    return { sent: false, provider: 'fallback', detail: 'EMAIL_API_KEY not configured' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      sentLog.push(message);
      return { sent: false, provider: 'resend', detail: `HTTP ${res.status}: ${body.slice(0, 120)}` };
    }
    return { sent: true, provider: 'resend' };
  } catch (e) {
    sentLog.push(message);
    return { sent: false, provider: 'resend', detail: e instanceof Error ? e.message : 'unknown error' };
  }
}

// ---------- Templates ----------

function baseTemplate(title: string, bodyHtml: string): string {
  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;color:#1D2521;">
    <h2 style="color:#16352A;">${title}</h2>
    ${bodyHtml}
    <p style="font-size:12px;color:#6B7280;margin-top:32px;border-top:1px solid #E8DFCF;padding-top:12px;">
      Yatra Mitra — responsible tourism, starting with Hyderabad. This is an MVP demonstration service.
    </p>
  </div>`;
}

export async function sendSignupConfirmation(to: string, name: string): Promise<EmailSendResult> {
  return sendEmail({
    to,
    subject: 'Welcome to Yatra Mitra',
    html: baseTemplate(
      'Welcome aboard, ' + name,
      '<p>Your Yatra Mitra account is ready. Start by telling us how you like to travel — we\u2019ll match you with real Hyderabad experiences.</p>'
    ),
  });
}

export async function sendBookingConfirmation(
  to: string,
  details: { bookingId: string; experienceTitle: string; date: string; timeSlot: string; groupSize: number; totalAmount: number }
): Promise<EmailSendResult> {
  return sendEmail({
    to,
    subject: `Booking request confirmed — ${details.bookingId}`,
    html: baseTemplate(
      'Your booking request is confirmed',
      `<p><strong>${details.experienceTitle}</strong></p>
       <p>Booking ID: ${details.bookingId}<br/>
       Date: ${details.date} · ${details.timeSlot}<br/>
       Travellers: ${details.groupSize}<br/>
       Total (indicative): ₹${details.totalAmount}</p>
       <p style="font-size:12px;color:#6B7280;">No payment has been taken — this MVP confirms booking requests only.</p>`
    ),
  });
}

export async function sendMitraApplicationAcknowledgement(to: string, name: string): Promise<EmailSendResult> {
  return sendEmail({
    to,
    subject: 'Mitra application received',
    html: baseTemplate(
      'Thank you, ' + name,
      '<p>Your Mitra application has been received. Our (prototype) verification workflow covers identity, residency, local knowledge, safety orientation and community references. You\u2019ll see each step\u2019s status in your dashboard as it progresses.</p>'
    ),
  });
}
