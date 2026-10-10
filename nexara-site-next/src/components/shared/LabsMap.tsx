'use client';
import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DATA } from '@/lib/data';
import { COPY } from '@/lib/copy';
import { CLIENTS } from '@/lib/clients';
import { voiced, type Theme } from '@/lib/site';
import { ClientCard } from './ClientCard';

// Other code (MarketingLabs funnel) relies on window.gsap being set.
if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof window !== 'undefined') Object.assign(window, { gsap, ScrollTrigger });

// Every Labs block reads the one Labs record, so the mappings (problem -> package, layer -> module ->
// deliverable, stage -> output, client -> layer) cannot drift between Neo and Trust.
const LABS = DATA.sections.labs;
type LayerId = (typeof LABS.layers)[number]['id'];

const layerLabel = (id: string) => LABS.layers.find((l) => l.id === id)?.label ?? id;
const stackOf = (title: string) => LABS.stackDetails.find((d) => d.title === title);
const moduleOf = (id: string) => LABS.modules.find((m) => m.id === id);

// Round-robin through the details so a layer with two stack items shows both.
function pickDeliverables(layer: string, max = 4): string[] {
  const lists = LABS.stackDetails.filter((d) => d.layer === layer).map((d) => d.deliverables);
  const out: string[] = [];
  for (let i = 0; out.length < max && i < 4; i++) {
    for (const list of lists) if (list[i] && out.length < max) out.push(list[i]!);
  }
  return out;
}

function Chips({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <span className="nx-labs-chips">
      {label && <b>{label}</b>}
      {children}
    </span>
  );
}

