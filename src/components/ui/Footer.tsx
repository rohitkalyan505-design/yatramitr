import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0D211A] text-[#E8DFCF] border-t border-[#16352A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-[#16352A] border border-[#B8955A]/40 flex items-center justify-center text-[#B8955A]">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FFFFFF]">
                YATRAMITR
              </span>
            </Link>
            <p className="text-sm text-[#E8DFCF] max-w-sm leading-relaxed">
              Discover Hyderabad beyond the usual.
            </p>
            <p className="text-xs text-[#E8DFCF]/70 max-w-md leading-relaxed">
              A responsible-tourism platform connecting travellers with local Mitras across 24 real heritage places — with fair prices, transparent trust and live-trip safety.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#B8955A] pt-2">
              <ShieldCheck className="w-4 h-4 text-[#B8955A]" />
              <span>Smart India Hackathon 2026 Initiative</span>
            </div>
          </div>

          {/* Explore Column */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B8955A]">
              Explore
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/explore" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Experiences
                </Link>
              </li>
              <li>
                <Link href="/food" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Food Guide
                </Link>
              </li>
              <li>
                <Link href="/find-my-yatra" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Find My Yatra
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Column */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B8955A]">
              Community
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/become-mitra" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Become a Mitra
                </Link>
              </li>
              <li>
                <Link href="/mitras" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Mitras
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/price-check" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Price Check
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Safety Column */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B8955A]">
              Account & Safety
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/login" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Dashboard / My Yatra
                </Link>
              </li>
              <li>
                <Link href="/trip" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Live Trip & Checkpoints
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Emergency & Safety (112 · 108 · 1091 · 1363)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#16352A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8DFCF]/60">
          <p>© {new Date().getFullYear()} YATRAMITR. All rights reserved. Made for SIH 2026.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-2 text-xs text-[#E8DFCF]/70">
            <Link href="/how-it-works" className="hover:text-[#FFFFFF] transition-colors">Trust & Transparency</Link>
            <Link href="/price-check" className="hover:text-[#FFFFFF] transition-colors">Fair Price Guide</Link>
            <Link href="/become-mitra" className="hover:text-[#FFFFFF] transition-colors">Host Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
