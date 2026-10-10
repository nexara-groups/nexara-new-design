'use client';
import React from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DATA } from '@/lib/data';
import { COPY, OPERATING_STANDARD, HOME_STANDARDS } from '@/lib/copy';
import { voiced, divisionLabel, type Theme } from '@/lib/site';
import { getSeo, routePath } from '@/lib/seo';
import { ClientSpotlight } from './ClientSpotlight';
import { ClientBench } from './ClientCard';
import { CLIENTS, clientDomain, clientTeams, type ClientTeam, type ClientWork } from '@/lib/clients';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

function accentClass(word: string) {
  const lower = word.toLowerCase();
  if (lower.includes('grows') || lower.includes('people')) return ' accent c-academy';
  if (lower.includes('intelligent') || lower.includes('systems')) return ' accent c-labs';
  if (lower.includes('brands') || lower.includes('move')) return ' accent c-marketing';
  return '';
}

export function Manifesto({ theme }: { theme: Theme }) {
  const wrapRef = React.useRef<HTMLElement>(null);
  const words = voiced(COPY.home.manifesto.text, theme).split(/\s+/);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const spans = el.querySelectorAll('.w');
    el.classList.add('is-scrubbing');
    const paint = (progress: number) => {
      const lit = Math.ceil(Math.min(1, progress / 0.8) * spans.length);
      spans.forEach((span, i) => span.classList.toggle('on', i < lit));
    };
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      end: 'top 45%',
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => paint(self.progress),
      onRefresh: (self) => paint(self.progress),
      onLeave: () => paint(1),
      onLeaveBack: () => paint(0),
    });
    ScrollTrigger.refresh();
    return () => {
      st.kill();
      el.classList.remove('is-scrubbing');
    };
  }, [theme]);

  return (
    <section className="nx-section nx-manifesto" ref={wrapRef}>
      <div className="nx-inner">
        <p className="nx-kicker">{voiced(COPY.home.manifesto.kicker, theme)}</p>
        <p className="nx-manifesto-text">
          {words.map((word, i) => (
            <React.Fragment key={i}>
              <span className={`w${accentClass(word)}`}>{word}</span>{' '}
            </React.Fragment>
          ))}
        </p>
      </div>
    </section>
  );
}

