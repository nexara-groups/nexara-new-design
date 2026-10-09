import type { MetadataRoute } from 'next';
import { ROUTES } from '@/lib/routes';
import { getSeo, SITE_URL } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
 const urls = new Set(ROUTES.map(route=>getSeo(route).canonical).filter((url): url is string=>Boolean(url)));
 for (const path of ['privacy-policy.html','terms-of-service.html','cookie-policy.html','data-deletion.html']) urls.add(SITE_URL+'/'+path);
 const lastModified = new Date();
 return [...urls].map(url=>({url, lastModified}));
}
