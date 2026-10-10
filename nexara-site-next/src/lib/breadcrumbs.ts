import { routePath } from './seo';
import { DATA } from './data';
import {
  CONTACT_ENTRY,
  divisionLabel,
  labsTabBySlug,
  navLabel,
  voiced,
  type Theme,
} from './site';

export type Crumb = { label: string; href: string | null };

const homeLabel = (theme: Theme) => voiced({ neo: 'Home', trust: 'Home' }, theme);

function pageLabel(theme: Theme, page: string): string {
  if (page === 'home') return homeLabel(theme);
  if (page === 'contact') return voiced(CONTACT_ENTRY.label, theme);
  return navLabel(page, theme) ?? page;
}

function detailLabel(theme: Theme, page: string, detail: string, override?: string): string {
  if (override) return override;
  if (page === 'labs') return labsTabBySlug(detail)?.title ?? detail;
  if (page === 'customers' || page === 'contact') {
    if (detail === 'home') return homeLabel(theme);
    if (detail in DATA.sections) return divisionLabel(detail, theme);
  }
  if (page === 'blog') return override ?? detail;
  return detail;
}

/** Build Home → Page → Detail crumbs for every routed level. */
export function getBreadcrumbs(
  theme: Theme,
  page: string,
  detail: string | null = null,
  currentLabel?: string,
): Crumb[] {
  if (page === 'home') {
    return [{ label: homeLabel(theme), href: null }];
  }

  const crumbs: Crumb[] = [{ label: homeLabel(theme), href: routePath(theme, 'home') }];

  if (page === 'notfound') {
    crumbs.push({ label: currentLabel ?? 'Not found', href: null });
    return crumbs;
  }

  const sectionLabel = pageLabel(theme, page);

  if (!detail) {
    crumbs.push({ label: currentLabel ?? sectionLabel, href: null });
    return crumbs;
  }

  crumbs.push({ label: sectionLabel, href: routePath(theme, page) });
  crumbs.push({ label: detailLabel(theme, page, detail, currentLabel), href: null });
  return crumbs;
}
