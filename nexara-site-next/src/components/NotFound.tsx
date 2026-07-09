'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DATA } from '@/lib/data';
import { voice } from '@/lib/shared';

export function NotFound({ theme, page }: { theme: 'trust' | 'neo' | null; page?: string }) {
  const router = useRouter();
  const routeTo = (theme: string | null, page = "home", detail: string | null = null) => {
    if (theme === "neo" || theme === "trust") {
      localStorage.setItem("nexara_theme", theme);
    }
    let path = "/";
    if (theme) {
      if (page === "gateway") {
        path = "/";
      } else {
        path = "/" + [theme, page, detail].filter(Boolean).join("/");
      }
    }
    window.scrollTo(0, 0);
    const navigate = () => router.push(path);
    if (document.startViewTransition) {
      document.startViewTransition(navigate);
    } else {
      navigate();
    }
  };
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
