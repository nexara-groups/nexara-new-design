import type { Metadata } from 'next';
import { ROUTES, routeTitle } from '@/lib/routes';
import { TrustSite } from '@/components/TrustSiteClient';

const route = ROUTES.find((r) => r.theme === 'trust' && r.page === 'home')!;

export const metadata: Metadata = {
  title: routeTitle(route),
  alternates: { canonical: 'https://nexaragroups.com/trust' },
};

export default function Page() {
  return <TrustSite page="home" detail={null} />;
}
