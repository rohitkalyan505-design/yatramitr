import React from 'react';
import { FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DemoBadge({ label = 'DEMO', className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F3D5C7] text-[#80311F] border border-[#E7A890] text-[9px] font-bold uppercase tracking-wider',
        className
      )}
      title="Demo/prototype data — created to demonstrate the product workflow, not a real user or transaction"
    >
      <FlaskConical className="w-3 h-3" />
      {label}
    </span>
  );
}
