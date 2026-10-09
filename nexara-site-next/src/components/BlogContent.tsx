import React from 'react';
import Link from 'next/link';
import type { Block } from '@/lib/blog';

// Tiny inline renderer: [label](/path) becomes a link; everything else is plain text.
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return <>{parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!m) return <React.Fragment key={i}>{part}</React.Fragment>;
    const href = m[2]!;
    return href.startsWith('/') ? <Link key={i} prefetch={false} href={href}>{m[1]}</Link> : <a key={i} href={href} target="_blank" rel="noopener noreferrer">{m[1]}</a>;
  })}</>;
}

export function Blocks({ body }: { body: Block[] }) {
  return <>{body.map((b, i) => {
    if (b.type === 'h2') return <h2 key={i}>{b.text}</h2>;
    if (b.type === 'ul') return <ul key={i}>{b.items.map((item, j) => <li key={j}><Inline text={item} /></li>)}</ul>;
    if (b.type === 'quote') return <blockquote key={i}><p>{b.text}</p></blockquote>;
    return <p key={i}><Inline text={b.text} /></p>;
  })}</>;
}
