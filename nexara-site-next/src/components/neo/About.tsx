'use client';
import React from 'react';
import Link from 'next/link';
import { DATA } from '@/lib/data';
import { HeroBanner } from './SectionShell';

const { about, facts, principles, standards } = DATA.company.neo;
const { founders } = DATA.company;
const { legal, address } = DATA.contact;
const incorporated = new Date(legal.incorporated + 'T00:00:00Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const initials = (name: string) => name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
const L = ({ href, children }: { href: string; children: React.ReactNode }) => <Link prefetch={false} href={href}>{children}</Link>;

function Founders() {
  if (!founders.length) return null;
  return (
    <section className="nx-about" aria-labelledby="nx-people-h">
      <div className="nx-about-inner">
        <p className="kicker">Directors</p>
        <h2 className="nx-h2" id="nx-people-h">The people behind Nexara.</h2>
        <ul className="nx-people" style={{ listStyle: 'none', padding: 0 }}>
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
      </div>
    </section>
  );
}

export function NeoAbout() {
  return (
    <main>
      <HeroBanner compact theme="neo" eyebrow="About Nexara" title={about.hero.title} accent={about.hero.accent} body={about.hero.body} />

      <section className="nx-about" aria-labelledby="nx-story-h">
        <div className="nx-about-inner">
          <p className="kicker">Our story</p>
          <h2 className="nx-h2" id="nx-story-h">Started in May 2026. Already shipping.</h2>
          <div className="nx-story">
            <p>Nexara Private Limited was incorporated on 31 May 2026 in Visakhapatnam. We run three teams. Academy trains people, Digital Marketing builds websites and demand, and Labs builds software.</p>
            <p>Our first client was <L href="/neo/customers">Sai Nirmaan Architects</L>, an architecture practice in Vizag. We built their portfolio website and run their digital marketing. Happy Farms, Rise Medical Hub, Qualigene and Sri Engineering Works have followed, and every one of them is a live site you can open.</p>
          </div>
        </div>
      </section>

      <section className="nx-about" aria-labelledby="nx-how-h">
        <div className="nx-about-inner">
          <p className="kicker">How we work</p>
          <h2 className="nx-h2" id="nx-how-h">Three steps, in this order.</h2>
          <div className="neo-standards-grid nx-three" style={{ marginTop: 28 }}>
            {about.steps.map((step, i) => (
              <div className="neo-standard-card" key={step.title}>
                <span className="neo-std-rule" aria-hidden="true" />
                <span className="neo-std-idx">/0{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
          <div className="nx-example">
            <span className="neo-std-idx" style={{ margin: 0 }}>{about.example.label}</span>
            <h3>{about.example.title}</h3>
            <p>{about.example.body}</p>
            <p className="nx-about-links"><L href="/blog/prototype-before-you-build">Read how we built it</L><L href="/neo/customers">See the client work</L></p>
          </div>
        </div>
      </section>

      <section className="nx-about" aria-labelledby="nx-mile-h">
        <div className="nx-about-inner">
          <p className="kicker">Milestones</p>
          <h2 className="nx-h2" id="nx-mile-h">So far.</h2>
          <ol className="nx-milestones">
            {about.milestones.map((m) => (
              <li key={(m.name || '') + (m.before || '')}>
                {m.when && <time>{m.when}</time>}
                <strong>{m.before}{m.name && <L href="/neo/customers">{m.name}</L>}{m.after}</strong>
                <p>{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Founders />

      <section className="nx-about" aria-labelledby="nx-facts-h">
        <div className="nx-about-inner">
          <p className="kicker">Company facts</p>
          <h2 className="nx-h2" id="nx-facts-h">The paperwork, in the open.</h2>
          <div className="fact-strip">
            {facts.map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>
          <dl className="nx-legal">
            <div><dt>Legal name</dt><dd>{legal.name}</dd></div>
            <div><dt>Website</dt><dd>{legal.domain}</dd></div>
            <div><dt>Incorporated</dt><dd>{incorporated}</dd></div>
            <div><dt>CIN</dt><dd>{legal.cin}</dd></div>
            <div><dt>GSTIN</dt><dd>{legal.gstin}</dd></div>
            <div className="wide"><dt>Registered address</dt><dd>{address.street}, {address.city}</dd></div>
          </dl>
        </div>
      </section>

      <section className="module-grid compact">
        {principles.map((principle) => (
          <article className="module-card" key={principle.title}>
            <span>Principle</span>
            <h3>{principle.title}</h3>
            <p>{principle.body}</p>
          </article>
        ))}
      </section>
      <section className="content-band">
        <div className="section-head">
          <div>
            <p className="eyebrow">Operating standards</p>
            <h2>The standards that keep the site honest.</h2>
          </div>
        </div>
        <div className="module-grid compact">
          {standards.map((item) => (
            <article className="module-card" key={item.title}>
              <span>Standard</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="intake-cta">
        <div>
          <p className="eyebrow">Next move</p>
          <h2>Got something to build?</h2>
          <p>Tell us about the business first. The rest follows.</p>
        </div>
        <div className="nx-about-cta-actions">
          <Link prefetch={false} className="nx-cta-link" href="/blog">Read the Nexara blog</Link>
          <Link prefetch={false} className="nx-cta-btn" href="/neo/contact">Start a project</Link>
        </div>
      </section>
    </main>
  );
}
