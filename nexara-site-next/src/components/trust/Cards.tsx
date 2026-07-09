'use client';
import React from 'react';
import { DATA } from '@/lib/data';
import { routeTo } from '@/lib/trust-router';
import { TrustCohortLadder, AcademyProcessTimeline } from './Academy';

type AcademySection = typeof DATA.sections.academy;
type AcademyPackage = AcademySection['packages'][number];
type UnboxCopy = typeof DATA.unbox.trust;
type UnboxFace = typeof DATA.unbox.faces[number];

interface ProcessStep {
  step: string;
  title: string;
  body: string;
}

// TrustBlueprint, TrustFunnel and TrustSignatureModule are all called with
// academy/marketing/labs section data interchangeably (see TrustSectionPage
// call sites) — real union type from DATA, not a hand-rolled subset, since
// TrustSignatureModule forwards the same value into AcademyProcessTimeline/
// TrustCohortLadder, which expect the full real shape.
type SignatureSection = (typeof DATA.sections)[keyof typeof DATA.sections];

interface ProofItem {
  name: string;
  org: string;
  result: { neo: string; trust: string };
}

interface DeliverableRow {
  title: string;
  outcome?: string;
  deliverables: string[];
}

interface ModuleRow {
  title: string;
  trust?: string;
  body?: string;
}

/* ─── Shared "run log" typed-out console block (used by TrustCohortLadder /
   AcademyProcessTimeline, both cross-group) ─── */
interface RunLogConfig {
  label: string;
  lines: Array<Array<string>>;
}

/* Run-log content (Neo terminal → light command ledger). [class,text] pairs per line:
   p=prompt(blueprint) k=command(ink) c=output(muted) s=success(vermilion) */
export const TRUST_RUNLOG: Record<string, RunLogConfig> = {
  academy: {
    label: 'RUN LOG · career.sh',
    lines: [
      ['p', 'nexara@academy:~$ ', 'k', 'init career --track=engineering'],
      ['c', '  resolving curriculum graph...'],
      ['c', '  [1/4] foundations        ', 's', '✓ systems · networks · git'],
      ['c', '  [2/4] core engineering   ', 's', '✓ apis · databases · cloud'],
      ['c', '  [3/4] specialisation     ', 's', '✓ ai/ml · security · devops'],
      ['c', '  [4/4] industry residency ', 's', '✓ 12-week placement sprint'],
      ['p', 'nexara@academy:~$ ', 'k', 'run graduate --mode=hired'],
      ['s', '  → portfolio shipped before the résumé. offer received.'],
      ['p', 'nexara@academy:~$ '],
    ],
  },
  labs: {
    label: 'RUN LOG · deploy.sh',
    lines: [
      ['p', 'nexara@labs:~$ ', 'k', 'deploy system --env=production'],
      ['c', '  building pipeline...'],
      ['c', '  [1/4] discovery          ', 's', '✓ workflow mapped · specs written'],
      ['c', '  [2/4] prototype          ', 's', '✓ evals green · guardrails set'],
      ['c', '  [3/4] hardening          ', 's', '✓ observability · access controls'],
      ['c', '  [4/4] handover           ', 's', '✓ docs · training · ownership'],
      ['p', 'nexara@labs:~$ ', 'k', 'status --uptime'],
      ['s', '  → live. measured, governed, owned.'],
      ['p', 'nexara@labs:~$ '],
    ],
  },
};

