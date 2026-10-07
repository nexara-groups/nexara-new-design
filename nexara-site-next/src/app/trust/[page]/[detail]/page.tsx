import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { pageMetadata } from '@/lib/metadata';
import { PageSchema } from '@/components/PageSchema';
import { TrustSite } from '@/components/TrustSiteClient';
export const dynamicParams = false;
export function generateStaticParams() { return ROUTES.filter(r => r.theme === 'trust' && r.detail !== null).map(r => ({page:r.page, detail:r.detail!})); }
export async function generateMetadata({ params }: {params:Promise<{ page: string; detail: string }>}): Promise<Metadata> {
 const { page, detail } = await params;
 const route = ROUTES.find(r => r.theme === 'trust' && r.page === page && r.detail === detail);
 if (!route) return {robots:'noindex, follow'};
 return pageMetadata(route);
}
export default async function Page({params}: {params:Promise<{ page: string; detail: string }>}) {
 const { page, detail } = await params;
 const route = ROUTES.find(r => r.theme === 'trust' && r.page === page && r.detail === detail);
 if (!route) notFound();
 return <><PageSchema route={route} /><TrustSite page={page} detail={detail} /></>;
}
