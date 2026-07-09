import CookieConsent from '@/components/CookieConsent';

export default function NeoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CookieConsent theme="neo" />
    </>
  );
}
