'use client';

import React from 'react';
import { getLenis } from './useSmoothScroll';

function scrollToTop() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { immediate: reduced });
  else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
}

/**
 * In-page section tabs without Next soft-nav.
 * Overview ↔ detail used to remount the RSC/client tree (different page files,
 * or soft-nav still resetting Lenis) and jump to top. Tab switches stay on the
 * mounted Site shell; URL updates via history for shareable deep links + Back.
 * Detail panels are short — always land at top so content is visible.
 */
// Constrain on the section object (not a single subpage element type) so
// academy/marketing (with heading) and labs (with seenIn, no heading) can
// share this hook without forcing a common subpage shape.
export function useSectionTabs<
  S extends { id: string; subpages: readonly { slug: string; title: string }[] },
>(theme: string, section: S, detail: string | null | undefined) {
  const [tabSlug, setTabSlug] = React.useState<string | null>(detail ?? null);

  React.useEffect(() => {
    setTabSlug(detail ?? null);
  }, [detail, section.id]);

  React.useEffect(() => {
    const onPop = () => {
      const parts = location.pathname.split('/').filter(Boolean);
      const idx = parts.indexOf(section.id);
      const next = idx >= 0 ? (parts[idx + 1] ?? null) : null;
      setTabSlug(next && section.subpages.some((p) => p.slug === next) ? next : null);
      scrollToTop();
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [section]);

  const selectTab = React.useCallback(
    (slug: string | null) => {
      setTabSlug(slug);
      const href = slug ? `/${theme}/${section.id}/${slug}` : `/${theme}/${section.id}`;
      if (location.pathname !== href) {
        window.history.pushState({ sectionTab: slug }, '', href);
      }
      scrollToTop();
      requestAnimationFrame(() => {
        scrollToTop();
        requestAnimationFrame(() => scrollToTop());
      });
    },
    [theme, section.id],
  );

  const active = React.useMemo(
    () => (tabSlug ? section.subpages.find((p) => p.slug === tabSlug) ?? null : null) as S['subpages'][number] | null,
    [section.subpages, tabSlug],
  );

  return { active, selectTab };
}
