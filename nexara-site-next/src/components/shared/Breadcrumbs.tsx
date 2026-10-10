'use client';
import React from 'react';
import Link from 'next/link';
import { getBreadcrumbs } from '@/lib/breadcrumbs';
import type { Theme } from '@/lib/site';

export function Breadcrumbs({
  theme,
  page,
  detail = null,
  currentLabel,
}: {
  theme: Theme;
  page: string;
  detail?: string | null;
  currentLabel?: string;
}) {
  if (page === 'home' || page === 'gateway') return null;
  const crumbs = getBreadcrumbs(theme, page, detail, currentLabel);
  if (crumbs.length < 2) return null; // Home-only trails stay hidden

  return (
    <nav className="nx-crumbs" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${i}`}>
              {i > 0 && <span className="nx-crumbs-sep" aria-hidden="true">/</span>}
              {last || !crumb.href ? (
                <span aria-current={last ? 'page' : undefined}>{crumb.label}</span>
              ) : (
                <Link prefetch={false} href={crumb.href}>{crumb.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
