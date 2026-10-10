'use client';
import React from 'react';
import Link from 'next/link';
import { DATA } from '@/lib/data';
import { COPY } from '@/lib/copy';
import { routePath } from '@/lib/seo';
import { voiced, type Theme } from '@/lib/site';
import { labsAnchor } from './LabsMap';

const LABS = DATA.sections.labs;

function statusCopy(status: string, theme: Theme) {
  const c = COPY.labs.products;
  if (status === 'demo') return voiced(c.demo, theme);
  if (status === 'building') return voiced(c.building, theme);
  return voiced(c.live, theme);
}

export function LabsProducts({ theme }: { theme: Theme }) {
  const c = COPY.labs.products;
  const extLabel = (status: string) =>
    status === 'demo' ? voiced(c.openDemo, theme) : voiced(c.liveSite, theme);
  return (
    <div className="nx-labs-products">
      {LABS.products.map((p) => (
        <article id={labsAnchor('product', p.id)} key={p.id} data-status={p.status}>
          {'shot' in p && p.shot ? (
            <Link prefetch={false} className="nx-labs-shot" href={routePath(theme, 'labs', p.id)} tabIndex={-1} aria-hidden="true">
              <img src={p.shot} alt="" loading="lazy" decoding="async" />
            </Link>
          ) : (
            <span className="nx-labs-shot is-empty" aria-hidden="true">
              <b>{statusCopy(p.status, theme)}</b>
            </span>
          )}
          <span className="nx-labs-product-top">
            <h3>{p.name}</h3>
            <span className="nx-labs-status" data-status={p.status}>{statusCopy(p.status, theme)}</span>
          </span>
          <p>{voiced(p.line, theme)}</p>
          <span className="nx-labs-product-actions">
            <Link prefetch={false} className="nx-labs-open" href={routePath(theme, 'labs', p.id)}>
              {voiced(c.open, theme)} <span aria-hidden="true">→</span>
            </Link>
            {p.url ? (
              <a className="nx-labs-open is-ext" href={p.url} target="_blank" rel="noopener noreferrer">
                {extLabel(p.status)} <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </span>
        </article>
      ))}
      <p className="nx-labs-mkt-note">
        {voiced(c.marketingNote, theme)}{' '}
        <Link prefetch={false} href={routePath(theme, 'marketing')}>{voiced(c.marketingLink, theme)}</Link>
      </p>
    </div>
  );
}
