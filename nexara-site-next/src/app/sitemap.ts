import type { MetadataRoute } from 'next';
import { ROUTES } from '@/lib/routes';

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `https://nexaragroups.com/${route.path}`,
    lastModified: new Date('2026-07-09'),
    changeFrequency: 'weekly' as const,
    priority: route.page === 'gateway' ? 1.0 : route.detail ? 0.6 : route.page === 'home' ? 0.9 : 0.7,
  }));
}
