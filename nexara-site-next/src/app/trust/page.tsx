import type { Metadata } from 'next';
import { ROUTES, routeTitle, routeDescription } from '@/lib/routes';
import { TrustSite } from '@/components/TrustSiteClient';

const route = ROUTES.find((r) => r.theme === 'trust' && r.page === 'home')!;
const title = routeTitle(route);
const description = routeDescription(route);
const url = 'https://nexaragroups.com/trust';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url },
  twitter: { title, description },
};

export default function Page() {
  return <TrustSite page="home" detail={null} />;
}
