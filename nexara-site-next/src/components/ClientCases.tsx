'use client';
// Client proof: logo wall + one case per live client (what the business does,
// what Nexara built). Shared by /neo/customers and /trust/customers; skinned by
// the .neo / .trust ancestor in styles/cards.css.
import { Check, ArrowUpRight } from 'lucide-react';
import { DATA } from '@/lib/data';
import { SpotlightCard } from './ui/package-card';

export function ClientLogoWall() {
  return (
    <ul className="nx-logo-wall" aria-label="Clients">
      {DATA.work.live.map((w) => (
        <li key={w.url}>
          <a href={w.url} target="_blank" rel="noopener noreferrer" aria-label={`${w.name} — visit live site`}>
            <img src={w.logo} alt={`${w.name} logo`} loading="lazy" decoding="async" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ClientCases({ theme }: { theme: 'neo' | 'trust' }) {
  const { live, building } = DATA.work;
  const isNeo = theme === 'neo';
  return (
    <div className="nx-cases">
      {live.map((w, i) => (
        <SpotlightCard key={w.url} className="nx-case">
          <div className="nx-case-id">
            <span className="nx-case-plate"><img src={w.logo} alt={`${w.name} logo`} loading="lazy" decoding="async" /></span>
            <span className="nx-case-num">{isNeo ? `Case ${String(i + 1).padStart(2, '0')}` : `Record ${String(i + 1).padStart(2, '0')}`}</span>
            <h3>{w.name}</h3>
            <p className="nx-case-place">{w.sector} · {w.place}</p>
            <span className="nx-case-scope">{w.scope.map((t) => <span key={t}>{t}</span>)}</span>
            <a className="nx-case-link" href={w.url} target="_blank" rel="noopener noreferrer">
              {w.url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')} <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="nx-case-story">
            <div>
              <span className="nx-case-label">{isNeo ? 'The business' : 'Client'}</span>
              <p>{w.does}</p>
            </div>
            <div>
              <span className="nx-case-label">{isNeo ? 'What we built' : 'What Nexara delivered'}</span>
              <ul>
                {w.built.map((b) => <li key={b}><Check size={15} strokeWidth={2.4} aria-hidden="true" />{b}</li>)}
              </ul>
            </div>
          </div>
        </SpotlightCard>
      ))}
      <div className="nx-case-bench">
        <span className="nx-case-label">{isNeo ? 'On the bench' : 'In delivery'}</span>
        <ul>
          {building.map((b) => <li key={b.name}><b>{b.name}</b><span>{b.kind}</span></li>)}
          <li><b>{isNeo ? '+ more in the pipeline' : '+ further engagements in the pipeline'}</b></li>
        </ul>
      </div>
    </div>
  );
}
