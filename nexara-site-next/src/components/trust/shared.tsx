'use client';

// Cross-cutting helpers used by multiple Trust component groups. Extracted during
// Phase 2 decomposition — these aren't top-level page components, so the original
// group-by-component-name pass missed them; consolidated here once every group's
// `declare function`/`declare const` stub pointed at the same handful of names.

import { navLabel } from '@/lib/site';

/* Blueprint Ledger — divisions share one structural blueprint accent; they
   differ by plate numeral + serif tagline, not hue. */
export const TRUST_ACCENT: Record<string, string> = { academy: '#1E7A4D', labs: '#1E7A4D' };

export function getTrustSectionLabel(section: { id: string; name: string }) {
  return navLabel(section.id, 'trust') ?? section.name;
}

export const TRUST_SECTION_CTA: Record<string, string> = {
  academy:   'Plan a Talent Programme',
  labs:      'Scope a Product Build',
};
