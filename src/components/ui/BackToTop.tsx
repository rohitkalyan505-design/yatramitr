'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      id="back-to-top-btn"
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-5 left-5 z-40 flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#0D211A] border border-[#DFB86C]/50 text-[#DFB86C] text-xs font-bold shadow-2xl hover:bg-[#16352A] hover:border-[#DFB86C] hover:scale-105 transition-all duration-300 backdrop-blur-md cursor-pointer"
    >
      <ArrowUp className="w-4 h-4 text-[#DFB86C]" />
      <span className="text-[11px] uppercase tracking-wider font-semibold">Top</span>
    </button>
  );
}
