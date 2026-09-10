import React from 'react';

interface SectionHeadingProps {
  overline?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
  dark?: boolean;
}

export default function SectionHeading({
  overline,
  title,
  subtitle,
  center = false,
  className = '',
  dark = false,
}: SectionHeadingProps) {
  return (
    <div className={`space-y-3 ${center ? 'text-center max-w-2xl mx-auto' : 'max-w-3xl'} ${className}`}>
      {overline && (
        <div className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${dark ? 'text-gold-400' : 'text-terracotta-600'}`}>
          <span className={`w-6 h-[1.5px] ${dark ? 'bg-gold-400' : 'bg-terracotta-600'}`}></span>
          {overline}
        </div>
      )}
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight ${dark ? 'text-sand-50' : 'text-forest-950'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base sm:text-lg leading-relaxed ${dark ? 'text-sand-200' : 'text-charcoal-700'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
