'use client';
import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Confirmation needs a press, not a page load: mail scanners open emailed links on their own.
export function ConfirmSubscription() {
  const params = useSearchParams();
  const token = { e: params.get('e') || '', t: params.get('t') || '', s: params.get('s') || '' };
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'done' | 'expired' | 'failed'>(token.e && token.s ? 'idle' : 'expired');

  const confirm = async () => {
    setStatus('sending');
    try {
      const res = await fetch('/api/submit/confirm', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(token) });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      setStatus(res.ok && data.ok ? 'done' : data.error === 'expired' ? 'expired' : 'failed');
    } catch {
      setStatus('failed');
    }
  };

  if (status === 'done') return <><h1>You are subscribed.</h1><p>Thank you. Expect at most one email a month. Reply to any of them to unsubscribe.</p><Link href="/">Back to Nexara</Link></>;
  if (status === 'expired') return <><h1>This link has expired or is not valid.</h1><p>Sign up again from the footer of any page and we will send a fresh link.</p><Link href="/">Back to Nexara</Link></>;
  return (
    <>
      <h1>Confirm your subscription</h1>
      <p>Press the button to receive the Nexara newsletter at this address.</p>
      <button type="button" className="nx-confirm-btn" onClick={confirm} disabled={status === 'sending'}>{status === 'sending' ? 'Confirming…' : 'Confirm subscription'}</button>
      {status === 'failed' && <p role="alert">That did not work. Please try again, or email info@nexaragroups.com.</p>}
    </>
  );
}
