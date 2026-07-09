import type { Metadata } from 'next';
import { ROUTES, routeTitle, routeDescription } from '@/lib/routes';
import { TrustSite } from '@/components/TrustSiteClient';

export function generateStaticParams() {
  return ROUTES.filter((r) => r.theme === 'trust' && r.page !== 'home' && !r.detail).map((r) => ({
    page: r.page,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  const route = ROUTES.find((r) => r.theme === 'trust' && r.page === page && !r.detail);
  if (!route) return {};
  const title = routeTitle(route);
  const description = routeDescription(route);
  const url = `https://nexaragroups.com/${route.path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    twitter: { title, description },
  };
}

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  return <TrustSite page={page} detail={null} />;
}
