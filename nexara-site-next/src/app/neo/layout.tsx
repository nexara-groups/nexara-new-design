import '@/styles/neo.css';
import '@/styles/neo-refinements.css';
import CookieConsent from '@/components/CookieConsent';

export default function NeoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CookieConsent theme="neo" />
    </>
  );
}
