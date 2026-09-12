'use client';

// ============================================================
// SIGNUP — Firebase Auth (traveller or aspiring Mitra)
// ============================================================

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Compass, ArrowRight, Lock, Mail, User, Phone, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [role, setRole] = useState<'traveller' | 'mitra'>('traveller');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signup(fullName, email, password, role);
      router.push(role === 'mitra' ? '/become-mitra' : '/find-my-yatra');
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      setError(
        code.includes('email-already-in-use')
          ? 'An account with this email already exists — try signing in.'
          : code.includes('weak-password')
            ? 'Password must be at least 8 characters.'
            : code.includes('invalid-email')
              ? 'That email address looks invalid.'
              : 'Account creation failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full p-3 pl-9 rounded-xl bg-sand-100 border border-sand-300 text-charcoal-800 font-medium focus:outline-none focus:border-forest-800';

  return (
    <div className="min-h-screen bg-page-auth flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-forest-900/10 bg-sand-50">
        {/* Left visual */}
        <div className="md:col-span-5 relative bg-forest-950 p-8 sm:p-10 text-[#F5F1E8] flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/places/golconda-fort.jpg"
              alt="Golconda Fort, Hyderabad"
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-transparent" />
          </div>

          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-forest-900 border border-[#B8955A]/40 flex items-center justify-center text-[#DFB86C]">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-xl">YATRAMITR</span>
            </div>
            <p className="text-xs uppercase tracking-widest text-[#DFB86C] font-semibold">Travel with purpose</p>
          </div>

          <div className="relative z-10 space-y-3">
            <p className="font-serif text-lg italic text-[#F5F1E8] leading-relaxed">
              &ldquo;Join a platform where tourism directs spending toward local Mitras, craft families and
              quieter neighbourhoods.&rdquo;
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-forest-800 text-[11px] text-[#E8DFCF]/60">
            Smart India Hackathon 2026 Initiative
          </div>
        </div>

        {/* Right form */}
        <div className="md:col-span-7 p-8 sm:p-12 space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">Create your account</h2>
            <p className="text-xs text-charcoal-700">Begin your Hyderabad Yatra — or apply to guide as a Mitra.</p>
          </div>

          {/* Role tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-sand-200/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => setRole('traveller')}
              className={`py-2 rounded-lg transition-all ${role === 'traveller' ? 'bg-forest-900 text-[#F5F1E8] shadow-sm' : 'text-charcoal-700 hover:text-forest-950'}`}
            >
              Traveller
            </button>
            <button
              type="button"
              onClick={() => setRole('mitra')}
              className={`py-2 rounded-lg transition-all ${role === 'mitra' ? 'bg-forest-900 text-[#F5F1E8] shadow-sm' : 'text-charcoal-700 hover:text-forest-950'}`}
            >
              Apply as Mitra
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-terracotta-50 border border-terracotta-200 text-xs text-terracotta-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label htmlFor="name" className="font-bold text-forest-950 uppercase tracking-wider block">Full name</label>
              <div className="relative">
                <input id="name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Aarav Mehta" className={inputCls} required />
                <User className="w-4 h-4 text-charcoal-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="semail" className="font-bold text-forest-950 uppercase tracking-wider block">Email</label>
                <div className="relative">
                  <input id="semail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} required />
                  <Mail className="w-4 h-4 text-charcoal-500 absolute left-3 top-3.5" />
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="phone" className="font-bold text-forest-950 uppercase tracking-wider block">Phone (optional)</label>
                <div className="relative">
                  <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className={inputCls} />
                  <Phone className="w-4 h-4 text-charcoal-500 absolute left-3 top-3.5" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="spassword" className="font-bold text-forest-950 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <input id="spassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className={inputCls} required minLength={8} />
                <Lock className="w-4 h-4 text-charcoal-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-[#F5F1E8] font-bold text-sm shadow-md transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 text-[#DFB86C]" />}
              {role === 'mitra' ? 'Create account & start application' : 'Create traveller account'}
            </button>
          </form>

          <div className="pt-3 border-t border-sand-200 text-center text-xs text-charcoal-700 space-y-1">
            <p>
              Already registered?{' '}
              <Link href="/login" className="font-bold text-terracotta-600 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
