import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { pageMetadata } from '@/lib/metadata';
import { PageSchema } from '@/components/PageSchema';
import { Site } from '@/components/NeoSiteClient';

export const dynamicParams = false;

function detailFromParams(detail?: string[]) {
  return detail?.[0] ?? null;
}

export function generateStaticParams() {
  // Always include `detail`. Omitting it on some routes makes Next drop the whole set,
  // so /neo/academy and the rest 404 in production while the sitemap still lists them.
  return ROUTES.filter((r) => r.theme === 'neo' && r.page !== 'home').map((r) => ({
    page: r.page,
    detail: r.detail ? [r.detail] : [],
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string; detail?: string[] }>;
}): Promise<Metadata> {
  const { page, detail: detailSeg } = await params;
  const detail = detailFromParams(detailSeg);
  const route = ROUTES.find((r) => r.theme === 'neo' && r.page === page && r.detail === detail);
  if (!route) return { robots: 'noindex, follow' };
  return pageMetadata(route);
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string; detail?: string[] }>;
}) {
  const { page, detail: detailSeg } = await params;
  const detail = detailFromParams(detailSeg);
  const route = ROUTES.find((r) => r.theme === 'neo' && r.page === page && r.detail === detail);
  if (!route) notFound();
  return (
    <>
      <PageSchema route={route} />
      <Site theme="neo" page={page} detail={detail} />
    </>
  );
}
