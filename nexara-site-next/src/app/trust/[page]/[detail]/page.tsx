import type { Metadata } from 'next';
import { ROUTES, routeTitle, routeDescription } from '@/lib/routes';
import { TrustSite } from '@/components/TrustSiteClient';

export function generateStaticParams() {
  return ROUTES.filter((r) => r.theme === 'trust' && r.detail).map((r) => ({
    page: r.page,
    detail: r.detail as string,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string; detail: string }>;
}): Promise<Metadata> {
  const { page, detail } = await params;
  const route = ROUTES.find((r) => r.theme === 'trust' && r.page === page && r.detail === detail);
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

export default async function Page({ params }: { params: Promise<{ page: string; detail: string }> }) {
  const { page, detail } = await params;
  return <TrustSite page={page} detail={detail} />;
}
