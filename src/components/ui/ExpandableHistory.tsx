'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ExpandableHistory({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 280;

  if (!isLong) {
    return <p className="text-base text-charcoal-800 leading-relaxed">{text}</p>;
  }

  return (
    <div className="space-y-2">
      <p className={`text-base text-charcoal-800 leading-relaxed transition-all duration-300 ${!expanded ? 'line-clamp-4' : ''}`}>
        {text}
      </p>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="inline-flex items-center gap-1 text-xs font-bold text-[#16352A] hover:text-[#B8955A] transition-colors py-1 focus:outline-none"
      >
        <span>{expanded ? 'Show less' : 'Read full history'}</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
