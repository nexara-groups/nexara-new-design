import type { Metadata } from 'next';
import { ROUTES, routeTitle } from '@/lib/routes';
import { Site } from '@/components/NeoSiteClient';

const route = ROUTES.find((r) => r.theme === 'neo' && r.page === 'home')!;

export const metadata: Metadata = {
  title: routeTitle(route),
  alternates: { canonical: 'https://nexaragroups.com/neo' },
};

export default function Page() {
  return <Site theme="neo" page="home" detail={null} />;
}