export function labsAnchor(kind: 'proof' | 'product', id: string) {
  const slug = id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `labs-${kind}-${slug}`;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── 1. Problems: who | pain | start with ─────────────────────────── */
export function LabsProblemTable({ theme }: { theme: Theme }) {
  const c = COPY.labs.problems;
  return (
    <div className="nx-labs-table" role="table">
      <div className="nx-labs-row is-head" role="row">
        <span role="columnheader">{voiced(c.who, theme)}</span>
        <span role="columnheader">{voiced(c.pain, theme)}</span>
        <span role="columnheader">{voiced(c.start, theme)}</span>
      </div>
      {LABS.audiences.map((a) => (
        <div className="nx-labs-row" role="row" key={a.id}>
          <span className="nx-labs-who" role="cell">{a.title}</span>
          <span className="nx-labs-pain" role="cell">{voiced(a.pain, theme)}</span>
          <span role="cell">
            <a
              className="nx-labs-chip is-link"
              href="#labs-engage"
              onClick={(e) => { e.preventDefault(); scrollToId('labs-engage'); }}
            >
              {a.package} <span aria-hidden="true">→</span>
            </a>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── 2. Layer map: all four layers visible, no scroll pin ───────── */
export function LabsLayerMap({ theme }: { theme: Theme }) {
  const c = COPY.labs.map;

  return (
    <section className="nx-labs-build is-static" aria-label={voiced(c.title, theme)}>
      <div className="nx-labs-split">
        <div className="nx-labs-copy">
          <p className="nx-labs-kicker">{voiced(c.kicker, theme)}</p>
          <h2 className="nx-labs-title">{voiced(c.title, theme)}</h2>
          <div className="nx-labs-caps">
            {LABS.layers.map((layer, i) => {
              const mods = LABS.modules.filter((m) => (m.layers as readonly string[]).includes(layer.id));
              const ships = pickDeliverables(layer.id);
              const clients = LABS.proofMap.filter((p) => (p.layers as readonly string[]).includes(layer.id));
              return (
                <div className="nx-build-cap" data-layer={layer.id} key={layer.id}>
                  <h3><span className="nx-labs-n">{String(i + 1).padStart(2, '0')}</span> {layer.label}</h3>
                  <p className="nx-labs-line">{voiced(layer.line, theme)}</p>
                  {mods.length > 0 && <Chips label={voiced(c.modules, theme)}>{mods.map((m) => <span className="nx-labs-chip" key={m.id}>{m.title}</span>)}</Chips>}
                  {ships.length > 0 && <Chips label={voiced(c.ships, theme)}>{ships.map((d) => <span className="nx-labs-chip is-soft" key={d}>{d}</span>)}</Chips>}
                  {clients.length > 0 && <Chips label={voiced(c.clients, theme)}>{clients.map((p) => <span className="nx-labs-chip is-client" key={p.client}>{p.client}</span>)}</Chips>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="nx-labs-visual" aria-hidden="true">
          <svg viewBox="0 0 480 408" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke="rgba(240,240,236,0.06)" strokeWidth="1">
              <path d="M0 51h480M0 102h480M0 153h480M0 204h480M0 255h480M0 306h480M0 357h480" />
              <path d="M60 0v408M120 0v408M180 0v408M240 0v408M300 0v408M360 0v408M420 0v408" />
            </g>
            <g data-layer="data" strokeWidth="1.5">
              <path data-draw="" d="M120 300 L240 240 L360 300 L240 360 Z" />
              <path data-draw="" d="M120 300 V322 L240 382 L360 322 V300" />
              <path data-draw="" d="M240 360 V382" />
              <text data-fill="" x="378" y="318" fontFamily="JetBrains Mono" fontSize="10" opacity="0">DATA</text>
            </g>
            <g data-layer="services" strokeWidth="1.5">
              <path data-draw="" d="M140 230 L240 180 L340 230 L240 280 Z" />
              <path data-draw="" d="M140 230 V248 L240 298 L340 248 V230" />
              <path data-draw="" d="M240 280 V298" />
              <text data-fill="" x="358" y="244" fontFamily="JetBrains Mono" fontSize="10" opacity="0">SERVICES</text>
            </g>
            <g data-layer="interface" strokeWidth="1.5">
              <path data-draw="" d="M160 160 L240 120 L320 160 L240 200 Z" />
              <path data-draw="" d="M160 160 V176 L240 216 L320 176 V160" />
              <path data-draw="" d="M240 200 V216" />
              <text data-fill="" x="338" y="172" fontFamily="JetBrains Mono" fontSize="10" opacity="0">INTERFACE</text>
            </g>
            <g data-layer="live" strokeWidth="1.5">
              <path data-fill="" d="M240 36 V112" strokeDasharray="4 6" opacity="0" />
              <circle data-fill="" cx="240" cy="36" r="5" opacity="0" />
              <text data-fill="" x="252" y="44" fontFamily="JetBrains Mono" fontSize="10" opacity="0">LIVE</text>
            </g>
            <g className="nx-labs-brace" strokeWidth="1">
              <path data-draw="" d="M96 240 V382 M88 240 h16 M88 382 h16" />
              <text data-fill="" x="52" y="316" fontFamily="JetBrains Mono" fontSize="9" opacity="0">3 LAYERS</text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ── 3. Module meta: layers, deliverables, client, Open ──────────── */
export function LabsModuleMeta({ theme, moduleId, onOpen }: { theme: Theme; moduleId: string; onOpen: (slug: string) => void }) {
  const m = moduleOf(moduleId);
  if (!m) return null;
  const c = COPY.labs.modules;
  const ships = stackOf(m.stack)?.deliverables ?? [];
  const clients = LABS.proofMap.filter((p) => p.module === m.id);
  return (
    <span className="nx-labs-meta">
      <Chips label={voiced(c.layers, theme)}>
        {m.layers.map((id) => <span className="nx-labs-chip" data-layer={id} key={id}>{layerLabel(id)}</span>)}
      </Chips>
      <Chips label={voiced(c.ships, theme)}>
        {ships.map((d) => <span className="nx-labs-chip is-soft" key={d}>{d}</span>)}
      </Chips>
      {clients.length > 0 && (
        <Chips label={voiced(c.seen, theme)}>
          {clients.map((p) => <span className="nx-labs-chip is-client" key={p.client}>{p.client}</span>)}
        </Chips>
      )}
      <button type="button" className="nx-labs-open" onClick={() => onOpen(m.subpage)}>
        {voiced(c.open, theme)} <span aria-hidden="true">→</span>
      </button>
    </span>
  );
}

/* ── 4. Stages: pipeline + gate + outputs ────────────────────────── */
export function LabsPipeline({ nodes }: { nodes: { n: string; label: string }[] }) {
  return (
    <div className="neo-pipe" aria-hidden="true">
      <span className="neo-pipe-pulse"></span>
      {nodes.map(({ n, label }) => (
        <div className="neo-pipe-node" key={n}>
          <span className="neo-pipe-dot"></span>
          <span className="neo-pipe-num">{n}</span>
          <span className="neo-pipe-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

export const LABS_PIPE_NODES = LABS.process.map((p) => ({ n: p.step, label: p.label }));

export function LabsStages({ theme }: { theme: Theme }) {
  const c = COPY.labs.stages;
  return (
    <div className="nx-labs-stages">
      <LabsPipeline nodes={LABS_PIPE_NODES} />
      <ol className="nx-labs-stagelist">
        {LABS.process.map((p) => (
          <li key={p.step}>
            <span className="nx-labs-stagehead"><b>{p.step}</b> {p.label}</span>
            <span className="nx-labs-gate"><i aria-hidden="true">✓</i> {voiced(p.gate, theme)}</span>
            {p.outputs.length > 0 && (
              <Chips label={voiced(c.out, theme)}>
                {p.outputs.map((o) => <span className="nx-labs-chip is-soft" data-layer={stackOf(o)?.layer} key={o}>{o}</span>)}
              </Chips>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── 5. Proof: real clients, each tagged with layers and module ──── */
export function LabsProofMap({ theme }: { theme: Theme }) {
  return (
    <div className="nx-labs-proof">
      {LABS.proofMap.map((p, i) => {
        const client = CLIENTS.find((x) => x.name === p.client);
        if (!client) return null;
        return (
          <div className="nx-labs-proof-item" id={labsAnchor('proof', p.client)} key={p.client}>
            <ClientCard client={client} index={i} theme={theme} />
            <Chips>
              {p.layers.map((id) => <span className="nx-labs-chip" data-layer={id} key={id}>{layerLabel(id)}</span>)}
              <span className="nx-labs-chip is-soft">{moduleOf(p.module)?.title}</span>
            </Chips>
          </div>
        );
      })}
    </div>
  );
}

export type { LayerId };
