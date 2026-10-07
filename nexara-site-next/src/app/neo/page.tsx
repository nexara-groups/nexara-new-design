import { pageMetadata } from '@/lib/metadata';
import { PageSchema } from '@/components/PageSchema';
import { Site } from '@/components/NeoSiteClient';
const route = {theme:'neo' as const, page:'home', detail:null};
export const metadata = pageMetadata(route);
export default function Page() { return <><PageSchema route={route} /><Site theme="neo" page="home" detail={null} /></>; }
