'use client';

import React from 'react';

type Subpage = { slug: string; title: string };
type Section = { id: string; subpages: Subpage[] };

// In-section tabs. Parent owns selection via useSectionTabs (no Next soft-nav).
export function SubNav({
  section,
  active,
  onSelect,
}: {
  theme?: string;
  section: Section;
  active?: Subpage | null;
  onSelect: (slug: string | null) => void;
}) {
  const navRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const root = navRef.current;
    if (!root) return;
    const selected = root.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!selected) return;
    const left = selected.offsetLeft - (root.clientWidth - selected.clientWidth) / 2;
    root.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [active?.slug]);

  return (
    <nav ref={navRef} className="subnav" aria-label="Section tabs" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={!active}
        className={!active ? 'active' : ''}
        onClick={() => onSelect(null)}
      >
        Overview
      </button>
      {section.subpages.map((item) => {
        const selected = active?.slug === item.slug;
        return (
          <button
            type="button"
            role="tab"
            aria-selected={selected}
            key={item.slug}
            className={selected ? 'active' : ''}
            onClick={() => onSelect(item.slug)}
          >
            {item.title}
          </button>
        );
      })}
    </nav>
  );
}
