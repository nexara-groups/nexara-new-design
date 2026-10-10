import React from 'react';
import Link from 'next/link';
import { DATA } from '@/lib/data';
import { COPY } from '@/lib/copy';
import { ABOUT_FLOW, voiced, type AboutBlock, type Theme } from '@/lib/site';
import { routePath } from '@/lib/seo';
import { Inline, resolveHref } from '../BlogContent';
import { PageHeader } from './PageHeader';
import { FaqBand } from './FaqBand';
import { LOCAL_FAQS } from '@/lib/seo';

const { about, founders } = DATA.company;
const { legal, address } = DATA.contact;
const incorporated = new Date(legal.incorporated + 'T00:00:00Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const initials = (name: string) => name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section className="nx-section" aria-labelledby={id}>
      <div className="nx-inner">
        <p className="nx-kicker">{kicker}</p>
        <h2 className="nx-h2" id={id}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

// One renderer per block, shared by both themes. The theme only picks the words and the CSS tokens.
const BLOCKS: Record<AboutBlock, (theme: Theme) => React.ReactNode> = {
  hero: (theme) => {
    const hero = about.hero[theme];
    return <PageHeader kicker={voiced({ neo: 'About Nexara', trust: 'About Nexara' }, theme)} title={hero.title} accent={hero.accent} body={hero.body} />;
  },
  story: (theme) => (
    <Section id="nx-story-h" kicker={voiced(COPY.about.story.kicker, theme)} title={about.story[theme].title}>
      <div className="nx-story">{about.story[theme].paragraphs.map((p) => <p key={p}><Inline text={p} theme={theme} /></p>)}</div>
    </Section>
  ),
  how: (theme) => (
    <Section id="nx-how-h" kicker={voiced(COPY.about.how.kicker, theme)} title={voiced(COPY.about.how.title, theme)}>
      <div className="nx-steps">
        {about.steps[theme].map((step, i) => (
          <div className="nx-tile" key={step.title}>
            <span className="idx">/0{i + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        ))}
      </div>
      <div className="nx-example">
        <span className="nx-kicker">{about.example[theme].label}</span>
        <h3>{about.example[theme].title}</h3>
        <p>{about.example[theme].body}</p>
        <p className="links">{about.example.links.map((l) => <Link prefetch={false} key={l.href} href={resolveHref(l.href, theme)}>{voiced(l.label, theme)}</Link>)}</p>
      </div>
    </Section>
  ),
  milestones: (theme) => (
    <Section id="nx-mile-h" kicker={voiced(COPY.about.milestones.kicker, theme)} title={voiced(COPY.about.milestones.title, theme)}>
      <ol className="nx-milestones">
        {about.milestones.map((m) => (
          <li key={(m.name || '') + (m.before || '')}>
            {m.when && <time>{m.when}</time>}
            <strong>{m.before}{m.name && <Link prefetch={false} href={routePath(theme, 'customers')}>{m.name}</Link>}{m.after}</strong>
            <p>{m.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  ),
  people: (theme) => !founders.length ? null : (
    <Section id="nx-people-h" kicker={voiced(COPY.about.people.kicker, theme)} title={voiced(COPY.about.people.title, theme)}>
      <ul className="nx-people">
        {founders.map((f) => (
          <li className="nx-person" key={f.name}>
            <span className="nx-avatar" aria-hidden={f.photo ? undefined : true}>
              {f.photo ? <img src={f.photo} alt={`${f.name}, ${f.role}`} loading="lazy" decoding="async" /> : initials(f.name)}
            </span>
            <h3>{f.name}</h3>
            <span className="role">{f.role}</span>
            {f.bio && <p>{f.bio}</p>}
            {f.linkedin && <a href={f.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
          </li>
        ))}
      </ul>
    </Section>
  ),
  facts: (theme) => {
    const l = COPY.about.legal;
    return (
      <Section id="nx-facts-h" kicker={voiced(COPY.about.facts.kicker, theme)} title={voiced(COPY.about.facts.title, theme)}>
        <dl className="nx-facts">
          {DATA.company[theme].facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
        <dl className="nx-legal">
          <div><dt>{voiced(l.name, theme)}</dt><dd>{legal.name}</dd></div>
          <div><dt>{voiced(l.website, theme)}</dt><dd>{legal.domain}</dd></div>
          <div><dt>{voiced(l.incorporated, theme)}</dt><dd>{incorporated}</dd></div>
          <div><dt>{voiced(l.cin, theme)}</dt><dd>{legal.cin}</dd></div>
          <div><dt>{voiced(l.gstin, theme)}</dt><dd>{legal.gstin}</dd></div>
          <div className="wide"><dt>{voiced(l.address, theme)}</dt><dd>{address.street}, {address.city}</dd></div>
        </dl>
      </Section>
    );
  },
  principles: (theme) => (
    <Section id="nx-prin-h" kicker={voiced(COPY.about.principles.kicker, theme)} title={voiced(COPY.about.principles.title, theme)}>
      <div className="nx-tiles">
        {DATA.company[theme].principles.map((p, i) => (
          <div className="nx-tile" key={p.title}><span className="idx">/0{i + 1}</span><h3>{p.title}</h3><p>{p.body}</p></div>
        ))}
      </div>
    </Section>
  ),
  standards: (theme) => (
    <Section id="nx-std-h" kicker={voiced(COPY.about.standards.kicker, theme)} title={voiced(COPY.about.standards.title, theme)}>
      <div className="nx-tiles two">
        {DATA.company[theme].standards.map((s, i) => (
          <div className="nx-tile" key={s.title}><span className="idx">/0{i + 1}</span><h3>{s.title}</h3><p>{s.body}</p></div>
        ))}
      </div>
    </Section>
  ),
  faqs: (theme) => <FaqBand theme={theme} copy={COPY.about.faqs} faqs={LOCAL_FAQS.company || []} />,
  cta: (theme) => <CtaBand theme={theme} copy={COPY.about.cta} secondary={{ page: 'blog', label: COPY.about.cta.secondary }} />,
};

export function CtaBand({ theme, copy, secondary, extra }: {
  theme: Theme;
  copy: { kicker: { neo: string; trust: string }; title: { neo: string; trust: string }; body: { neo: string; trust: string }; primary: { neo: string; trust: string } };
  secondary?: { page: string; label: { neo: string; trust: string } };
  extra?: React.ReactNode;
}) {
  return (
    <section className="nx-section" aria-label={voiced(copy.title, theme)}>
      <div className="nx-inner nx-band">
        <div>
          <p className="nx-kicker">{voiced(copy.kicker, theme)}</p>
          <h2 className="nx-h2">{voiced(copy.title, theme)}</h2>
          <p>{voiced(copy.body, theme)}</p>
        </div>
        <div className="actions">
          {extra}
          {secondary && <Link prefetch={false} className="nx-text-link" href={routePath(theme, secondary.page)}>{voiced(secondary.label, theme)}</Link>}
          <Link prefetch={false} className="nx-btn" href={routePath(theme, 'contact')}>{voiced(copy.primary, theme)} <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}

export function About({ theme }: { theme: Theme }) {
  return <main className="nx-page">{ABOUT_FLOW.map((block) => <React.Fragment key={block}>{BLOCKS[block](theme)}</React.Fragment>)}</main>;
}
