import React from 'react';
import { voiced, type Theme } from '@/lib/site';

type FaqCopy = {
  kicker: { neo: string; trust: string };
  title: { neo: string; trust: string };
};

/** Visible FAQ accordion for real page content. Schema FAQPage is emitted separately from getStructuredData. */
export function FaqBand({
  theme,
  copy,
  faqs,
  id = 'nx-faq-h',
}: {
  theme: Theme;
  copy: FaqCopy;
  faqs: [string, string][];
  id?: string;
}) {
  if (!faqs.length) return null;
  return (
    <section className="nx-section nx-faq" aria-labelledby={id}>
      <div className="nx-inner">
        <p className="nx-kicker">{voiced(copy.kicker, theme)}</p>
        <h2 className="nx-h2" id={id}>{voiced(copy.title, theme)}</h2>
        <div className="nx-faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
