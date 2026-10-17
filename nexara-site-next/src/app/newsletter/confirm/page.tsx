import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ConfirmSubscription } from './ConfirmSubscription';

// Landing page for the newsletter confirmation link. Utility page outside Neo/Trust, like not-found.
export const metadata: Metadata = {
  title: 'Confirm your subscription | Nexara',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="site-loading nx-confirm">
      <img src="/brand/nexara-mark.svg" alt="Nexara" width={48} height={48} />
      <Suspense fallback={<p>Loading…</p>}>
        <ConfirmSubscription />
      </Suspense>
    </main>
  );
}
