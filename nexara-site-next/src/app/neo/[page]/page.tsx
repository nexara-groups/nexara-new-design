import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { pageMetadata } from '@/lib/metadata';
import { PageSchema } from '@/components/PageSchema';
import { Site } from '@/components/NeoSiteClient';
export const dynamicParams = false;
export function generateStaticParams() { return ROUTES.filter(r => r.theme === 'neo' && r.page !== 'home' && !r.detail).map(r => ({page:r.page})); }
export async function generateMetadata({ params }: {params:Promise<{ page: string }>}): Promise<Metadata> {
 const { page } = await params; const detail = null;
 const route = ROUTES.find(r => r.theme === 'neo' && r.page === page && r.detail === detail);
 if (!route) return {robots:'noindex, follow'};
 return pageMetadata(route);
}
export default async function Page({params}: {params:Promise<{ page: string }>}) {
 const { page } = await params; const detail = null;
 const route = ROUTES.find(r => r.theme === 'neo' && r.page === page && r.detail === detail);
 if (!route) notFound();
 return <><PageSchema route={route} /><Site theme="neo" page={page} detail={detail} /></>;
}
