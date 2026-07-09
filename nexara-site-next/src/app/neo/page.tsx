import type { Metadata } from 'next';
import { ROUTES, routeTitle, routeDescription } from '@/lib/routes';
import { Site } from '@/components/NeoSiteClient';

const route = ROUTES.find((r) => r.theme === 'neo' && r.page === 'home')!;
const title = routeTitle(route);
const description = routeDescription(route);
const url = 'https://nexaragroups.com/neo';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url },
  twitter: { title, description },
};

export default function Page() {
  return <Site theme="neo" page="home" detail={null} />;
}
