import '@/styles/neo.css';
import CookieConsent from '@/components/CookieConsent';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CookieConsent theme="neo" />
    </>
  );
}
