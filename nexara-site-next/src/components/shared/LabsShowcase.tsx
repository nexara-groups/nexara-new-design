'use client';
import React from 'react';
import { DATA } from '@/lib/data';
import { COPY } from '@/lib/copy';
import { voiced, type Theme } from '@/lib/site';
import { labsAnchor } from './LabsMap';

const LABS = DATA.sections.labs;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function LabsSpecialisms({ theme }: { theme: Theme }) {
  const label = (link: { kind: string; id: string }) =>
    link.kind === 'product' ? LABS.products.find((p) => p.id === link.id)?.name ?? link.id : link.id;
  return (
    <div className="nx-labs-specs">
      {LABS.specialisms.map((s) => (
        <article key={s.id}>
          <h3>{voiced(s.title, theme)}</h3>
          <p>{voiced(s.line, theme)}</p>
          <span className="nx-labs-chips">
            {s.links.map((link) => (
              <a
                key={link.kind + link.id}
                className="nx-labs-chip is-link"
                href={`#${labsAnchor(link.kind === 'product' ? 'product' : 'proof', link.id)}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(labsAnchor(link.kind === 'product' ? 'product' : 'proof', link.id));
                }}
              >
                {label(link)}
              </a>
            ))}
          </span>
        </article>
      ))}
    </div>
  );
}

export function LabsProducts({ theme }: { theme: Theme }) {
  const c = COPY.labs.products;
  const layerLabel = (id: string) => LABS.layers.find((l) => l.id === id)?.label ?? id;
  return (
    <div className="nx-labs-products">
      {LABS.products.map((p) => (
        <article id={labsAnchor('product', p.id)} key={p.id}>
          <span className="nx-labs-product-top">
            <h3>{p.name}</h3>
            <span className="nx-labs-status" data-status={p.status}>{voiced(p.status === 'demo' ? c.demo : c.live, theme)}</span>
          </span>
          <p>{voiced(p.line, theme)}</p>
          <span className="nx-labs-chips">
            {p.layers.map((id) => <span className="nx-labs-chip" data-layer={id} key={id}>{layerLabel(id)}</span>)}
          </span>
          <a className="nx-labs-open" href={p.url} target="_blank" rel="noopener noreferrer">
            {voiced(c.open, theme)} <span aria-hidden="true">↗</span>
          </a>
        </article>
      ))}
    </div>
  );
}
