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
                YATRA MITRA
              </span>
            </Link>
            <p className="text-sm text-[#E8DFCF] max-w-sm leading-relaxed">
              Hidden places. Local stories. Real connections.
            </p>
            <p className="text-xs text-[#E8DFCF]/70 max-w-md leading-relaxed">
              An authentic travel platform connecting conscious travellers with verified local custodians across the unmapped regions of India.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#B8955A] pt-2">
              <ShieldCheck className="w-4 h-4 text-[#B8955A]" />
              <span>Smart India Hackathon 2026 Initiative</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B8955A]">
              Explore
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/discover" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Experiences
                </Link>
              </li>
              <li>
                <Link href="/mitras" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Local Mitras
                </Link>
              </li>
              <li>
                <Link href="/place/hyderabad" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Hyderabad Demo Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Trust Column */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B8955A]">
              Platform & Trust
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/become-mitra" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Become a Mitra
                </Link>
              </li>
              <li>
                <Link href="/#trust" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Safety & Verification
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  Traveller Dashboard
                </Link>
              </li>
              <li>
                <Link href="/#beyond-map" className="text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                  About Our Mission
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#16352A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8DFCF]/60">
          <p>© {new Date().getFullYear()} YATRA MITRA. All rights reserved. Made for SIH 2026.</p>
          <div className="flex items-center space-x-6 text-xs text-[#E8DFCF]/70">
            <Link href="/#beyond-map" className="hover:text-[#FFFFFF] transition-colors">Trust Manifesto</Link>
            <Link href="/#trust" className="hover:text-[#FFFFFF] transition-colors">Ecosystem Fund</Link>
            <Link href="/become-mitra" className="hover:text-[#FFFFFF] transition-colors">Host Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
