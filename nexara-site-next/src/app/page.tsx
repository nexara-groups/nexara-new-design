import '@/styles/neo.css';
import '@/styles/neo-refinements.css';
import { pageMetadata } from '@/lib/metadata';
import { PageSchema } from '@/components/PageSchema';
import { Site } from '@/components/NeoSiteClient';
import CookieConsent from '@/components/CookieConsent';
// Neo is the primary presentation: this is the site's homepage (canonical https://nexaragroups.com/).
const route = {theme:'neo' as const, page:'home', detail:null};
export const metadata = pageMetadata(route);
export default function Page() { return <><PageSchema route={route} /><Site theme="neo" page="home" detail={null} /><CookieConsent theme="neo" /></>; }
