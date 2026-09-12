'use client';

// ============================================================
// ASK MITRA — floating chat widget
// Premium chat panel grounded in platform data. Shows whether
// Groq narration was used, and always falls back gracefully.
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  usedGroq?: boolean;
  suggestions?: { label: string; href: string }[];
}

const QUICK_PROMPTS = [
  'Find a quiet heritage experience',
  'Plan my Yatra',
  'Is ₹900 fair for a 4-hour food walk?',
  'Tell me about Charminar',
  'Find a Mitra',
  'Help with safety',
];

export default function AskMitraWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text:
        'Namaste! I\u2019m **Ask Mitra** — your guide to YATRAMITR. Ask me to find experiences, check prices, explain places, or help with safety. Everything I say comes from the platform\u2019s own Hyderabad database.',
      suggestions: [
        { label: 'Find My Yatra', href: '/find-my-yatra' },
        { label: 'Explore the map', href: '/explore' },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: data.reply ?? 'I couldn\u2019t process that — please try again.',
          usedGroq: data.usedGroq,
          suggestions: data.suggestions,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: 'I\u2019m having connectivity trouble. Safety info is always available: **Emergency services: 112, Ambulance: 108.** For everything else, try again in a moment.',
          suggestions: [{ label: 'Open Live Trip safety tools', href: '/trip' }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          id="ask-mitra-btn"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] text-sm font-bold shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#DFB86C]" />
          <span>Ask Mitra</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[600px] max-h-[calc(100vh-2rem)] rounded-2xl overflow-hidden shadow-2xl border border-[#E8DFCF] bg-[#FAF8F5] flex flex-col">
          {/* Header */}
          <div className="bg-[#16352A] text-[#F5F1E8] px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0D211A] border border-[#B8955A]/50 flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-[#DFB86C]" />
              </div>
              <div>
                <p className="font-serif font-bold text-base leading-tight">Ask Mitra</p>
                <p className="text-[10px] text-[#B8955A] uppercase tracking-wider">
                  Grounded in platform data · Groq AI
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded hover:bg-white/10"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-[#16352A] text-[#F5F1E8] text-sm'
                      : 'max-w-[90%] space-y-2'
                  }
                >
                  <div
                    className={
                      m.role === 'user'
                        ? ''
                        : 'px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-[#E8DFCF] text-sm text-[#1D2521] whitespace-pre-wrap leading-relaxed'
                    }
                  >
                    {m.text}
                  </div>
                  {m.role === 'assistant' && m.usedGroq && (
                    <div className="flex items-center gap-1 text-[10px] text-[#1D2521]/50 px-2">
                      <Sparkles className="w-3 h-3 text-[#B8955A]" />
                      Narrated with Groq AI · facts from platform data
                    </div>
                  )}
                  {m.role === 'assistant' && m.suggestions && m.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 px-1">
                      {m.suggestions.map((s) => (
                        <a
                          key={s.href + s.label}
                          href={s.href}
                          className="px-2.5 py-1 rounded-full bg-[#EBDDCB] hover:bg-[#DFC8AB] text-[11px] font-semibold text-[#16352A] transition-colors"
                        >
                          {s.label} →
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-[#E8DFCF] flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8955A] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8955A] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8955A] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span className="text-[11px] text-[#1D2521]/50">Mitra is thinking…</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick prompts */}
          <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto shrink-0">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                disabled={loading}
                className="px-2.5 py-1 rounded-full border border-[#E8DFCF] bg-white text-[11px] font-medium text-[#16352A] hover:bg-[#F5F1E8] transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-3 border-t border-[#E8DFCF] bg-white flex items-center gap-2 shrink-0"
          >
            <input
              id="ask-mitra-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about places, prices, Mitras…"
              className="flex-1 px-4 py-2.5 rounded-full bg-[#F5F1E8] text-sm text-[#1D2521] focus:outline-none focus:ring-2 focus:ring-[#16352A]/30"
            />
            <button
              id="ask-mitra-send-btn"
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-full bg-[#16352A] hover:bg-[#0D211A] text-[#F5F1E8] flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
