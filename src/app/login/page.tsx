'use client';

// ============================================================
// LOGIN — Firebase Auth with graceful demo fallback
// ============================================================

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Compass, ArrowRight, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login, startDemoSession, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email above first to receive a password reset link.');
      return;
    }
    try {
      await resetPassword(email);
      setResetSent(true);
      setError(null);
    } catch {
      setError('Unable to send password reset. Demo accounts do not require password resets.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      setError(
        code.includes('invalid-credential') || code.includes('wrong-password')
          ? 'Incorrect email or password.'
          : code.includes('user-not-found')
            ? 'No account found with this email. Create one below.'
            : code.includes('too-many-requests')
              ? 'Too many attempts — try again in a moment.'
              : 'Sign-in failed. You can also explore YATRAMITR with a demo session.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    startDemoSession();
    router.push('/find-my-yatra');
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
              src="/images/places/charminar.jpg"
              alt="Charminar, Hyderabad"
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-transparent" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-forest-900 border border-[#B8955A]/40 flex items-center justify-center text-[#DFB86C]">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-xl">YATRAMITR</span>
            </div>
            <p className="text-xs uppercase tracking-widest text-[#DFB86C] font-semibold">
              Hyderabad · Telangana
            </p>
          </div>

          <div className="relative z-10 space-y-3">
            <p className="font-serif text-lg sm:text-xl italic text-[#F5F1E8] leading-snug">
              &ldquo;Every old lane has a story. You just need someone local to show you where to look.&rdquo;
            </p>
            <p className="text-xs text-[#DFB86C] font-medium">— A Mitra&apos;s promise</p>
          </div>

          <div className="relative z-10 pt-4 border-t border-forest-800 text-[11px] text-[#E8DFCF]/60">
            Smart India Hackathon 2026 · Responsible tourism MVP
          </div>
        </div>

        {/* Right form */}
        <div className="md:col-span-7 p-8 sm:p-12 space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">Welcome back</h2>
            <p className="text-xs text-charcoal-700">Sign in to manage your Yatras, bookings and Mitra connections.</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-terracotta-50 border border-terracotta-200 text-xs text-terracotta-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label htmlFor="email" className="font-bold text-forest-950 uppercase tracking-wider block">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                  required
                />
                <Mail className="w-4 h-4 text-charcoal-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="font-bold text-forest-950 uppercase tracking-wider block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] text-terracotta-600 hover:underline"
                >
                  {resetSent ? '✓ Reset link sent!' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls}
                  required
                />
                <Lock className="w-4 h-4 text-charcoal-500 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Dedicated QA / Test fill button */}
            <button
              type="button"
              id="qa-autofill-btn"
              onClick={() => {
                setEmail('qa.tester@yitramitr.dev');
                setPassword('YitraMitrQA-Demo1!');
              }}
              className="w-full py-2 px-3 rounded-lg bg-forest-50 hover:bg-forest-100 border border-forest-200 text-forest-900 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span>Dedicated QA Account:</span>
              <span className="font-mono text-[11px] text-forest-700">qa.tester@yitramitr.dev</span>
            </button>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-[#F5F1E8] font-bold text-sm shadow-md transition-colors disabled:opacity-60 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 text-[#DFB86C]" />}
              Sign in
            </button>
          </form>

          {/* Demo entry */}
          <button
            id="login-demo-btn"
            onClick={handleDemo}
            className="w-full px-6 py-3.5 rounded-xl border-2 border-dashed border-[#B8955A] text-forest-900 font-bold text-sm hover:bg-gold-100/50 transition-colors cursor-pointer"
          >
            ✦ Try Demo — no account needed
          </button>

          <div className="pt-4 border-t border-sand-200 text-center text-xs text-charcoal-700 space-y-2">
            <p>
              New here?{' '}
              <Link href="/signup" className="font-bold text-terracotta-600 hover:underline">
                Create an account
              </Link>
            </p>
            <p className="text-[10px] text-charcoal-500">
              {`When Firebase credentials are configured, sign-in uses Firebase Authentication. Until then, sessions run in a clearly-labelled demo mode.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
