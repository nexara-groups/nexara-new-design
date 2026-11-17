import React from 'react';
import Link from 'next/link';
import { COPY } from '@/lib/copy';
import { getPost, RELATED_POSTS, type RelatedPage } from '@/lib/blog';
import { routePath } from '@/lib/seo';
import { voiced, type Theme } from '@/lib/site';

/** Quiet list of the articles written for a service page. Mapping lives in RELATED_POSTS; titles come from BLOG_POSTS. */
export function RelatedPosts({ theme, page, wrap }: { theme: Theme; page: RelatedPage; wrap: string }) {
  const posts = RELATED_POSTS[page].map((slug) => getPost(slug)).filter((p) => !!p);
  if (!posts.length) return null;
  return (
    <aside className={`nx-related ${wrap}`} aria-labelledby={`nx-related-${page}`}>
      <h2 className="nx-related-h" id={`nx-related-${page}`}>{voiced(COPY.related.title, theme)}</h2>
      <ul className="nx-related-list">
        {posts.map((post) => (
          <li key={post!.slug}><Link prefetch={false} href={routePath(theme, 'blog', post!.slug)}>{post!.title}</Link></li>
        ))}
      </ul>
    </aside>
  );
}
