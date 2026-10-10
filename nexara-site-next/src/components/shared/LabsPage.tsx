'use client';
import React from 'react';
import Link from 'next/link';
import { DATA } from '@/lib/data';
import { COPY } from '@/lib/copy';
import { routePath, LOCAL_FAQS } from '@/lib/seo';
import { routeTo as neoRouteTo } from '@/lib/neo-router';
import { routeTo as trustRouteTo } from '@/lib/trust-router';
import {
  LABS_FINDER_SEGS,
  LABS_FLOW,
  labsTabBySlug,
  labsTabs,
  voiced,
  type LabsBlock,
  type LabsFinderSeg,
  type Theme,
} from '@/lib/site';
import { useSectionTabs } from '../useSectionTabs';
import { NotFound } from '../NotFound';
import { PackageGrid } from '../ui/package-card';
import { FaqBand } from './FaqBand';
import { PageFinder, scrollToSection } from './PageFinder';
import {
  LabsLayerMap,
  LabsModuleMeta,
  LabsPipeline,
  LabsProofMap,
  LabsStages,
  LABS_PIPE_NODES,
} from './LabsMap';
import { LabsProducts } from './LabsShowcase';

const LABS = DATA.sections.labs;

function goContact(theme: Theme) {
  (theme === 'neo' ? neoRouteTo : trustRouteTo)(theme, 'contact', 'labs');
}

function statusLabel(status: string, theme: Theme) {
  const c = COPY.labs.products;
  if (status === 'demo') return voiced(c.demo, theme);
  if (status === 'building') return voiced(c.building, theme);
  return voiced(c.live, theme);
}

function finderSegId(seg: LabsFinderSeg) {
  return `lab-${seg}`;
}

function finderSegLabel(seg: LabsFinderSeg, theme: Theme) {
  return voiced(COPY.labs.nav[seg], theme);
}

function LabsHero({ theme, onOpen }: { theme: Theme; onOpen: (slug: string | null) => void }) {
  const hero = LABS.hero[theme];
  const seeHow = (e: React.MouseEvent) => {
    e.preventDefault();
    const id = finderSegId('capabilities');
    if (document.getElementById(id)) scrollToSection(id);
    else onOpen(null);
  };
  return (
    <header className="nx-lab-hero" id="overview">
      <div className="nx-lab-wrap nx-lab-hero-grid">
        <div className="nx-lab-hero-copy">
          <p className="nx-lab-kicker">{hero.eyebrow}</p>
          <h1 className="nx-lab-title">{hero.title}</h1>
          <p className="nx-lab-accent">{hero.accent}</p>
          <p className="nx-lab-lede">{hero.body}</p>
          <div className="nx-lab-actions">
            <Link prefetch={false} className="nx-lab-cta" href={routePath(theme, 'contact', 'labs')}>
              {hero.primary}
            </Link>
            <a className="nx-lab-cta nx-lab-cta--ghost" href={`#${finderSegId('capabilities')}`} onClick={seeHow}>
              {hero.secondary}
            </a>
          </div>
        </div>
        <div className="nx-lab-hero-visual" aria-hidden="true">
          <LabsPipeline nodes={LABS_PIPE_NODES} />
        </div>
      </div>
    </header>
  );
}

