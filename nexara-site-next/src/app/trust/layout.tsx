import CookieConsent from '@/components/CookieConsent';

export default function TrustLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CookieConsent theme="trust" />
    </>
  );
}
