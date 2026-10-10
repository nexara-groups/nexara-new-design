import React from 'react';

// Compact page header used by every shared page (About, Proof, Blog) in both themes.
// Skinned by the --nx-* tokens in shared.css; there is no per-theme markup here on purpose.
export function PageHeader({ kicker, title, accent, body, children }: {
  kicker: string; title: React.ReactNode; accent?: string; body?: string; children?: React.ReactNode;
}) {
  return (
    <header className="nx-page-head">
      <div className="nx-inner">
        <p className="nx-kicker">{kicker}</p>
        <h1>{title}{accent && <> <em>{accent}</em></>}</h1>
        {body && <p className="nx-lede">{body}</p>}
        {children}
      </div>
    </header>
  );
}