function LabsOverview({ theme, onOpen }: { theme: Theme; onOpen: (slug: string | null) => void }) {
  const head = (block: Exclude<LabsBlock, 'map' | 'cta'>) => (
    <div className="nx-lab-head">
      <p className="nx-lab-kicker">{voiced(COPY.labs[block].kicker, theme)}</p>
      <h2 className="nx-lab-h2">{voiced(COPY.labs[block].title, theme)}</h2>
    </div>
  );

  const capAnchorFor = (subpage: string, moduleId: string) =>
    LABS.modules.find((m) => m.subpage === subpage)?.id === moduleId ? `lab-cap-${subpage}` : undefined;

  const BLOCKS: Record<LabsBlock, () => React.ReactNode> = {
    map: () => <LabsLayerMap theme={theme} id={finderSegId('capabilities')} />,
    modules: () => (
      <section className="nx-lab-band nx-lab-band--paper">
        <div className="nx-lab-wrap">
          {head('modules')}
          <div className="nx-lab-modules">
            {LABS.modules.map((m, i) => (
              <article
                className="nx-lab-module"
                data-track={m.layers[0]}
                id={capAnchorFor(m.subpage, m.id)}
                key={m.id}
              >
                <p className="nx-lab-kicker">0{i + 1}</p>
                <h3>{m.title}</h3>
                <p>{voiced(m.problem, theme)}</p>
                <LabsModuleMeta theme={theme} moduleId={m.id} onOpen={onOpen} />
              </article>
            ))}
          </div>
        </div>
      </section>
    ),
    stages: () => (
      <section className="nx-lab-band">
        <div className="nx-lab-wrap">{head('stages')}<LabsStages theme={theme} /></div>
      </section>
    ),
    proof: () => (
      <section className="nx-lab-band nx-lab-band--paper" id={finderSegId('proof')}>
        <div className="nx-lab-wrap">{head('proof')}<LabsProofMap theme={theme} /></div>
      </section>
    ),
    products: () => (
      <section className="nx-lab-band" id={finderSegId('products')}>
        <div className="nx-lab-wrap">{head('products')}<LabsProducts theme={theme} /></div>
      </section>
    ),
    engage: () => (
      <section className="nx-lab-band nx-lab-band--paper" id={finderSegId('engage')}>
        <div className="nx-lab-wrap">
          {head('engage')}
          <PackageGrid
            packages={LABS.packages}
            ctaLabel={voiced(COPY.labs.engage.cta, theme)}
            onSelect={() => goContact(theme)}
          />
        </div>
      </section>
    ),
    faqs: () => <FaqBand theme={theme} copy={COPY.labs.faqs} faqs={LABS.faqs as [string, string][]} id="nx-lab-faq" />,
    cta: () => (
      <section className="nx-lab-ask">
        <div className="nx-lab-wrap">
          <p className="nx-lab-kicker">{voiced(COPY.labs.cta.kicker, theme)}</p>
          <h2 className="nx-lab-h2">{LABS.intake.primary}</h2>
          <p className="nx-lab-lede">{LABS.intake.secondary}</p>
          <Link prefetch={false} className="nx-lab-cta nx-lab-cta--lg" href={routePath(theme, 'contact', 'labs')}>
            {voiced(COPY.labs.cta.cta, theme)}
          </Link>
        </div>
      </section>
    ),
  };

  return <>{LABS_FLOW.map((block) => <React.Fragment key={block}>{BLOCKS[block]()}</React.Fragment>)}</>;
}

