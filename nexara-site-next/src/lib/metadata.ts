import type { Metadata } from 'next';
import type { Route } from './routes';
import { INDEX_ROBOTS as INDEX, getSeo, SITE_URL, blogUrl } from './seo';
import { BLOG_DESCRIPTION, type BlogPost } from './blog';
export function pageMetadata(route: Pick<Route, 'theme' | 'page' | 'detail'>): Metadata {
  const seo = getSeo(route);
  return {
    title: seo.title, description: seo.description,
    alternates: { canonical: seo.canonical },
    robots: seo.robots,
    openGraph: { type: 'website', siteName: 'Nexara', title: seo.title, description: seo.description, url: seo.canonical || SITE_URL, locale: 'en_IN', images: [{url: SITE_URL + '/brand/og-image.png', width:1200, height:630, alt:'Nexara — software, digital growth and Academy in Visakhapatnam'}] },
    twitter: { card:'summary_large_image', title:seo.title, description:seo.description, images:[SITE_URL + '/brand/og-image.png'] },
  };
}

const OG_IMAGE = { url: SITE_URL + '/brand/og-image.png', width: 1200, height: 630, alt: 'Nexara — software, digital growth and Academy in Visakhapatnam' };
export function blogIndexMetadata(): Metadata {
  const title = 'Blog | Nexara, Visakhapatnam', description = BLOG_DESCRIPTION, url = blogUrl();
  return { title, description, alternates: { canonical: url }, robots: INDEX, openGraph: { type: 'website', siteName: 'Nexara', title, description, url, locale: 'en_IN', images: [OG_IMAGE] }, twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE.url] } };
}
export function blogPostMetadata(post: BlogPost): Metadata {
  const title = `${post.title} | Nexara Blog`, url = blogUrl(post.slug);
  return { title, description: post.description, alternates: { canonical: url }, robots: INDEX, authors: [{ name: post.author }], keywords: post.tags,
    openGraph: { type: 'article', siteName: 'Nexara', title: post.title, description: post.description, url, locale: 'en_IN', publishedTime: post.date, modifiedTime: post.date, authors: [post.author], tags: post.tags, images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description, images: [OG_IMAGE.url] } };
}
