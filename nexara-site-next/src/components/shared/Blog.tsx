import React from 'react';
import Link from 'next/link';
import { BLOG_POSTS, formatPostDate, type BlogPost } from '@/lib/blog';
import { COPY } from '@/lib/copy';
import { voiced, type Theme } from '@/lib/site';
import { routePath } from '@/lib/seo';
import { Blocks } from '../BlogContent';

const postsByDate = () => [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));

function PostCard({ post, theme, as: H = 'h2', showTags = true }: { post: BlogPost; theme: Theme; as?: 'h2' | 'h3'; showTags?: boolean }) {
  return (
    <article className="nx-post-card">
      <p className="nx-post-meta"><time dateTime={post.date}>{formatPostDate(post.date)}</time><span aria-hidden="true">·</span><span>{post.readMins} {voiced(COPY.blog.min, theme)}</span></p>
      <H><Link prefetch={false} href={routePath(theme, 'blog', post.slug)}>{post.title}</Link></H>
      <p>{post.description}</p>
      {showTags && <p className="nx-post-tags">{post.tags.map((t) => <span key={t}>{t}</span>)}</p>}
      <span className="nx-post-more" aria-hidden="true">{voiced(COPY.blog.read, theme)} <span className="arr">→</span></span>
    </article>
  );
}

export function BlogIndexView({ theme }: { theme: Theme }) {
  return (
    <main className="nx-blog">
      <header className="nx-blog-head">
        <p className="nx-kicker">{voiced(COPY.blog.kicker, theme)}</p>
        <h1>{voiced(COPY.blog.title, theme)}</h1>
        <p className="nx-blog-lede">{voiced(COPY.blog.lede, theme)}</p>
      </header>
      <ul className="nx-blog-grid">{postsByDate().map((post) => <li key={post.slug}><PostCard post={post} theme={theme} /></li>)}</ul>
    </main>
  );
}

export function BlogPostView({ post, theme }: { post: BlogPost; theme: Theme }) {
  const more = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);
  return (
    <main className="nx-blog">
      <article className="nx-article">
        <nav className="nx-crumbs" aria-label="Breadcrumb"><Link prefetch={false} href={routePath(theme, 'home')}>Nexara</Link><span aria-hidden="true">/</span><Link prefetch={false} href={routePath(theme, 'blog')}>{voiced(COPY.blog.kicker, theme)}</Link></nav>
        <header className="nx-article-head">
          <p className="nx-post-tags">{post.tags.map((t) => <span key={t}>{t}</span>)}</p>
          <h1>{post.title}</h1>
          <p className="nx-post-meta">{voiced(COPY.blog.by, theme)} {post.author}<span aria-hidden="true">·</span><time dateTime={post.date}>{formatPostDate(post.date)}</time><span aria-hidden="true">·</span><span>{post.readMins} {voiced(COPY.blog.min, theme)}</span></p>
        </header>
        <div className="nx-prose"><Blocks body={post.body} theme={theme} /></div>
      </article>
      <aside className="nx-more" aria-label={voiced(COPY.blog.more, theme)}>
        <p className="nx-kicker">{voiced(COPY.blog.more, theme)}</p>
        <ul className="nx-blog-grid">{more.map((p) => <li key={p.slug}><PostCard post={p} theme={theme} showTags={false} /></li>)}</ul>
        <p className="nx-more-links"><Link prefetch={false} href={routePath(theme, 'blog')}>{voiced(COPY.blog.all, theme)}</Link><Link prefetch={false} href={routePath(theme, 'contact')}>{voiced(COPY.blog.cta, theme)} ↗</Link></p>
      </aside>
    </main>
  );
}

// Home block: the three latest posts, identical in both themes.
export function Insights({ theme }: { theme: Theme }) {
  return (
    <section className="nx-section nx-insights" aria-labelledby="nx-insights-h">
      <div className="nx-inner">
        <div className="nx-head">
          <div>
            <p className="nx-kicker">{voiced(COPY.insights.kicker, theme)}</p>
            <h2 className="nx-h2" id="nx-insights-h">{voiced(COPY.insights.title, theme)}</h2>
          </div>
          <Link prefetch={false} className="nx-text-link" href={routePath(theme, 'blog')}>{voiced(COPY.insights.all, theme)} →</Link>
        </div>
        <ul className="nx-blog-grid three" style={{ marginTop: 28 }}>
          {postsByDate().slice(0, 3).map((post) => <li key={post.slug}><PostCard post={post} theme={theme} as="h3" showTags={false} /></li>)}
        </ul>
      </div>
    </section>
  );
}
