import type { MetadataRoute } from 'next';
import { ROUTES } from '@/lib/routes';
import { getSeo, SITE_URL, blogUrl } from '@/lib/seo';
import { BLOG_POSTS } from '@/lib/blog';
export default function sitemap(): MetadataRoute.Sitemap {
 const urls = new Set(ROUTES.filter(route=>route.page!=='gateway').map(route=>getSeo(route).canonical).filter((url): url is string=>Boolean(url)));
 for (const path of ['privacy-policy.html','terms-of-service.html','cookie-policy.html','data-deletion.html']) urls.add(SITE_URL+'/'+path);
 const lastModified = new Date();
 return [...[...urls].map(url=>({url, lastModified})), {url:blogUrl(), lastModified:new Date(BLOG_POSTS[0]!.date)}, ...BLOG_POSTS.map(post=>({url:blogUrl(post.slug), lastModified:new Date(post.date)}))];
}
