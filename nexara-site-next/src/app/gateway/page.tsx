import { pageMetadata } from '@/lib/metadata';
import { PageSchema } from '@/components/PageSchema';
import { Gateway } from '@/components/GatewayClient';
import CookieConsent from '@/components/CookieConsent';
// The Neo/Trust chooser. Utility page: noindex (see getSeo) and not in the sitemap.
const route = {theme:null, page:'gateway', detail:null};
export const metadata = pageMetadata(route);
export default function Page() {
  return (
    <>
      <PageSchema route={route} />
      <Gateway />
      <CookieConsent theme={null} />
    </>
  );
}
