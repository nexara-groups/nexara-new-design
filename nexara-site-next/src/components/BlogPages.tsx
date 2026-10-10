import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BlogShell } from './BlogShell';
import { BlogSchema } from './BlogSchema';
import { BlogIndexView, BlogPostView } from './shared/Blog';
import { BLOG_POSTS, getPost } from '@/lib/blog';
import { blogIndexMetadata, blogPostMetadata } from '@/lib/metadata';
import { getBlogIndexStructuredData, getBlogPostStructuredData } from '@/lib/seo';
import type { Theme } from '@/lib/site';

// Neo serves /blog, Trust serves /trust/blog. Same posts, same metadata: Trust is an alternate view
// whose canonical URL is the Neo one (see getSeo), so search engines index each post once.
export const blogStaticParams = () => BLOG_POSTS.map((post) => ({ slug: post.slug }));
export const blogIndexMeta = (): Metadata => blogIndexMetadata();
export async function blogPostMeta(params: Promise<{ slug: string }>): Promise<Metadata> {
  const post = getPost((await params).slug);
  return post ? blogPostMetadata(post) : { robots: 'noindex, follow' };
}

export function BlogIndexPage({ theme }: { theme: Theme }) {
  return (
    <>
      <BlogSchema data={getBlogIndexStructuredData()} />
      <BlogShell theme={theme}><BlogIndexView theme={theme} /></BlogShell>
    </>
  );
}

export async function BlogPostPage({ theme, params }: { theme: Theme; params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return (
    <>
      <BlogSchema data={getBlogPostStructuredData(post)} />
      <BlogShell theme={theme} detail={post.slug}><BlogPostView post={post} theme={theme} /></BlogShell>
    </>
  );
}
