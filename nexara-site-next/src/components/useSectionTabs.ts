'use client';

import React from 'react';
import { getLenis } from './useSmoothScroll';

function restoreScroll(y: number) {
  const pin = Math.max(0, y);
  window.scrollTo(0, pin);
  getLenis()?.scrollTo(pin, { immediate: true });
}

/**
 * In-page section tabs without Next soft-nav.
 * Overview ↔ detail used to remount the RSC/client tree (different page files,
 * or soft-nav still resetting Lenis) and jump to top. Tab switches stay on the
 * mounted Site shell; URL updates via history for shareable deep links + Back.
 */
export function useSectionTabs<T extends { slug: string; title: string }>(
  theme: string,
  section: { id: string; subpages: readonly T[] },
  detail: string | null | undefined,
) {
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
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [section]);

  const selectTab = React.useCallback(
    (slug: string | null) => {
      const y = window.scrollY;
      setTabSlug(slug);
      const href = slug ? `/${theme}/${section.id}/${slug}` : `/${theme}/${section.id}`;
      if (location.pathname !== href) {
        window.history.pushState({ sectionTab: slug }, '', href);
      }
      restoreScroll(y);
      requestAnimationFrame(() => {
        restoreScroll(y);
        requestAnimationFrame(() => restoreScroll(y));
      });
    },
    [theme, section.id],
  );

  const active = React.useMemo(
    () => (tabSlug ? section.subpages.find((p) => p.slug === tabSlug) ?? null : null),
    [section.subpages, tabSlug],
  );

  return { active, selectTab };
}
