import type { MetadataRoute } from 'next';
import { ROUTES } from '@/lib/routes';
import { getSeo, SITE_URL, blogUrl } from '@/lib/seo';
import { BLOG_POSTS } from '@/lib/blog';
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ROUTES;
  const canonicalMap = new Map<string, { page: string; detail: string | null }>();
  for (const r of routes) {
    const canonical = getSeo(r).canonical;
    if (canonical && !canonicalMap.has(canonical)) {
      canonicalMap.set(canonical, { page: r.page, detail: r.detail });
    }
  }

  const entries: MetadataRoute.Sitemap = [];

  for (const [url, info] of canonicalMap.entries()) {
    let priority = 0.8;
    let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly';

    if (url === `${SITE_URL}/` || info.page === 'home') {
      priority = 1.0;
      changeFrequency = 'weekly';
    } else if (info.page === 'labs' || info.page === 'marketing' || info.page === 'customers' || info.page === 'contact') {
      priority = 0.9;
      changeFrequency = 'weekly';
    } else if (info.page === 'company' || info.page === 'academy') {
      priority = 0.8;
      changeFrequency = 'monthly';
    }

    // Omit lastModified. A fresh timestamp on every request makes Google distrust the field.
    entries.push({ url, changeFrequency, priority });
  }

  // Legal / compliance documents
  for (const path of ['privacy-policy.html', 'terms-of-service.html', 'cookie-policy.html', 'data-deletion.html']) {
    entries.push({
      url: `${SITE_URL}/${path}`,
      changeFrequency: 'yearly',
      priority: 0.3,
    });
  }

  // Blog index
  if (BLOG_POSTS.length > 0) {
    entries.push({
      url: blogUrl(),
      lastModified: new Date(BLOG_POSTS[0]!.date),
      changeFrequency: 'daily',
      priority: 0.8,
    });
    for (const post of BLOG_POSTS) {
      entries.push({
        url: blogUrl(post.slug),
        lastModified: new Date(post.date),
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    }
  }

  return entries;
}
