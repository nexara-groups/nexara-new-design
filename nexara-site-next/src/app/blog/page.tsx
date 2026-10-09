import Link from 'next/link';
import type { Metadata } from 'next';
import { BlogShell } from '@/components/BlogShell';
import { BlogSchema } from '@/components/BlogSchema';
import { BLOG_DESCRIPTION, BLOG_POSTS, formatPostDate } from '@/lib/blog';
import { blogIndexMetadata } from '@/lib/metadata';
import { getBlogIndexStructuredData } from '@/lib/seo';

export const metadata: Metadata = blogIndexMetadata();

export default function BlogIndex() {
  return (
    <>
      <BlogSchema data={getBlogIndexStructuredData()} />
      <BlogShell>
        <main className="nx-blog">
          <header className="nx-blog-head">
            <p className="eyebrow">Blog</p>
            <h1>Notes from the build.</h1>
            <p className="nx-blog-lede">{BLOG_DESCRIPTION}</p>
          </header>
          <ul className="nx-blog-grid">
            {[...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date)).map((post) => (
              <li key={post.slug}>
                <article className="nx-post-card">
                  <p className="nx-post-meta"><time dateTime={post.date}>{formatPostDate(post.date)}</time><span aria-hidden="true">·</span><span>{post.readMins} min read</span></p>
                  <h2><Link prefetch={false} href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                  <p>{post.description}</p>
                  <p className="nx-post-tags">{post.tags.map((t) => <span key={t}>{t}</span>)}</p>
                  <span className="nx-post-more" aria-hidden="true">Read it <span className="arr">→</span></span>
                </article>
              </li>
            ))}
          </ul>
        </main>
      </BlogShell>
    </>
  );
}