export function TrustRunLog({ config }: { config: RunLogConfig }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { lines, label } = config;
  const total = React.useMemo(
    () => lines.reduce((n, parts) => { let s = 0; for (let i = 1; i < parts.length; i += 2) s += (parts[i] || '').length; return n + s; }, 0),
    [lines]
  );
  const [typed, setTyped] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) { setTyped(total); return; }
    let timer = 0, started = false;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          obs.disconnect();
          timer = window.setInterval(() => {
            setTyped((t) => { if (t >= total) { window.clearInterval(timer); return t; } return t + 2; });
          }, 16);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => { obs.disconnect(); if (timer) window.clearInterval(timer); };
  }, [total]);

  // Pre-compute visible char count per line + find the active (caret) line.
  let consumed = 0;
  const perLine = lines.map((parts) => {
    const segs: React.ReactNode[] = [];
    let lineShown = 0;
    for (let i = 0; i < parts.length; i += 2) {
      const cls = parts[i]; const text = parts[i + 1] || '';
      const start = consumed; consumed += text.length;
      const shown = Math.max(0, Math.min(text.length, typed - start));
      lineShown += shown;
      if (shown > 0) segs.push(<span className={'tsx-rl-' + cls} key={i}>{text.slice(0, shown)}</span>);
    }
    return { segs, lineShown };
  });
  let caretLine = -1;
  for (let i = perLine.length - 1; i >= 0; i--) { if ((perLine[i]?.lineShown ?? 0) > 0) { caretLine = i; break; } }
  return (
    <div className="tsx-runlog tsx-fade" ref={ref} role="img" aria-label="Programme run log">
      <div className="tsx-runlog-bar"><span className="tsx-runlog-label">{label}</span></div>
      <div className="tsx-runlog-body">
        {perLine.map(({ segs }, li) => (
          <div className="tsx-rl-line" key={li}>{segs}{li === caretLine ? <span className="tsx-runlog-caret" /> : null}</div>
        ))}
      </div>
    </div>
  );
}

/* ─── Shared Blueprint-Ledger primitives (kill repeated text boxes) ─── */

export function TrustIntakeBand({ heading, sub, cta = 'Start a Project', onClick, spaced }: {
  heading: React.ReactNode;
  sub?: React.ReactNode;
  cta?: React.ReactNode;
  onClick?: () => void;
  spaced?: boolean;
}) {
  return (
    <div className={"tsx-intake-band tsx-intake-band--plate tsx-fade" + (spaced ? " tsx-intake-spaced" : "")}>
      <div className="tsx-intake-copy">
        <span className="tsx-intake-tick" aria-hidden="true" />
        <p className="tsx-intake-heading">{heading}</p>
        {sub && <p className="tsx-intake-sub">{sub}</p>}
      </div>
      {cta && <button className="tsx-btn-cta" onClick={onClick || (() => routeTo('trust', 'contact'))}>{cta}</button>}
    </div>
  );
}

