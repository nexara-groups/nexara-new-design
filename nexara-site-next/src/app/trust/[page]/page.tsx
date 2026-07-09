import type { Metadata } from 'next';
import { ROUTES, routeTitle } from '@/lib/routes';
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
  return {
    title: routeTitle(route),
    alternates: { canonical: `https://nexaragroups.com/${route.path}` },
  };
}

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  return <TrustSite page={page} detail={null} />;
}