export function Divisions({ theme }: { theme: Theme }) {
  const sections = Object.values(DATA.sections);
  const seo = getSeo({ theme, page: 'home', detail: null });
  const wrapRef = React.useRef<HTMLElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const mq = window.matchMedia('(min-width: 761px) and (prefers-reduced-motion: no-preference)');
    let st: ScrollTrigger | null = null;
    const setup = () => {
      st?.kill();
      st = null;
      track.style.transform = '';
      if (!mq.matches) return;
      st = ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const max = Math.max(0, track.scrollWidth - window.innerWidth);
          track.style.transform = `translateX(${-max * self.progress}px)`;
          if (progressRef.current) {
            progressRef.current.textContent =
              '0' + Math.min(sections.length, 1 + Math.floor(self.progress * (sections.length - 0.01)));
          }
        },
      });
    };

    setup();
    mq.addEventListener('change', setup);
    return () => {
      mq.removeEventListener('change', setup);
      st?.kill();
      track.style.transform = '';
    };
  }, [theme, sections.length]);

  return (
    <section className="nx-rail-wrap" id="divisions" aria-labelledby="nx-div-h" ref={wrapRef}>
      <div className="nx-rail-stage">
        <div className="nx-rail-head">
          <div>
            <p className="nx-kicker">{voiced(COPY.home.divisions.kicker, theme)}</p>
            <h2 className="nx-h2" id="nx-div-h">{seo.heading}</h2>
            <p className="nx-lede">{seo.body}</p>
          </div>
          <p className="nx-rail-progress" aria-hidden="true">
            <b ref={progressRef}>01</b> / 0{sections.length}
          </p>
        </div>
        <div className="nx-rail-track" ref={trackRef}>
          {sections.map((sec, i) => {
            const label = divisionLabel(sec.id, theme);
            const tagline = COPY.home.divisions.tagline[sec.id];
            const local = COPY.home.divisions.local[sec.id];
            return (
              <Link
                prefetch={false}
                className="nx-rail-panel"
                data-div={sec.id}
                key={sec.id}
                href={routePath(theme, sec.id)}
              >
                <span className="nx-rail-idx">0{i + 1} / {label}</span>
                <span className="nx-rail-orb" aria-hidden="true" />
                <span className="nx-rail-ring" aria-hidden="true" />
                <h3>
                  {label}
                  {tagline && <><br /><em>{voiced(tagline, theme)}</em></>}
                </h3>
                <p>{local ? voiced(local, theme) : sec.short[theme]}</p>
                <span className="nx-rail-tags">
                  {sec.stack.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
                </span>
                <span className="nx-rail-enter">
                  {voiced(COPY.home.divisions.enter, theme)} {label}{' '}
                  <span className="arr" aria-hidden="true">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Work({ theme }: { theme: Theme }) {
  return <ClientSpotlight theme={theme} />;
}

export function Capabilities({ theme }: { theme: Theme }) {
  const items = COPY.home.capabilities.items;
  const doubled = [...items, ...items];
  return (
    <section className="nx-cap-strip" aria-label={voiced(COPY.home.capabilities.label, theme)}>
      <div className="nx-cap-strip-inner">
        <p className="nx-cap-strip-label">{voiced(COPY.home.capabilities.label, theme)}</p>
        <div className="nx-cap-rail" aria-hidden="true">
          <ul className="nx-cap-track">
            {doubled.map((item, i) => <li key={`${voiced(item, theme)}-${i}`}>{voiced(item, theme)}</li>)}
          </ul>
        </div>
        <ul className="nx-sr">
          {items.map((item) => <li key={voiced(item, theme)}>{voiced(item, theme)}</li>)}
        </ul>
        <Link prefetch={false} className="nx-text-link" href={routePath(theme, 'customers')}>
          {voiced(COPY.clients.stripAll, theme)} →
        </Link>
      </div>
    </section>
  );
}

type BuildFilter = 'all' | ClientTeam;

function filterClients(filter: BuildFilter): ClientWork[] {
  if (filter === 'all') return CLIENTS;
  return CLIENTS.filter((client) => clientTeams(client).includes(filter));
}

function defaultCase(clients: ClientWork[]): ClientWork | null {
  if (!clients.length) return null;
  return clients.find((client) => client.featured) ?? clients[0]!;
}

function CaseView({ client, theme }: { client: ClientWork; theme: Theme }) {
  return (
    <article className="nx-builds-case" aria-labelledby="nx-builds-case-h">
      <div className="nx-builds-case-top">
        <span className="nx-builds-logo">
          <img src={client.logo} alt="" loading="lazy" decoding="async" />
        </span>
        <div>
          <div className="nx-builds-meta">
            <span className="nx-builds-case-kicker">{voiced(COPY.proof.builds.selected, theme)}</span>
            <span className="nx-client-live"><i aria-hidden="true" />{voiced(COPY.clients.live, theme)}</span>
            {client.badge && <span className="nx-badge">{client.badge}</span>}
            <span>{client.sector}{' · '}{client.place}</span>
          </div>
          <h3 className="nx-builds-case-name" id="nx-builds-case-h">{client.name}</h3>
          <p className="nx-builds-case-does">{client.does}</p>
          <div className="nx-builds-team-tags" aria-label={voiced(COPY.clients.divisions, theme)}>
            {clientTeams(client).map((team) => (
              <span key={team}>{divisionLabel(team, theme)}</span>
            ))}
          </div>
        </div>
      </div>

      <ol className="nx-builds-steps">
        {client.problem && (
          <li>
            <span className="nx-builds-step-label">{voiced(COPY.proof.builds.problem, theme)}</span>
            <p>{voiced(client.problem, theme)}</p>
          </li>
        )}
        <li>
          <span className="nx-builds-step-label">{voiced(COPY.proof.builds.build, theme)}</span>
          <p>{voiced(client.story, theme)}</p>
        </li>
        <li>
          <span className="nx-builds-step-label">{voiced(COPY.proof.builds.shipped, theme)}</span>
          <ul className="nx-builds-items">
            {client.built.map((item) => <li key={item}>{item}</li>)}
          </ul>
          {client.result && (
            <p className="nx-builds-result">
              <strong>{voiced(COPY.clients.result, theme)}</strong> {client.result}
            </p>
          )}
        </li>
      </ol>

      <div className="nx-builds-foot">
        <span className="nx-client-scope" aria-label={voiced(COPY.clients.built, theme)}>
          {client.scope.map((tag) => <span key={tag}>{tag}</span>)}
        </span>
        <a className="nx-text-link" href={client.url} target="_blank" rel="noopener noreferrer">
          {voiced(COPY.proof.builds.open, theme)}{' · '}{clientDomain(client.url)}{' '}
          <span className="arr" aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}

export function Builds({ theme, divisionId }: { theme: Theme; divisionId?: string }) {
  const showFilters = !divisionId;
  const [activeFilter, setActiveFilter] = React.useState<BuildFilter>('all');
  const filter: BuildFilter =
    divisionId === 'marketing' || divisionId === 'labs' ? divisionId : activeFilter;

  const clients = divisionId === 'academy' ? [] : filterClients(filter);
  const [selectedUrl, setSelectedUrl] = React.useState<string | null>(null);
  const clientKey = clients.map((c) => c.url).join('|');

  React.useEffect(() => {
    const visible = divisionId === 'academy' ? [] : filterClients(filter);
    setSelectedUrl((current) => {
      if (current && visible.some((c) => c.url === current)) return current;
      return defaultCase(visible)?.url ?? null;
    });
  }, [filter, clientKey, divisionId]);

  const selected = clients.find((client) => client.url === selectedUrl) ?? defaultCase(clients);
  const filters: BuildFilter[] = ['all', 'marketing', 'labs'];

  return (
    <section className="nx-section nx-builds" id="builds" aria-labelledby="nx-builds-h">
      <div className="nx-inner">
        <div className="nx-head">
          <div>
            <p className="nx-kicker">{voiced(COPY.proof.builds.kicker, theme)}</p>
            <h2 className="nx-h2" id="nx-builds-h">{voiced(COPY.proof.builds.title, theme)}</h2>
            <p className="nx-lede">{voiced(COPY.proof.builds.lede, theme)}</p>
          </div>
        </div>

        {showFilters && (
          <div className="nx-builds-filters" role="group" aria-label={voiced(COPY.proof.builds.filterLabel, theme)}>
            {filters.map((item) => {
              const count = filterClients(item).length;
              return (
                <button
                  type="button"
                  className={`nx-builds-chip${activeFilter === item ? ' is-active' : ''}`}
                  aria-pressed={activeFilter === item}
                  onClick={() => setActiveFilter(item)}
                  key={item}
                >
                  <span>{item === 'all' ? voiced(COPY.proof.builds.filterAll, theme) : divisionLabel(item, theme)}</span>
                  <span className="nx-builds-chip-count">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {clients.length === 0 || !selected ? (
          <p className="nx-lede">{voiced(COPY.proof.builds.empty, theme)}</p>
        ) : (
          <>
            <div className="nx-builds-cases" role="tablist" aria-label={voiced(COPY.proof.builds.casesLabel, theme)}>
              {clients.map((client) => {
                const active = client.url === selected.url;
                return (
                  <button
                    type="button"
                    role="tab"
                    className={`nx-builds-case-tab${active ? ' is-active' : ''}`}
                    aria-selected={active}
                    aria-controls="nx-builds-case-panel"
                    id={`nx-builds-tab-${client.url}`}
                    key={client.url}
                    onClick={() => setSelectedUrl(client.url)}
                  >
                    <span className="nx-builds-case-tab-logo">
                      <img src={client.logo} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span className="nx-builds-case-tab-copy">
                      <span className="nx-builds-case-tab-name">{client.name}</span>
                      <span className="nx-builds-case-tab-meta">{client.sector}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div id="nx-builds-case-panel" role="tabpanel" aria-labelledby={`nx-builds-tab-${selected.url}`}>
              <CaseView key={selected.url} client={selected} theme={theme} />
            </div>
          </>
        )}

        {!divisionId && <ClientBench theme={theme} />}
      </div>
    </section>
  );
}

export function Standards({ theme }: { theme: Theme }) {
  return (
    <section className="nx-section" aria-labelledby="nx-std-h">
      <div className="nx-inner">
        <p className="nx-kicker">{voiced(HOME_STANDARDS.kicker, theme)}</p>
        <h2 className="nx-h2" id="nx-std-h">{voiced(HOME_STANDARDS.title, theme)}</h2>
        <div className="nx-tiles four">
          {OPERATING_STANDARD.map((item, i) => (
            <div className="nx-tile" key={item.title}>
              <span className="idx">0{i + 1}</span>
              <h3>{item.title}</h3>
              <p>{voiced(item.body, theme)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeCta({ theme }: { theme: Theme }) {
  const { phone } = DATA.contact;
  return (
    <section className="nx-final-cta" aria-label={voiced(COPY.home.cta.title, theme)}>
      <p className="nx-kicker">{voiced(COPY.home.cta.kicker, theme)}</p>
      <h2 className="nx-final-title">
        <Link prefetch={false} href={routePath(theme, 'contact')}>
          {voiced(COPY.home.cta.title, theme)}
        </Link>
      </h2>
      <p className="nx-final-lede">{voiced(COPY.home.cta.body, theme)}</p>
      <div className="nx-final-actions">
        <a className="nx-final-secondary" href={phone.href}>
          {theme === 'neo' ? 'Call' : 'Telephone'} {phone.display}
        </a>
        <Link prefetch={false} className="nx-btn nx-final-primary" href={routePath(theme, 'contact')}>
          {voiced(COPY.home.cta.primary, theme)} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
