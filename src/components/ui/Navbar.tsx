'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Menu, X, ArrowRight, Route } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import DemoBadge from './DemoBadge';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Explore', href: '/explore' },
    { name: 'Find My Yatra', href: '/find-my-yatra' },
    { name: 'Experiences', href: '/experiences' },
    { name: 'Mitras', href: '/mitras' },
    { name: 'How It Works', href: '/how-it-works' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#16352A]/95 text-[#F5F1E8] backdrop-blur-md shadow-md border-b border-[#B8955A]/20 py-3'
          : 'bg-gradient-to-b from-[#0D211A]/90 via-[#0D211A]/60 to-transparent text-[#F5F1E8] py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-md bg-[#16352A] border border-[#B8955A]/40 flex items-center justify-center text-[#B8955A] group-hover:border-[#B8955A] transition-colors shadow-sm">
              <Compass className="w-5 h-5 transition-transform duration-500 group-hover:rotate-45" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#F5F1E8] block leading-none">
                YATRA MITRA
              </span>
              <span className="text-[10px] tracking-[0.2em] text-[#B8955A] uppercase font-semibold block mt-1">
                HYDERABAD · TELANGANA
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium tracking-wide transition-colors rounded-md ${
                    isActive
                      ? 'text-[#DFB86C] font-semibold bg-white/10'
                      : 'text-[#E8DFCF] hover:text-[#FFFFFF] hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Links */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[#B8955A]/50 text-[#F5F1E8] font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                <Route className="w-4 h-4 text-[#DFB86C]" />
                <span>My Yatra</span>
                {user.isDemo && <DemoBadge />}
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-medium text-[#E8DFCF] hover:text-[#FFFFFF] transition-colors">
                Sign In
              </Link>
            )}
            <Link
              href="/become-mitra"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#B8955A] hover:bg-[#a6844c] text-[#0D211A] font-semibold text-sm shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <span>Become a Mitra</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/find-my-yatra"
              className="px-3 py-1.5 text-xs font-semibold rounded bg-[#B8955A] text-[#0D211A]"
            >
              Find My Yatra
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-md text-[#F5F1E8] hover:bg-white/10 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-[#0D211A]/95 backdrop-blur-xl border-b border-[#B8955A]/30 px-5 pt-3 pb-6 space-y-3 mt-3 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-base font-medium text-[#E8DFCF] hover:text-[#FFFFFF] hover:bg-white/5 rounded-md"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-md border border-[#B8955A]/40 text-[#F5F1E8] font-medium text-sm"
              >
                My Yatra
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-md border border-[#B8955A]/40 text-[#F5F1E8] font-medium text-sm"
              >
                Sign In
              </Link>
            )}
            <Link
              href="/become-mitra"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-md bg-[#B8955A] text-[#0D211A] font-semibold text-sm"
            >
              Become a Mitra
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
