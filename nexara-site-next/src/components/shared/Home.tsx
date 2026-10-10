'use client';
import React from 'react';
import { DATA } from '@/lib/data';
import { HOME_FLOW, voiced, type HomeBlock, type Theme } from '@/lib/site';
import { Insights } from './Blog';
import { Manifesto, Divisions, Work, Capabilities, Standards, HomeCta } from './HomeBlocks';
import { FaqBand } from './FaqBand';
import { PageFinder } from './PageFinder';
import { finderItems } from '@/lib/finder';
import { COPY } from '@/lib/copy';
import { LOCAL_FAQS, routePath } from '@/lib/seo';
import { NeoHeroUnravel } from '../neo/Hero';
import { TrustHeroUnravel } from '../trust/Hero';

// One home page for both themes. Every HOME_FLOW block is a shared component; the only
// theme-specific block is the hero, because its background animation is its own thing.
const BLOCKS: Record<HomeBlock, (theme: Theme) => React.ReactNode> = {
  hero: (theme) => theme === 'neo' ? <NeoHeroUnravel copy={DATA.home.neo} theme="neo" /> : <TrustHeroUnravel />,
  manifesto: (theme) => <Manifesto theme={theme} />,
  divisions: (theme) => <Divisions theme={theme} />,
  work: (theme) => <Work theme={theme} />,
  capabilities: (theme) => <Capabilities theme={theme} />,
  standards: (theme) => <Standards theme={theme} />,
  insights: (theme) => <Insights theme={theme} />,
  faqs: (theme) => <FaqBand theme={theme} copy={COPY.faqs} faqs={LOCAL_FAQS.home || []} sectionId="faqs" />,
  cta: (theme) => <HomeCta theme={theme} />,
};

export function Home({ theme }: { theme: Theme }) {
  return (
    <main className="nx-page">
      {HOME_FLOW.map((id) => <React.Fragment key={id}>{BLOCKS[id](theme)}</React.Fragment>)}
      <PageFinder
        label={voiced(COPY.finder.home.label, theme)}
        overview={voiced(COPY.finder.overview, theme)}
        items={finderItems('home', theme)}
        cta={{ label: voiced(COPY.finder.home.cta, theme), href: routePath(theme, 'contact') }}
        hero=":scope > :first-child"
        end=".nx-final-cta"
      />
    </main>
  );
}
