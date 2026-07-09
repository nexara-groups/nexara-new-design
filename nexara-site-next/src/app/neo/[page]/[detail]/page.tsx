import type { Metadata } from 'next';
import { ROUTES, routeTitle, routeDescription } from '@/lib/routes';
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
  return <Site theme="neo" page={page} detail={detail} />;
}
