'use client';

import React from 'react';
import { COPY } from '@/lib/copy';
import { labsCapabilityTabs, labsProductTabs, voiced, type Theme } from '@/lib/site';

type Subpage = { slug: string; title: string };
type Section = { id: string; subpages: Subpage[] };

// In-section tabs. Parent owns selection via useSectionTabs (no Next soft-nav).
// Labs uses two labelled groups (Capabilities + Products); other sections stay flat.
export function SubNav({
  section,
  active,
  onSelect,
  theme = 'neo',
}: {
  theme?: Theme | string;
  section: Section;
  active?: Subpage | null;
  onSelect: (slug: string | null) => void;
}) {
  const navRef = React.useRef<HTMLElement | null>(null);
  const t = (theme === 'trust' ? 'trust' : 'neo') as Theme;
  const isLabs = section.id === 'labs';
  const groups = isLabs
    ? [
        { id: 'capabilities', label: voiced(COPY.labs.nav.capabilities, t), items: labsCapabilityTabs() },
        { id: 'products', label: voiced(COPY.labs.nav.products, t), items: labsProductTabs() },
      ]
    : null;

  React.useEffect(() => {
    const root = navRef.current;
    if (!root) return;
    const selected = root.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!selected) return;
    const left = selected.offsetLeft - (root.clientWidth - selected.clientWidth) / 2;
    root.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [active?.slug]);

  const Tab = ({ slug, title, selected }: { slug: string | null; title: string; selected: boolean }) => (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={selected ? 'active' : ''}
      onClick={() => onSelect(slug)}
    >
      {title}
    </button>
  );

  return (
    <nav ref={navRef} className={`subnav${isLabs ? ' subnav--labs' : ''}`} aria-label="Section tabs" role="tablist">
      <Tab slug={null} title={isLabs ? voiced(COPY.labs.nav.overview, t) : 'Overview'} selected={!active} />
      {groups ? (
        groups.map((group) => (
          <span className="subnav-group" key={group.id} role="presentation">
            <span className="subnav-group-label" aria-hidden="true">{group.label}</span>
            {group.items.map((item) => (
              <Tab key={item.slug} slug={item.slug} title={item.title} selected={active?.slug === item.slug} />
            ))}
          </span>
        ))
      ) : (
        section.subpages.map((item) => (
          <Tab key={item.slug} slug={item.slug} title={item.title} selected={active?.slug === item.slug} />
        ))
      )}
    </nav>
  );
}
