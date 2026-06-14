import React from 'react';
import { DATA } from './data.js';
import { routeTo, voice } from './shared.js';

export function NotFound({ theme, page }) {
  const sections = Object.values(DATA.sections);
  return (
    <main>
      <section className="detail-hero">
        <p className="eyebrow">Route check</p>
        <h2>{page ? `No page is configured for "${page}".` : "No page is configured for this route."}</h2>
      </section>
      <section className="module-grid compact">
        <article className="module-card">
          <span>Start</span>
          <h3>Home</h3>
          <p>Return to the Nexara gateway experience inside the selected presentation mode.</p>
          <button onClick={() => routeTo(theme)}>Open Home</button>
        </article>
        {sections.map((section) => (
          <article className="module-card" key={section.id}>
            <span>{section.index}</span>
            <h3>{section.name}</h3>
            <p>{voice(theme, section.short)}</p>
            <button onClick={() => routeTo(theme, section.id)}>Open {section.name}</button>
          </article>
        ))}
      </section>
    </main>
  );
}
