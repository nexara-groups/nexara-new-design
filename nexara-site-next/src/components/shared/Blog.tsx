import React from 'react';
import Link from 'next/link';
import { BLOG_POSTS, formatPostDate, type BlogPost } from '@/lib/blog';
import { COPY } from '@/lib/copy';
import { voiced, type Theme } from '@/lib/site';
import { routePath } from '@/lib/seo';
import { Blocks } from '../BlogContent';
import { PageFinder } from './PageFinder';
import { finderItems } from '@/lib/finder';

const postsByDate = () => [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
const TRACKS = ['presence', 'visibility', 'performance'] as const;

const Arrow = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
    <path d="M3 9h11M10 4.5L14.5 9 10 13.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function StartRow({ post, theme, track, as: H = 'h2' }: { post: BlogPost; theme: Theme; track: (typeof TRACKS)[number]; as?: 'h2' | 'h3' }) {
  return (
    <li data-track={track}>
      <Link prefetch={false} className="nx-bl-start" href={routePath(theme, 'blog', post.slug)}>
        <H>{post.title}</H>
        <p>{post.description}</p>
        <span className="nx-bl-go" aria-hidden="true"><Arrow /></span>
      </Link>
    </li>
  );
}

export function BlogIndexView({ theme }: { theme: Theme }) {
  const t = <T,>(value: { neo: T; trust: T }) => voiced(value, theme);
  return (
    <main className="nx-bl">
      <section className="nx-bl-hero" id="overview">
        <div className="nx-bl-wrap">
          <p className="nx-bl-kicker">{t(COPY.blog.kicker)}</p>
          <h1 className="nx-bl-h1">{t(COPY.blog.lines).map((line) => <span className="nx-bl-ln" key={line}><span>{line}</span></span>)}</h1>
          <p className="nx-bl-leave">{t(COPY.blog.lede)}</p>
        </div>
      </section>
      <div className="nx-bl-wrap nx-bl-block" id="posts">
        <ul className="nx-bl-starts">
          {postsByDate().map((post, i) => (
            <StartRow key={post.slug} post={post} theme={theme} track={TRACKS[i % TRACKS.length]!} />
          ))}
        </ul>
      </div>
      <PageFinder
        label={t(COPY.finder.blog.label)}
        overview={t(COPY.finder.overview)}
        items={finderItems('blog', theme)}
        cta={{ label: t(COPY.finder.blog.cta), href: routePath(theme, 'contact') }}
        end=""
      />
    </main>
  );
}

// Home block: the three latest posts, identical in both themes.
export function Insights({ theme }: { theme: Theme }) {
  return (
    <section className="nx-section nx-insights" id="insights" aria-labelledby="nx-insights-h">
      <div className="nx-inner">
        <div className="nx-head">
          <div>
            <p className="nx-kicker">{voiced(COPY.insights.kicker, theme)}</p>
            <h2 className="nx-h2" id="nx-insights-h">{voiced(COPY.insights.title, theme)}</h2>
          </div>
          <Link prefetch={false} className="nx-text-link" href={routePath(theme, 'blog')}>{voiced(COPY.insights.all, theme)} →</Link>
        </div>
        <ul className="nx-bl-starts" style={{ marginTop: 28 }}>
          {postsByDate().slice(0, 3).map((post, i) => (
            <StartRow key={post.slug} post={post} theme={theme} track={TRACKS[i % TRACKS.length]!} as="h3" />
          ))}
        </ul>
      </div>
    </section>
  );
}

export function BlogPostView({ post, theme }: { post: BlogPost; theme: Theme }) {
  const t = <T,>(value: { neo: T; trust: T }) => voiced(value, theme);
  const more = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  return (
    <main className="nx-bl">
      <article className="nx-bl-article" id="article">
        <header className="nx-bl-article-head">
          <p className="nx-bl-tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</p>
          <h1>{post.title}</h1>
          <p className="nx-bl-meta">
            {t(COPY.blog.by)} {post.author}
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readMins} {t(COPY.blog.min)}</span>
          </p>
        </header>
        <div className="nx-bl-prose"><Blocks body={post.body} theme={theme} /></div>
      </article>
      <section className="nx-bl-ask" id="ask">
        <div className="nx-bl-wrap">
          <div className="nx-bl-ask-card">
            <h2>{t(COPY.blog.ask.title)}</h2>
            <p>{t(COPY.blog.ask.body)}</p>
            <Link prefetch={false} className="nx-bl-cta nx-bl-cta--lg" href={routePath(theme, 'contact')}>
              {t(COPY.blog.ask.cta)} <Arrow />
            </Link>
          </div>
        </div>
      </section>
      {more.length > 0 && (
        <aside className="nx-bl-wrap nx-bl-block" id="more" aria-label={t(COPY.blog.more)}>
          <h2 className="nx-bl-sec-h">{t(COPY.blog.more)}</h2>
          <ul className="nx-bl-starts">
            {more.map((item, i) => (
              <StartRow key={item.slug} post={item} theme={theme} track={TRACKS[i % TRACKS.length]!} as="h3" />
            ))}
          </ul>
          <p className="nx-bl-more">
            <Link prefetch={false} className="nx-bl-text-link" href={routePath(theme, 'blog')}>{t(COPY.blog.all)}</Link>
          </p>
        </aside>
      )}
      <PageFinder
        label={t(COPY.finder.post.label)}
        overview={t(COPY.finder.overview)}
        items={finderItems('post', theme).filter((item) => item.id !== 'more' || more.length > 0)}
        cta={{ label: t(COPY.finder.post.cta), href: routePath(theme, 'contact') }}
        hero=".nx-bl-article-head"
        end=""
      />
    </main>
  );
}
