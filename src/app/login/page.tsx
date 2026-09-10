'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Compass, ShieldCheck, ArrowRight, Lock, Mail, Users } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'traveler' | 'buddy'>('traveler');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'buddy') {
      router.push('/buddy/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-forest-900/10 bg-sand-50">
        {/* Left Editorial Visual (Hero Quote) */}
        <div className="md:col-span-5 relative bg-forest-950 p-8 sm:p-10 text-sand-50 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1000&q=80"
              alt="Araku Valley Mist"
              fill
              className="object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-transparent" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-forest-900 border border-gold-500/40 flex items-center justify-center text-gold-400">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-xl text-sand-50">
                Yatra Mitra
              </span>
            </div>
            <p className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
              The Hidden Side of India
            </p>
          </div>

          <div className="relative z-10 space-y-3">
            <p className="font-serif text-lg sm:text-xl italic text-sand-100 leading-snug">
              "The forest does not reveal its secrets to a rush of tourist buses. You must walk quietly to hear the mountain speak."
            </p>
            <p className="text-xs text-gold-300 font-medium">
              — Subba Rao Konda, Araku Local Buddy
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-forest-800 text-[11px] text-sand-400">
            Smart India Hackathon 2026 • Cultural Preservation
          </div>
        </div>

        {/* Right Form */}
        <div className="md:col-span-7 p-8 sm:p-12 space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
              Welcome Back
            </h2>
            <p className="text-xs text-charcoal-700">
              Sign in to manage your immersive journeys or Local Buddy host dashboard.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-sand-200/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => setRole('traveler')}
              className={`py-2 rounded-lg transition-all ${
                role === 'traveler'
                  ? 'bg-forest-900 text-sand-50 shadow-sm'
                  : 'text-charcoal-700 hover:text-forest-950'
              }`}
            >
              Conscious Traveler
            </button>
            <button
              type="button"
              onClick={() => setRole('buddy')}
              className={`py-2 rounded-lg transition-all ${
                role === 'buddy'
                  ? 'bg-forest-900 text-sand-50 shadow-sm'
                  : 'text-charcoal-700 hover:text-forest-950'
              }`}
            >
              Verified Local Buddy
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-forest-950 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="traveler@yatramitra.in"
                  className="w-full p-3 pl-9 rounded-xl bg-sand-100 border border-sand-300 text-charcoal-800 font-medium focus:outline-none focus:border-forest-800"
                  required
                />
                <Mail className="w-4 h-4 text-charcoal-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-forest-950 uppercase tracking-wider block">
                  Password
                </label>
                <a href="#" className="text-[11px] text-terracotta-600 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 pl-9 rounded-xl bg-sand-100 border border-sand-300 text-charcoal-800 font-medium focus:outline-none focus:border-forest-800"
                  required
                />
                <Lock className="w-4 h-4 text-charcoal-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-sand-50 font-bold text-sm shadow-md transition-colors"
            >
              <span>{role === 'buddy' ? 'Enter Buddy Portal' : 'Sign In as Traveler'}</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </button>
          </form>

          {/* Footer note */}
          <div className="pt-4 border-t border-sand-200 text-center text-xs text-charcoal-700 space-y-2">
            <p>
              Don't have an account?{' '}
              <Link href="/signup" className="font-bold text-terracotta-600 hover:underline">
                Create an Account
              </Link>
            </p>
            <p className="text-[11px] text-charcoal-500">
              Frontend prototype ready for Firebase Authentication integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
