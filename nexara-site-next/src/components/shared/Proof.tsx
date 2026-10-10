'use client';
import React from 'react';
import { DATA, neoSectionName } from '@/lib/data';
import { COPY } from '@/lib/copy';
import { PROOF_FLOW, divisionLabel, type ProofBlock, type Theme } from '@/lib/site';
import { NotFound } from '../NotFound';
import { PageHeader } from './PageHeader';
import { CtaBand } from './About';
import { Builds } from './HomeBlocks';

type Division = (typeof DATA.sections)[keyof typeof DATA.sections];

const HERO = {
  neo: { kicker: 'Proof', title: 'Real clients. Live work.', accent: 'Open any of it.', body: 'A SaaS platform, an e-commerce site, a medical library, sales calculators and websites that sell, shipped for businesses in Visakhapatnam and across Andhra Pradesh.' },
  trust: { kicker: 'Delivery proof', title: 'Clients and delivered work.', accent: 'Live and inspectable.', body: 'Live client platforms you can inspect today: a SaaS product, an e-commerce site, a medical library, sales calculators and websites, for businesses in Visakhapatnam and across Andhra Pradesh.' },
};

// Same blocks, same order in both themes (PROOF_FLOW).
const BLOCKS: Record<ProofBlock, (theme: Theme, division: Division | null) => React.ReactNode> = {
  hero: (theme, division) => {
    const hero = HERO[theme];
    if (!division) return <PageHeader {...hero} />;
    const name = theme === 'neo' ? neoSectionName(division) : divisionLabel(division.id, theme);
    return <PageHeader kicker={`${name} / ${hero.kicker}`} title={theme === 'neo' ? `${name}, by the receipts.` : `${name}: delivery proof.`} accent={theme === 'neo' ? 'What this division produces.' : 'What this team produces.'} body={theme === 'neo' ? 'The operating proof this division is built to deliver, engagement after engagement.' : 'The delivery model this team works to, engagement after engagement.'} />;
  },
  builds: (theme, division) => <Builds theme={theme} divisionId={division?.id} />,
  cta: (theme) => <CtaBand theme={theme} copy={COPY.proof.cta} />,
};

export function Proof({ theme, detail }: { theme: Theme; detail: string | null }) {
  const division = detail ? (DATA.sections as Record<string, Division | undefined>)[detail] ?? null : null;
  if (detail && !division) return <NotFound theme={theme} page={`customers/${detail}`} />;
  return <main className="nx-page">{PROOF_FLOW.map((block) => <React.Fragment key={block}>{BLOCKS[block](theme, division)}</React.Fragment>)}</main>;
}
