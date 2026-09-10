'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Compass, ShieldCheck, ArrowRight, Lock, Mail, User, Phone } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<'traveler' | 'buddy'>('traveler');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'buddy') {
      router.push('/become-a-buddy');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-forest-900/10 bg-sand-50">
        {/* Left Editorial Column */}
        <div className="md:col-span-5 relative bg-forest-950 p-8 sm:p-10 text-sand-50 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80"
              alt="Indian Landscape"
              fill
              className="object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-transparent" />
          </div>

          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-forest-900 border border-gold-500/40 flex items-center justify-center text-gold-400">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-xl text-sand-50">
                Yatra Mitra
              </span>
            </div>
            <p className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
              Travel with Purpose
            </p>
          </div>

          <div className="relative z-10 space-y-3">
            <p className="font-serif text-lg italic text-sand-100 leading-relaxed">
              "Join a growing movement of travelers who believe that tourism should nourish local communities, protect oral folklore, and leave zero negative footprint."
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-forest-800 text-[11px] text-sand-400">
            Smart India Hackathon 2026 Initiative
          </div>
        </div>

        {/* Right Form */}
        <div className="md:col-span-7 p-8 sm:p-12 space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
              Create Your Account
            </h2>
            <p className="text-xs text-charcoal-700">
              Begin your journey into unmapped, authentic Indian heritage.
            </p>
          </div>

          {/* Role Tabs */}
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
              Apply as Local Buddy
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-forest-950 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aarav Mehta"
                  className="w-full p-3 pl-9 rounded-xl bg-sand-100 border border-sand-300 text-charcoal-800 font-medium focus:outline-none"
                  required
                />
                <User className="w-4 h-4 text-charcoal-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-forest-950 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav@example.com"
                    className="w-full p-3 pl-9 rounded-xl bg-sand-100 border border-sand-300 text-charcoal-800 font-medium focus:outline-none"
                    required
                  />
                  <Mail className="w-4 h-4 text-charcoal-500 absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-forest-950 uppercase tracking-wider block">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-3 pl-9 rounded-xl bg-sand-100 border border-sand-300 text-charcoal-800 font-medium focus:outline-none"
                    required
                  />
                  <Phone className="w-4 h-4 text-charcoal-500 absolute left-3 top-3.5" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-forest-950 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full p-3 pl-9 rounded-xl bg-sand-100 border border-sand-300 text-charcoal-800 font-medium focus:outline-none"
                  required
                />
                <Lock className="w-4 h-4 text-charcoal-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-sand-50 font-bold text-sm shadow-md transition-colors"
            >
              <span>{role === 'buddy' ? 'Proceed to Buddy Vetting Application' : 'Create Traveler Account'}</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </button>
          </form>

          <div className="pt-3 border-t border-sand-200 text-center text-xs text-charcoal-700 space-y-1">
            <p>
              Already registered?{' '}
              <Link href="/login" className="font-bold text-terracotta-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