export function TrustLedgerTable({ columns, rows, label }: {
  columns: string[];
  rows: React.ReactNode[][];
  label?: string;
}) {
  const tpl = '46px ' + columns.map((_, i) => (i === 0 ? '1.1fr' : '1.6fr')).join(' ');
  return (
    <div className="tsx-ledger" role="table" aria-label={label || 'Ledger'}>
      <div className="tsx-ledger-head" role="row" style={{ gridTemplateColumns: tpl }}>
        <span className="tsx-ledger-rownum" aria-hidden="true" />
        {columns.map((c) => <span className="tsx-ledger-h" role="columnheader" key={c}>{c}</span>)}
      </div>
      {rows.map((cells, i) => (
        <div className={`tsx-ledger-row tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`} role="row" key={i} style={{ gridTemplateColumns: tpl }}>
          <span className="tsx-ledger-rownum" aria-hidden="true">/{String(i + 1).padStart(2, '0')}</span>
          {cells.map((cell, j) => (
            <span className={"tsx-ledger-cell" + (j === 0 ? " tsx-ledger-lead" : "")} role="cell" key={j}>{cell}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function TrustLedgerRows({ items, titleKey = 'title', bodyKey = 'body', framed, numerals = true, label }: {
  items: Record<string, React.ReactNode>[];
  titleKey?: string;
  bodyKey?: string;
  framed?: boolean;
  numerals?: boolean;
  label?: string;
}) {
  const body = (
    <div className="tsx-ledger-rows" role="list">
      {items.map((it, i) => (
        <div className={`tsx-ledger-rowitem tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`} role="listitem" key={(it[titleKey] || i) + ''}>
          {numerals && <span className="tsx-ledger-rownum" aria-hidden="true">/{String(i + 1).padStart(2, '0')}</span>}
          <span className="tsx-ledger-rowtitle">{it[titleKey]}</span>
          <span className="tsx-ledger-rowdesc">{it[bodyKey]}</span>
        </div>
      ))}
    </div>
  );
  if (framed) return (
    <div className="tsx-ledger-plate">
      {label && <span className="tsx-ledger-plate-label">{label}</span>}
      {body}
    </div>
  );
  return body;
}

// Shared reveal-on-scroll hook used only by the components below (mirrors the
// local-helper pattern already used in Academy.tsx for section-scoped data).
function useTrustReveal(threshold = 0.3): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) { setShown(true); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setShown(true); obs.disconnect(); } });
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, shown];
}

export function TrustSignalLine() {
  const [ref, drawn] = useTrustReveal(0.3);
  return (
    <div className={"tsx-signal" + (drawn ? " is-drawn" : "")} ref={ref as React.RefObject<HTMLDivElement>}>
      <div className="tsx-dimline" data-label="Signal" aria-hidden="true" />
      <svg className="tsx-signal-svg" viewBox="0 0 1200 200" aria-hidden="true">
        <path className="tsx-signal-guide" d="M0,100 H1200" vectorEffect="non-scaling-stroke" />
        <path className="tsx-signal-guide tsx-signal-guide2" d="M0,150 H1200" vectorEffect="non-scaling-stroke" />
        <path className="tsx-signal-wave" vectorEffect="non-scaling-stroke"
          d="M0,100 C110,100 150,38 230,40 C320,42 360,168 470,150 C590,131 650,24 770,58 C880,89 960,156 1060,120 C1130,96 1170,92 1200,96" />
      </svg>
      <p className="tsx-signal-caption">Attention is a signal. <em>We tune it.</em></p>
    </div>
  );
}

export function TrustUnboxAssembly() {
  const copy: UnboxCopy = DATA.unbox.trust;
  const faces: UnboxFace[] = DATA.unbox.faces;
  const [ref, drawn] = useTrustReveal(0.25);
  return (
    <section className="tsx-unbox tsx-section-inner" ref={ref as React.RefObject<HTMLElement>} aria-label={copy.eyebrow}>
      <div className="tsx-signature-head tsx-fade">
        <p className="tsx-section-eyebrow">{copy.eyebrow}</p>
        <h2 className="tsx-section-heading">One operating core.<br /><span className="serif">Six capabilities.</span></h2>
      </div>
      <div className={"tsx-unbox-assembly" + (drawn ? " is-drawn" : "")}>
        <div className="tsx-unbox-core" aria-hidden="true">{copy.sequence}</div>
        <div className="tsx-unbox-stem" aria-hidden="true" />
        <div className="tsx-unbox-grid">
          {faces.map((f, i) => (
            <button className="tsx-unbox-face tsx-fade" style={{ transitionDelay: (i * 70) + 'ms' }} onClick={() => routeTo('trust', f.section)} key={f.label}>
              <span className="tsx-unbox-num" aria-hidden="true">/{String(i + 1).padStart(2, '0')}</span>
              <span className="tsx-unbox-label">{f.label}</span>
              <span className="tsx-unbox-sub">{f.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustCountUp({ value, className }: { value: string | number; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = parseInt(String(value).replace(/\D/g, ''), 10);
    const suffix = String(value).replace(/[0-9]/g, '');
    if (!target || !('IntersectionObserver' in window)) { el.textContent = String(value); return; }
    let done = false, tickId = 0;
    const run = () => {
      const t0 = performance.now(), dur = 1100;
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) tickId = requestAnimationFrame(tick);
      };
      tickId = requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting && !done) { done = true; run(); obs.disconnect(); } });
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(tickId); };
  }, [value]);
  return <span ref={ref} className={className}>{value}</span>;
}

export function TrustFaqAccordion({ faqs }: { faqs: [string, string][] }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  return (
    <div className="tsx-faq-acc">
      {faqs.map(([q, a], i) => {
        const isOpen = openIndex === i;
        return (
          <div className={`tsx-faq-item${isOpen ? ' open' : ''}`} key={i}>
            <button
              className="tsx-faq-trigger"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="tsx-faq-counter">{String(i + 1).padStart(2, '0')}</span>
              <span className="tsx-faq-q">{q}</span>
              <span className="tsx-faq-indicator" aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="tsx-faq-panel">
                <p className="tsx-faq-a">{a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function TrustProofCards({ items }: { items: ProofItem[] }) {
  return (
    <div className="tsx-proof-cards-grid">
      {items.map((p, i) => (
        <article className={`tsx-proof-case-card tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`} key={p.name}>
          <span className="tsx-proof-case-idx" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <div className="tsx-proof-case-content">
            <div className="tsx-proof-case-top">
              <span className="tsx-proof-case-org">{p.org}</span>
            </div>
            <p className="tsx-proof-case-headline">{p.name}</p>
            <div className="tsx-proof-case-divider" aria-hidden="true" />
            <div className="tsx-proof-case-outcome">
              <span className="tsx-proof-case-label">What held up</span>
              <p className="tsx-proof-case-body"><span className="tsx-proof-tick" aria-hidden="true" />{p.result.trust}</p>
            </div>
          </div>
          <div className="tsx-proof-case-foot">
            <span className="tsx-proof-case-verified" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 8.2l3 3L14 3"/></svg>
              Verified delivery
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

/* Legacy alias so any future callers still work */
export function TrustProofStrips({ items }: { items: ProofItem[] }) { return <TrustProofCards items={items} />; }

const PKG_THEMES = [
  { head: 'tsx-pkg-head-dark',  badge: null as string | null },
  { head: 'tsx-pkg-head-navy',  badge: 'Most Common' },
  { head: 'tsx-pkg-head-dark',  badge: null as string | null },
];

export function TrustPackageCards({ packages }: { packages: AcademyPackage[] }) {
  return (
    <div className="tsx-pkg-grid">
      {packages.map((pkg, i) => {
        const theme = PKG_THEMES[i] || PKG_THEMES[0]!;
        const featured = i === 1;
        return (
          <div className={`tsx-pkg-card${featured ? ' featured' : ''}`} key={pkg.name}>
            <div className={`tsx-pkg-head ${theme.head}`}>
              {theme.badge && <span className="tsx-pkg-badge">{theme.badge}</span>}
              <span className="tsx-pkg-fit">{pkg.fit}</span>
              <p className="tsx-pkg-name">{pkg.name}</p>
              <span className="tsx-pkg-duration">{pkg.duration}</span>
            </div>
            <div className="tsx-pkg-body">
              <ul className="tsx-pkg-list">
                {pkg.includes.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="tsx-pkg-foot">
              <button className={featured ? 'tsx-pkg-cta-primary' : 'tsx-pkg-cta-ghost'}
                onClick={() => routeTo('trust', 'contact')}>
                {featured ? 'Start here' : 'Get in touch'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TrustProcessTrack({ steps }: { steps: ProcessStep[] }) {
  return (
    <div className="tsx-process-track">
      {steps.map((step, i) => (
        <div className="tsx-process-track-step" key={step.step}>
          <span className="tsx-process-track-num">{step.step}</span>
          <p className="tsx-process-track-title">{step.title}</p>
          <p className="tsx-process-track-body">{step.body}</p>
          {i < steps.length - 1 && <div className="tsx-process-track-arrow" aria-hidden="true">→</div>}
        </div>
      ))}
    </div>
  );
}

/* Legacy alias */
export function TrustProcessTimeline({ steps }: { steps: ProcessStep[] }) { return <TrustProcessTrack steps={steps} />; }

// Local helper — used only by TrustDeliverableCards / TrustModuleCards below
// (mirrors the local-icon-map pattern already used in Academy.tsx).
const DELIVER_ICONS: Record<string, React.ReactNode> = {
  code:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 6l-4 4 4 4M13 6l4 4-4 4"/></svg>,
  data:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2.6l1.7 4.1 4.1 1.7-4.1 1.7L10 14l-1.7-3.9L4.2 8.4l4.1-1.7z"/><path d="M15.5 13.5l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z"/></svg>,
  design:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l1-3.4 7.6-7.6a1.8 1.8 0 012.5 2.5L7.4 15 4 16z"/><path d="M11.5 5.5l3 3"/></svg>,
  cloud:   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6.6 15.5a3.6 3.6 0 01-.4-7.18A4.6 4.6 0 0115.2 8.6a3.35 3.35 0 01-.2 6.9z"/></svg>,
  growth:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14l4-4 3 2 5.5-6.5"/><path d="M12.5 5.5H16V9"/></svg>,
  proof:   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2.4l5.6 2.2v4.3c0 3.5-2.4 5.8-5.6 6.7-3.2-.9-5.6-3.2-5.6-6.7V4.6z"/><path d="M7.4 9.7l1.8 1.8 3.5-3.9"/></svg>,
  web:     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="14" height="12" rx="1.6"/><path d="M3 8h14M6 6.1h.01M8 6.1h.01"/></svg>,
  doc:     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2.6h5L14.6 6.2V16.4a1 1 0 01-1 1H6a1 1 0 01-1-1V3.6a1 1 0 011-1z"/><path d="M11 2.6V6.4h3.6M7.5 11h5M7.5 13.6h3.5"/></svg>,
  layers:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2.8l7 3.5-7 3.5-7-3.5z"/><path d="M3.2 10.3L10 13.7l6.8-3.4M3.2 13.5L10 16.9l6.8-3.4"/></svg>,
  link:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 11a3 3 0 004.5.4l2.5-2.5a3 3 0 00-4.2-4.2l-1.3 1.3"/><path d="M12 9a3 3 0 00-4.5-.4L5 11.1a3 3 0 004.2 4.2l1.3-1.3"/></svg>,
};
function deliverIcon(title = ''): React.ReactNode {
  const t = title.toLowerCase();
  if (/engineer|full|stack|develop|\bbuild|software|architect/.test(t)) return DELIVER_ICONS.code;
  if (/data|\bai\b|model|rag|agent|machine|analy/.test(t))        return DELIVER_ICONS.data;
  if (/design|ux|ui|brand|visual|identity/.test(t))              return DELIVER_ICONS.design;
  if (/cloud|devops|deploy|host|observ|infra|\bops\b/.test(t))    return DELIVER_ICONS.cloud;
  if (/integration|systems|pipeline|connect|\bapi\b/.test(t))    return DELIVER_ICONS.link;
  if (/market|growth|\bads?\b|seo|social|content|performance|campaign/.test(t)) return DELIVER_ICONS.growth;
  if (/portfolio|review|eval|quality|interview|proof/.test(t))    return DELIVER_ICONS.proof;
  if (/web|site|b2b|platform|portal|dashboard|product/.test(t))   return DELIVER_ICONS.web;
  if (/document|\bdoc\b/.test(t))                                 return DELIVER_ICONS.doc;
  return DELIVER_ICONS.layers;
}

export function TrustDeliverableCards({ rows }: { rows: DeliverableRow[] }) {
  return (
    <div className="tsx-deliver-grid">
      {rows.map((row, i) => (
        <article className={`tsx-deliver-card tsx-deliver-card--indexed tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`} key={row.title}>
          <div className="tsx-deliver-meta">
            <span className="tsx-deliver-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            {row.outcome && <span className="tsx-deliver-badge">{row.outcome}</span>}
          </div>
          <div className="tsx-deliver-head">
            <span className="tsx-deliver-icon" aria-hidden="true">{deliverIcon(row.title)}</span>
            <h3 className="tsx-deliver-title">{row.title}</h3>
          </div>
          <hr className="tsx-deliver-rule" aria-hidden="true" />
          <div className="tsx-deliver-chips">
            {row.deliverables.map((d) => (
              <span className="tsx-deliver-chip" key={d}>
                <svg className="tsx-deliver-chk" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {d}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export function TrustDeliverableRows({ rows }: { rows: DeliverableRow[] }) { return <TrustDeliverableCards rows={rows} />; }

/* Capability / stack modules — shadcn feature card pattern. */
export function TrustModuleCards({ rows }: { rows: ModuleRow[] }) {
  return (
    <div className="tsx-module-grid">
      {rows.map((row, i) => (
        <div className={`tsx-module-card tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`} key={row.title}>
          <div className="tsx-module-card-head">
            <span className="tsx-module-icon" aria-hidden="true">{deliverIcon(row.title)}</span>
            <h3 className="tsx-module-title">{row.title}</h3>
          </div>
          <p className="tsx-module-body">{row.trust || row.body}</p>
        </div>
      ))}
    </div>
  );
}

export function TrustBlueprint({ section }: { section: SignatureSection }) {
  const mods = (section.modules || []).slice(0, 4);
  const [ref, drawn] = useTrustReveal(0.3);
  if (!mods.length) return null;
  return (
    <section className="tsx-signature tsx-blueprint-section" aria-label="System architecture">
      <div className="tsx-section-inner">
        <div className="tsx-signature-head tsx-fade">
          <span className="tsx-section-eyebrow">System architecture</span>
          <h2 className="tsx-section-heading">How a Product Studio build<br /><span className="serif">fits together.</span></h2>
          <p className="tsx-signature-sub">How discovery, build and controls connect into one system.</p>
        </div>
        <div className={"tsx-blueprint-grid" + (drawn ? " is-drawn" : "")} ref={ref as React.RefObject<HTMLDivElement>}>
          <span className="tsx-blueprint-bus" aria-hidden="true" />
          {mods.map((m, i) => (
            <div className="tsx-blueprint-node tsx-fade" style={{ transitionDelay: (i * 80) + 'ms' }} key={m.title}>
              <span className="tsx-blueprint-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{m.title}</h3>
              <p>{m.trust}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustFunnel({ section }: { section: SignatureSection }) {
  const mods = (section.modules || []).slice(0, 4);
  if (!mods.length) return null;
  return (
    <section className="tsx-signature tsx-funnel-section" aria-label="The growth funnel">
      <div className="tsx-section-inner">
        <div className="tsx-signature-head tsx-fade">
          <span className="tsx-section-eyebrow">The growth funnel</span>
          <h2 className="tsx-section-heading">Attention<br /><span className="serif">to outcome.</span></h2>
          <p className="tsx-signature-sub">How attention becomes a decision, stage by stage.</p>
        </div>
        <div className="tsx-funnel">
          {mods.map((m, i) => (
            <div className="tsx-funnel-stage tsx-fade" style={{ transitionDelay: (i * 90) + 'ms', '--w': (100 - i * 15) + '%' } as React.CSSProperties} key={m.title}>
              <div className="tsx-funnel-bar">
                <span className="tsx-funnel-step">{String(i + 1).padStart(2, '0')}</span>
                <span className="tsx-funnel-name">{m.title}</span>
              </div>
              <p className="tsx-funnel-desc">{m.trust}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustSignatureModule({ section }: { section: SignatureSection }) {
  if (section.id === 'academy') return <AcademyProcessTimeline section={section} />;
  if (section.id === 'labs') return (
    <TrustCohortLadder
      section={section}
      ariaLabel="How we build"
      eyebrow="How we build"
      title={<>From problem<br /><span className="serif">to shipped product.</span></>}
      sub="One path: frame the problem, design the system, build, then launch."
    />
  );
  if (section.id === 'marketing') return <TrustFunnel section={section} />;
  return null;
}
