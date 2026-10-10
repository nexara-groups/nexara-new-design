import React from 'react';
import Link from 'next/link';
import { CLIENTS, clientDomain, type ClientWork } from '@/lib/clients';
import { DATA, neoLabel } from '@/lib/data';
import { COPY } from '@/lib/copy';
import { voiced, type Theme } from '@/lib/site';
import { routePath } from '@/lib/seo';

// Same card the production site uses: live mark, index, logo plate, one line, scope, url.
// Both themes share the structure. Colour comes from the theme tokens.
export function ClientCard({ client, index, theme }: { client: ClientWork; index: number; theme: Theme }) {
  const domain = clientDomain(client.url);
  const n = String(index + 1).padStart(2, '0');
  return (
    <a className="nx-client" href={client.url} target="_blank" rel="noopener noreferrer">
      <span className="nx-client-meta">
        <span className="nx-client-tags">
          <span className="nx-client-live"><i aria-hidden="true" />{voiced(COPY.clients.live, theme)}</span>
          {client.badge && <span className="nx-badge">{client.badge}</span>}
        </span>
        <span>{n} / {client.sector}</span>
      </span>
      <span className="nx-client-logo"><img src={client.logo} alt="" loading="lazy" decoding="async" /></span>
      <h3>
        {client.name}
        <span className="nx-sr"> ({domain}, {voiced(COPY.clients.opens, theme)})</span>
      </h3>
      <p>{client.line}</p>
      {client.result && <p className="nx-client-result"><strong>{voiced(COPY.clients.result, theme)}</strong> {client.result}</p>}
      <span className="nx-client-scope">{client.scope.map((tag) => <span key={tag}>{tag}</span>)}</span>
      <span className="nx-client-url" aria-hidden="true">{domain} <span className="arr">↗</span></span>
    </a>
  );
}

export function ClientBench({ theme }: { theme: Theme }) {
  const { building } = DATA.work;
  return (
    <aside className="nx-client-bench" aria-label={voiced(COPY.clients.bench, theme)}>
      <span className="nx-client-bench-label">{voiced(COPY.clients.bench, theme)}</span>
      <ul>
        {building.map((b) => <li key={b.name}><b>{b.name}</b><span>{theme === 'neo' ? neoLabel(b.kind) : b.kind}</span></li>)}
        <li className="nx-client-more"><b>{voiced(COPY.clients.more, theme)}</b></li>
      </ul>
    </aside>
  );
}

export function ClientGrid({ theme }: { theme: Theme }) {
  return (
    <>
      <div className="nx-client-grid">
        {CLIENTS.map((c, i) => <ClientCard key={c.url} client={c} index={i} theme={theme} />)}
      </div>
      <ClientBench theme={theme} />
    </>
  );
}

// Slim proof strip for directly under the hero. Logos sit on neutral plates so mixed logo
// backgrounds read evenly; the full cards live in the work block and on the Proof page.
export function ClientStrip({ theme }: { theme: Theme }) {
  return (
    <section className="nx-strip" aria-label={voiced(COPY.clients.stripLabel, theme)}>
      <div className="nx-inner nx-strip-inner">
        <p className="nx-strip-label">{voiced(COPY.clients.stripLabel, theme)}</p>
        <ul className="nx-strip-logos">
          {CLIENTS.map((c) => (
            <li key={c.url} title={c.name}><img src={c.logo} alt={c.name} loading="lazy" decoding="async" /></li>
          ))}
        </ul>
        <Link prefetch={false} className="nx-text-link" href={routePath(theme, 'customers')}>{voiced(COPY.clients.stripAll, theme)} →</Link>
      </div>
    </section>
  );
}
