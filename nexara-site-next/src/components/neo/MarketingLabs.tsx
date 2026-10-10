'use client';
import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof window !== 'undefined') Object.assign(window, { gsap, ScrollTrigger });

declare global {
  interface Window {
    gsap?: typeof gsap;
    ScrollTrigger?: typeof ScrollTrigger;
  }
}

import { NeoSectionHero } from './SectionShell';
import { DATA } from '@/lib/data';
import { LabsPipeline, LABS_PIPE_NODES } from '../shared/LabsMap';

type Theme = 'neo' | 'trust';

// Real structural type from DATA, matching the convention in SectionShell.tsx —
// a hand-rolled version here previously didn't match the real shape.
type MarketingLabsSection = (typeof DATA.sections)[keyof typeof DATA.sections];

interface MarketingLabsHeroProps {
  theme: Theme;
  section: MarketingLabsSection;
}

interface NeoSectionHeroProps extends MarketingLabsHeroProps {
  variant: 'mkt' | 'labs';
  children: React.ReactNode;
}

export function LabsHero({ theme, section }: MarketingLabsHeroProps) {
  return (
    <NeoSectionHero theme={theme} section={section} variant="labs">
      <LabsPipeline nodes={LABS_PIPE_NODES} />
    </NeoSectionHero>
  );
}
