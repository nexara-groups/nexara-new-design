'use client';
import React from 'react';
import Link from 'next/link';
import { CLIENTS, clientDomain, type ClientWork } from '@/lib/clients';
import { COPY } from '@/lib/copy';
import { voiced, type Theme } from '@/lib/site';
import { routePath } from '@/lib/seo';

const DWELL_MS = 5200;

export function ClientSpotlight({ theme }: { theme: Theme }) {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const reduceRef = React.useRef(false);
  const client = CLIENTS[active]!;

  React.useEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  React.useEffect(() => {
    if (reduceRef.current || paused) return;
    let start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DWELL_MS);
      setProgress(t);
      if (t >= 1) {
        setActive((i) => (i + 1) % CLIENTS.length);
        return; // effect restarts on active change
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, paused]);

  const go = (i: number) => {
    setActive(i);
    setProgress(0);
  };

  return (
    <section
      className="nx-section nx-spot"
      id="work"
      aria-labelledby="nx-work-h"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false); }}
    >
      <div className="nx-inner">
        <div className="nx-head">
          <div>
            <p className="nx-kicker">{voiced(COPY.home.work.kicker, theme)}</p>
            <h2 className="nx-h2" id="nx-work-h">{voiced(COPY.home.work.title, theme)}</h2>
            <p className="nx-lede">{voiced(COPY.home.work.lede, theme)}</p>
          </div>
          <Link prefetch={false} className="nx-text-link" href={routePath(theme, 'customers')}>{voiced(COPY.clients.stripAll, theme)} →</Link>
        </div>

        <div className="nx-spot-stage">
          <span className="nx-spot-glow" aria-hidden="true" />
          <span className="nx-spot-ring" aria-hidden="true" />
          <SpotSlide key={client.url} client={client} theme={theme} index={active} />
          <div className="nx-spot-progress" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>
        </div>

        <div className="nx-spot-dots" role="tablist" aria-label={voiced(COPY.home.work.title, theme)}>
          {CLIENTS.map((c, i) => (
            <button
              key={c.url}
              type="button"
              role="tab"
              className="nx-spot-dot"
              aria-selected={i === active}
              aria-label={c.name}
              onClick={() => go(i)}
            />
          ))}
        </div>

        <div className="nx-spot-thumbs">
          {CLIENTS.map((c, i) => (
            <button
              key={c.url}
              type="button"
              className={`nx-spot-thumb${i === active ? ' is-on' : ''}`}
              aria-label={c.name}
              aria-current={i === active ? 'true' : undefined}
              onClick={() => go(i)}
            >
              <span className="nx-spot-thumb-logo" aria-hidden="true"><img src={c.logo} alt="" loading="lazy" decoding="async" /></span>
              <b aria-hidden="true">{c.name}</b>
              <span aria-hidden="true">{c.sector}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpotSlide({ client, theme, index }: { client: ClientWork; theme: Theme; index: number }) {
  const domain = clientDomain(client.url);
  const n = String(index + 1).padStart(2, '0');
  return (
    <article className="nx-spot-slide">
      <div className="nx-spot-visual">
        <span className="nx-spot-logo"><img src={client.logo} alt="" /></span>
      </div>
      <div className="nx-spot-copy">
        <span className="nx-spot-meta">
          <span className="nx-client-live"><i aria-hidden="true" />{voiced(COPY.clients.live, theme)}{client.badge ? ` · ${client.badge}` : ''}</span>
          <span>{n} / {client.sector}</span>
        </span>
        <h3 className="nx-spot-name">{client.name}</h3>
        <p className="nx-spot-line">{client.line}</p>
        <ul className="nx-spot-built">
          {client.built.slice(0, 4).map((item, i) => (
            <li key={item} style={{ ['--i' as string]: i }}>{item}</li>
          ))}
        </ul>
        <span className="nx-spot-scope">{client.scope.map((tag) => <span key={tag}>{tag}</span>)}</span>
        <a className="nx-spot-open" href={client.url} target="_blank" rel="noopener noreferrer">
          {voiced(COPY.home.work.open, theme)} {domain} <span className="arr" aria-hidden="true">↗</span>
          <span className="nx-sr"> ({voiced(COPY.clients.opens, theme)})</span>
        </a>
      </div>
    </article>
  );
}
