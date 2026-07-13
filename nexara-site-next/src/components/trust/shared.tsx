'use client';

// Cross-cutting helpers used by multiple Trust component groups. Extracted during
// Phase 2 decomposition — these aren't top-level page components, so the original
// group-by-component-name pass missed them; consolidated here once every group's
// `declare function`/`declare const` stub pointed at the same handful of names.

import { GraduationCap, TrendingUp, Cpu, Shield, Mail } from 'lucide-react';
import { DATA } from '@/lib/data';

export const TRUST_NAV_ICONS = {
  academy:   <GraduationCap size={13} strokeWidth={2} />,
  marketing: <TrendingUp    size={13} strokeWidth={2} />,
  labs:      <Cpu           size={13} strokeWidth={2} />,
  customers: <Shield        size={13} strokeWidth={2} />,
  contact:   <Mail          size={13} strokeWidth={2} />,
};

/* Blueprint Ledger — divisions share one structural blueprint accent; they
   differ by plate numeral + serif tagline, not hue. */
export const TRUST_ACCENT: Record<string, string> = { academy: '#66A0CC', marketing: '#66A0CC', labs: '#66A0CC' };

export const TRUST_OPERATING_STANDARD = [
  { title: 'Written before built', body: "Every engagement starts with a written brief and scope. If it isn't written down, it isn't agreed." },
  { title: 'Demo every week', body: 'Working software, live cohorts, running campaigns — shown weekly, not described in decks.' },
  { title: 'One accountable lead', body: 'Every cohort, system and campaign has a single named owner from kickoff to handover.' },
  { title: 'Handover by design', body: 'Documentation, access and training are part of the deliverable — never an afterthought.' },
];

export function getTrustNavLabel(item: { trustLabel?: string; label: string }) {
  return item.trustLabel || item.label;
}

export function getTrustSectionLabel(section: { id: string; name: string }) {
  const navItem = DATA.nav.find((item) => item.page === section.id);
  return navItem ? getTrustNavLabel(navItem) : section.name;
}

export const TRUST_SHEET_DESCS: Record<string, string> = {
  academy:   "Talent built cohort by cohort, with reported placement readiness.",
  marketing: "Market infrastructure — positioning, build, launch, optimise.",
  labs:      "Software that solves the problem — SaaS, products and applied AI.",
  customers: "Verified client outcomes, indexed by engagement type.",
  contact:   "Start a scoped engagement with a named owner.",
};

export const TRUST_SECTION_CTA: Record<string, string> = {
  academy:   'Plan a Talent Programme',
  marketing: 'Scope a Digital Project',
  labs:      'Scope a Product Build',
};
