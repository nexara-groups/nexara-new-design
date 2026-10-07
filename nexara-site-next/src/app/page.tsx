import { pageMetadata } from '@/lib/metadata';
import { PageSchema } from '@/components/PageSchema';
const route = {theme:null, page:'gateway', detail:null};
export const metadata = pageMetadata(route);
import { Gateway } from '@/components/GatewayClient';
import CookieConsent from '@/components/CookieConsent';

export default function Page() {
  return (
    <>
      <PageSchema route={route} />
      <Gateway />
      <CookieConsent theme={null} />
    </>
  );
}
