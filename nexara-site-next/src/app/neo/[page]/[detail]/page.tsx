import type { Metadata } from 'next';
import { ROUTES, routeTitle } from '@/lib/routes';
import { Site } from '@/components/NeoSiteClient';

export function generateStaticParams() {
  return ROUTES.filter((r) => r.theme === 'neo' && r.detail).map((r) => ({
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
  const route = ROUTES.find((r) => r.theme === 'neo' && r.page === page && r.detail === detail);
  if (!route) return {};
  return {
    title: routeTitle(route),
    alternates: { canonical: `https://nexaragroups.com/${route.path}` },
  };
}

export default async function Page({ params }: { params: Promise<{ page: string; detail: string }> }) {
  const { page, detail } = await params;
  return <Site theme="neo" page={page} detail={detail} />;
}
