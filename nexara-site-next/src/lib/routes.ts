export type Theme = 'trust' | 'neo';

export interface Route {
  path: string;
  theme: Theme | null;
  page: string;
  detail: string | null;
}

const BRAND_TITLE = 'Nexara Groups — Academy, Digital Marketing & Product Studio';

function themeName(theme: Theme): string {
  return theme === 'trust' ? 'Nexara Trust' : 'Nexara';
}

// Naive title-casing mangles hyphenated slugs ("ai-automation" -> "Ai automation").
// Special-case known acronym slugs; title-case the rest word-by-word.
function capitalizeSlug(slug: string): string {
  if (slug === 'ai-automation') return 'AI Automation';
  return slug
    .split(/[-_ ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function routeTitle(route: Route): string {
  if (route.page === 'gateway') return BRAND_TITLE;
  const capPage = capitalizeSlug(route.page);
  if (route.detail) {
    const capDetail = capitalizeSlug(route.detail);
    return `${capDetail} | ${capPage} | ${themeName(route.theme as Theme)}`;
  }
  if (route.page === 'home') return BRAND_TITLE;
  return `${capPage} — ${themeName(route.theme as Theme)}`;
}

export const ROUTES: Route[] = [
  { path: '', theme: null, page: 'gateway', detail: null },

  { path: 'trust', theme: 'trust', page: 'home', detail: null },
  { path: 'trust/academy', theme: 'trust', page: 'academy', detail: null },
  { path: 'trust/marketing', theme: 'trust', page: 'marketing', detail: null },
  { path: 'trust/labs', theme: 'trust', page: 'labs', detail: null },
  { path: 'trust/customers', theme: 'trust', page: 'customers', detail: null },
  { path: 'trust/company', theme: 'trust', page: 'company', detail: null },
  { path: 'trust/contact', theme: 'trust', page: 'contact', detail: null },
  { path: 'trust/academy/tracks', theme: 'trust', page: 'academy', detail: 'tracks' },
  { path: 'trust/marketing/brand', theme: 'trust', page: 'marketing', detail: 'brand' },
  { path: 'trust/marketing/web', theme: 'trust', page: 'marketing', detail: 'web' },
  { path: 'trust/marketing/growth', theme: 'trust', page: 'marketing', detail: 'growth' },
  { path: 'trust/labs/products', theme: 'trust', page: 'labs', detail: 'products' },
  { path: 'trust/labs/ai-automation', theme: 'trust', page: 'labs', detail: 'ai-automation' },
  { path: 'trust/labs/delivery', theme: 'trust', page: 'labs', detail: 'delivery' },

  { path: 'neo', theme: 'neo', page: 'home', detail: null },
  { path: 'neo/academy', theme: 'neo', page: 'academy', detail: null },
  { path: 'neo/marketing', theme: 'neo', page: 'marketing', detail: null },
  { path: 'neo/labs', theme: 'neo', page: 'labs', detail: null },
  { path: 'neo/customers', theme: 'neo', page: 'customers', detail: null },
  { path: 'neo/company', theme: 'neo', page: 'company', detail: null },
  { path: 'neo/contact', theme: 'neo', page: 'contact', detail: null },
  { path: 'neo/academy/tracks', theme: 'neo', page: 'academy', detail: 'tracks' },
  { path: 'neo/marketing/brand', theme: 'neo', page: 'marketing', detail: 'brand' },
  { path: 'neo/marketing/web', theme: 'neo', page: 'marketing', detail: 'web' },
  { path: 'neo/marketing/growth', theme: 'neo', page: 'marketing', detail: 'growth' },
  { path: 'neo/labs/products', theme: 'neo', page: 'labs', detail: 'products' },
  { path: 'neo/labs/ai-automation', theme: 'neo', page: 'labs', detail: 'ai-automation' },
  { path: 'neo/labs/delivery', theme: 'neo', page: 'labs', detail: 'delivery' },
];
