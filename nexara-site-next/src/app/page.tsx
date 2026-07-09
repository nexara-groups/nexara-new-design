import { Gateway } from '@/components/GatewayClient';
import CookieConsent from '@/components/CookieConsent';

export default function Page() {
  return (
    <>
      <Gateway />
      <CookieConsent theme={null} />
    </>
  );
}
