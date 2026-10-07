import type { Metadata } from 'next';
import type { Route } from './routes';
import { getSeo, SITE_URL } from './seo';
export function pageMetadata(route: Pick<Route, 'theme' | 'page' | 'detail'>): Metadata {
  const seo = getSeo(route);
  return {
    title: seo.title, description: seo.description,
    alternates: { canonical: seo.canonical },
    robots: seo.robots,
    openGraph: { type: 'website', siteName: 'Nexara Groups', title: seo.title, description: seo.description, url: seo.canonical || SITE_URL, locale: 'en_IN', images: [{url: SITE_URL + '/brand/og-image.png', width:1200, height:630, alt:'Nexara — software, digital growth and Academy in Visakhapatnam'}] },
    twitter: { card:'summary_large_image', title:seo.title, description:seo.description, images:[SITE_URL + '/brand/og-image.png'] },
  };
}