function CapabilityDetail({ theme, slug }: { theme: Theme; slug: string }) {
  const page = LABS.subpages.find((p) => p.slug === slug);
  if (!page) return null;
  const localFaqs = (LOCAL_FAQS[`labs/${slug}`] || []) as [string, string][];
  const faqs = [...(LABS.faqs as [string, string][]), ...localFaqs];
  const seen = 'seenIn' in page && Array.isArray(page.seenIn) ? page.seenIn : [];
  const seenLabel = (link: { kind: string; id: string }) =>
    link.kind === 'product' ? LABS.products.find((p) => p.id === link.id)?.name ?? link.id : link.id;
  return (
    <div className="nx-lab-detail">
      <section className="nx-lab-band">
        <div className="nx-lab-wrap">
          <p className="nx-lab-kicker">{LABS.neoName} / {page.title}</p>
          <h1 className="nx-lab-h2">{voiced(page.callout, theme)}</h1>
          {seen.length > 0 && (
            <span className="nx-labs-chips nx-lab-seen">
              <b>{voiced(COPY.labs.products.seenIn, theme)}</b>
              {seen.map((link) =>
                link.kind === 'product' ? (
                  <Link
                    prefetch={false}
                    key={link.kind + link.id}
                    className="nx-labs-chip is-link"
                    href={routePath(theme, 'labs', link.id)}
                  >
                    {seenLabel(link)}
                  </Link>
                ) : (
                  <Link
                    prefetch={false}
                    key={link.kind + link.id}
                    className="nx-labs-chip is-link"
                    href={routePath(theme, 'customers', 'labs')}
                  >
                    {seenLabel(link)}
                  </Link>
                ),
              )}
            </span>
          )}
          <p className="nx-lab-kicker" style={{ marginTop: '2rem' }}>{voiced(COPY.labs.products.covers, theme)}</p>
          <div className="nx-lab-cards">
            {page.cards.map((card) => (
              <article className="nx-lab-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{voiced({ neo: card.neo, trust: card.trust }, theme)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="nx-lab-band">
        <div className="nx-lab-wrap">
          <div className="nx-lab-head">
            <p className="nx-lab-kicker">{voiced(COPY.labs.stages.kicker, theme)}</p>
            <h2 className="nx-lab-h2">{voiced(COPY.labs.stages.title, theme)}</h2>
          </div>
          <LabsStages theme={theme} />
        </div>
      </section>
      <FaqBand theme={theme} copy={COPY.labs.faqs} faqs={faqs} id={`nx-lab-faq-${slug}`} />
      <section className="nx-lab-ask">
        <div className="nx-lab-wrap">
          <h2 className="nx-lab-h2">{LABS.intake.primary}</h2>
          <p className="nx-lab-lede">{LABS.intake.secondary}</p>
          <Link prefetch={false} className="nx-lab-cta nx-lab-cta--lg" href={routePath(theme, 'contact', 'labs')}>
            {voiced(COPY.labs.cta.cta, theme)}
          </Link>
        </div>
      </section>
    </div>
  );
}

function ProductDetail({ theme, slug }: { theme: Theme; slug: string }) {
  const product = LABS.products.find((p) => p.id === slug);
  if (!product) return null;
  const c = COPY.labs.products;
  const layerLabel = (id: string) => LABS.layers.find((l) => l.id === id)?.label ?? id;
  const openLive = product.status === 'demo' ? voiced(c.openDemo, theme) : voiced(c.liveSite, theme);
  const askCta = product.status === 'building' ? voiced(c.detailCta, theme) : voiced(c.detailCtaLive, theme);
  return (
    <div className="nx-lab-detail">
      <section className="nx-lab-band">
        <div className="nx-lab-wrap nx-lab-product-layout">
          <div className="nx-lab-product-copy">
            <p className="nx-lab-kicker">{voiced(COPY.labs.nav.products, theme)}</p>
            <div className="nx-lab-product-hero">
              <h1 className="nx-lab-h2">{product.name}</h1>
              <span className="nx-labs-status" data-status={product.status}>{statusLabel(product.status, theme)}</span>
            </div>
            <p className="nx-lab-lede">{voiced(product.line, theme)}</p>
            {'pitch' in product && product.pitch ? (
              <p className="nx-lab-pitch">{voiced(product.pitch, theme)}</p>
            ) : null}
            <span className="nx-labs-chips">
              {product.layers.map((id) => (
                <span className="nx-labs-chip" data-layer={id} key={id}>{layerLabel(id)}</span>
              ))}
            </span>
            {'whoFor' in product && product.whoFor ? (
              <>
                <h3 className="nx-lab-h3">{voiced(c.whoFor, theme)}</h3>
                <p className="nx-lab-who">{voiced(product.whoFor, theme)}</p>
              </>
            ) : null}
            <h3 className="nx-lab-h3">{voiced(c.covers, theme)}</h3>
            <ul className="nx-lab-covers">
              {product.covers.map((item) => <li key={item}>{item}</li>)}
            </ul>
            {'proofNote' in product && product.proofNote ? (
              <p className="nx-lab-proof-note"><b>{voiced(c.proofNote, theme)}</b> {voiced(product.proofNote, theme)}</p>
            ) : null}
            {!product.url ? <p className="nx-lab-building-note">{voiced(c.buildingNote, theme)}</p> : null}
            <div className="nx-lab-actions">
              {product.url ? (
                <a className="nx-lab-cta" href={product.url} target="_blank" rel="noopener noreferrer">
                  {openLive} <span aria-hidden="true">↗</span>
                </a>
              ) : null}
              <Link prefetch={false} className={`nx-lab-cta${product.url ? ' nx-lab-cta--ghost' : ''}`} href={routePath(theme, 'contact', 'labs')}>
                {askCta}
              </Link>
            </div>
          </div>
          {'shot' in product && product.shot ? (
            <figure className="nx-lab-product-shot">
              <img src={product.shot} alt={`Screenshot of ${product.name}`} loading="eager" decoding="async" />
              <figcaption>{product.name}</figcaption>
            </figure>
          ) : (
            <aside className="nx-lab-product-shot is-empty" aria-hidden="true">
              <span className="nx-labs-status" data-status={product.status}>{statusLabel(product.status, theme)}</span>
              <strong>{product.name}</strong>
              <p>{voiced(c.placeholderShot, theme)}</p>
            </aside>
          )}
        </div>
      </section>
      {(LOCAL_FAQS[`labs/${slug}`] || []).length > 0 && (
        <FaqBand theme={theme} copy={COPY.labs.faqs} faqs={LOCAL_FAQS[`labs/${slug}`] as [string, string][]} id={`nx-lab-faq-${slug}`} />
      )}
      <section className="nx-lab-ask">
        <div className="nx-lab-wrap">
          <h2 className="nx-lab-h2">{LABS.intake.primary}</h2>
          <p className="nx-lab-lede">{LABS.intake.secondary}</p>
          <Link prefetch={false} className="nx-lab-cta nx-lab-cta--lg" href={routePath(theme, 'contact', 'labs')}>
            {voiced(COPY.labs.cta.cta, theme)}
          </Link>
        </div>
      </section>
    </div>
  );
}

export function LabsPage({ theme, detail = null }: { theme: Theme; detail?: string | null }) {
  const tabs = React.useMemo(() => labsTabs().map((t) => ({ slug: t.slug, title: t.title })), []);
  const section = React.useMemo(() => ({ id: 'labs', subpages: tabs }), [tabs]);
  const tab = labsTabBySlug(detail);
  const detailKnown = !detail || !!tab;
  const { active, selectTab } = useSectionTabs(theme, section, detailKnown ? detail ?? null : null);

  if (detail && !detailKnown) return <NotFound theme={theme} page={`labs/${detail}`} />;

  const kind = active ? labsTabBySlug(active.slug)?.kind : null;

  return (
    <main className="nx-lab">
      {!detail && <LabsHero theme={theme} onOpen={selectTab} />}
      <div key={active?.slug || 'overview'} className="nx-lab-panel" id="section-panel">
        {active && kind === 'capability' ? (
          <CapabilityDetail theme={theme} slug={active.slug} />
        ) : active && kind === 'product' ? (
          <ProductDetail theme={theme} slug={active.slug} />
        ) : (
          <LabsOverview theme={theme} onOpen={selectTab} />
        )}
      </div>
      {/* Overview only: the finder anchors do not exist on level-2 pages. */}
      {!active && (
        <PageFinder
          label={voiced(COPY.labs.nav.label, theme)}
          overview={voiced(COPY.labs.nav.overview, theme)}
          items={LABS_FINDER_SEGS.map((seg) => ({ id: finderSegId(seg), label: finderSegLabel(seg, theme) }))}
          cta={{ label: voiced(COPY.labs.nav.cta, theme), href: routePath(theme, 'contact', 'labs') }}
          end=".nx-lab-ask"
        />
      )}
    </main>
  );
}
