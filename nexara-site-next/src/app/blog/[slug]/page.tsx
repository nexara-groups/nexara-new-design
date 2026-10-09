import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogShell } from '@/components/BlogShell';
import { BlogSchema } from '@/components/BlogSchema';
import { Blocks } from '@/components/BlogContent';
import { BLOG_POSTS, formatPostDate, getPost } from '@/lib/blog';
import { blogPostMetadata } from '@/lib/metadata';
import { getBlogPostStructuredData } from '@/lib/seo';

export const dynamicParams = false;
export function generateStaticParams() { return BLOG_POSTS.map(post => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  return post ? blogPostMetadata(post) : { robots: 'noindex, follow' };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const more = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 2);
  return (
    <>
      <BlogSchema data={getBlogPostStructuredData(post)} />
      <BlogShell>
        <main className="nx-blog">
          <article className="nx-article">
            <nav className="nx-crumbs" aria-label="Breadcrumb"><Link prefetch={false} href="/">Nexara</Link><span aria-hidden="true">/</span><Link prefetch={false} href="/blog">Blog</Link></nav>
            <header className="nx-article-head">
              <p className="nx-post-tags">{post.tags.map((t) => <span key={t}>{t}</span>)}</p>
              <h1>{post.title}</h1>
              <p className="nx-post-meta">By {post.author}<span aria-hidden="true">·</span><time dateTime={post.date}>{formatPostDate(post.date)}</time><span aria-hidden="true">·</span><span>{post.readMins} min read</span></p>
            </header>
            <div className="nx-prose"><Blocks body={post.body} /></div>
          </article>
          <aside className="nx-more" aria-label="More from the blog">
            <p className="eyebrow">Keep reading</p>
            <ul className="nx-blog-grid">
              {more.map((p) => (
                <li key={p.slug}>
                  <article className="nx-post-card">
                    <p className="nx-post-meta"><time dateTime={p.date}>{formatPostDate(p.date)}</time><span aria-hidden="true">·</span><span>{p.readMins} min read</span></p>
                    <h2><Link prefetch={false} href={`/blog/${p.slug}`}>{p.title}</Link></h2>
                    <p>{p.description}</p>
                  </article>
                </li>
              ))}
            </ul>
            <p className="nx-more-links"><Link prefetch={false} href="/blog">All posts</Link><Link prefetch={false} href="/neo/contact">Start a project ↗</Link></p>
          </aside>
        </main>
      </BlogShell>
    </>
  );
}
