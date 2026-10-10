import React from 'react';
import Link from 'next/link';
import type { Block } from '@/lib/blog';
import type { Theme } from '@/lib/site';
import { routePath } from '@/lib/seo';

// Internal links are written theme-free and resolved per theme:
//   @customers       -> the active theme's Proof page
//   /neo/contact     -> /trust/contact when rendered in Trust
//   /blog/some-post  -> /trust/blog/some-post when rendered in Trust
export function resolveHref(href: string, theme: Theme = 'neo') {
  if (href.startsWith('@')) { const [page = 'home', detail] = href.slice(1).split('/'); return routePath(theme, page, detail ?? null); }
  const blog = href.match(/^\/blog(?:\/([^/]+))?$/);
  if (blog) return routePath(theme, 'blog', blog[1] ?? null);
  if (href.startsWith('/neo/')) return `/${theme}/${href.slice(5)}`;
  return href;
}

// Tiny inline renderer: [label](/path) becomes a link; everything else is plain text.
export function Inline({ text, theme = 'neo' }: { text: string; theme?: Theme }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return <>{parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!m) return <React.Fragment key={i}>{part}</React.Fragment>;
    const href = resolveHref(m[2]!, theme);
    return href.startsWith('/') ? <Link key={i} prefetch={false} href={href}>{m[1]}</Link> : <a key={i} href={href} target="_blank" rel="noopener noreferrer">{m[1]}</a>;
  })}</>;
}

export function Blocks({ body, theme = 'neo' }: { body: Block[]; theme?: Theme }) {
  return <>{body.map((b, i) => {
    if (b.type === 'h2') return <h2 key={i}>{b.text}</h2>;
    if (b.type === 'ul') return <ul key={i}>{b.items.map((item, j) => <li key={j}><Inline text={item} theme={theme} /></li>)}</ul>;
    if (b.type === 'quote') return <blockquote key={i}><p>{b.text}</p></blockquote>;
    return <p key={i}><Inline text={b.text} theme={theme} /></p>;
  })}</>;
}
