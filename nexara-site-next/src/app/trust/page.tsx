import { pageMetadata } from '@/lib/metadata';
import { PageSchema } from '@/components/PageSchema';
import { TrustSite } from '@/components/TrustSiteClient';
const route = {theme:'trust' as const, page:'home', detail:null};
export const metadata = pageMetadata(route);
export default function Page() { return <><PageSchema route={route} /><TrustSite page="home" detail={null} /></>; }
