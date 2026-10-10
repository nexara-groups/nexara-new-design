'use client';
// shadcn-style card anatomy (Card / Header / Content / Footer) with a 21st.dev-style
// spotlight border that follows the cursor. Skinned per theme in styles/cards.css
// via the .neo / .trust ancestor, so one component serves both presentations.
import React from 'react';
import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type Package = {
  name: string;
  fit: string;
  price: string;
  duration: string;
  includes: string[];
};

export function SpotlightCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} data-slot="card" className={cn('nx-card', className)} onPointerMove={onPointerMove} {...props}>
      {children}
    </div>
  );
}

function PackageCard({ pkg, index, ctaLabel = 'Scope this package', onSelect }: {
  pkg: Package;
  index: number;
  ctaLabel?: string;
  onSelect: () => void;
}) {
  return (
    <SpotlightCard className="nx-pkg">
      <div data-slot="card-header" className="nx-pkg-header">
        <span className="nx-pkg-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="nx-pkg-fit">{pkg.fit}</span>
        <h3 className="nx-pkg-name">{pkg.name}</h3>
      </div>
      <div className="nx-pkg-price">
        <strong>{pkg.price}</strong>
        <span><Clock size={14} aria-hidden="true" />{pkg.duration}</span>
      </div>
      <ul data-slot="card-content" className="nx-pkg-list">
        {pkg.includes.map((item) => (
          <li key={item}><Check size={15} strokeWidth={2.4} aria-hidden="true" />{item}</li>
        ))}
      </ul>
      <div data-slot="card-footer" className="nx-pkg-footer">
        <button type="button" className="nx-pkg-cta" onClick={onSelect}>
          {ctaLabel} <span aria-hidden="true">→</span>
        </button>
      </div>
    </SpotlightCard>
  );
}

export function PackageGrid({ packages, ctaLabel, onSelect }: {
  packages: Package[];
  ctaLabel?: string;
  onSelect: (pkg: Package) => void;
}) {
  return (
    <div className="nx-pkg-grid">
      {packages.map((pkg, i) => (
        <PackageCard key={pkg.name} pkg={pkg} index={i} ctaLabel={ctaLabel} onSelect={() => onSelect(pkg)} />
      ))}
    </div>
  );
}
