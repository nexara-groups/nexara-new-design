import { useRouter } from 'next/navigation';

// `routeTo` is called from ~60 call sites spread across many sibling top-level
// components (TrustNav, TrustHome, TrustIntakeBand, etc.), not just from the main
// TrustSite component — so the router instance is captured once via a registration
// effect in TrustSite and this module-scope function reads it, preserving every
// existing call site's signature and behavior unchanged. Extracted the same way
// during Phase 2 decomposition, this used to live at the top of TrustSiteClient.tsx.
let _trustRouter: ReturnType<typeof useRouter> | null = null;

export function setTrustRouter(router: ReturnType<typeof useRouter>) {
  _trustRouter = router;
}

export function routeTo(theme: string, page = 'home', detail: string | null = null) {
  const path = theme === 'gateway' || !theme ? '/' : '/' + [theme, page, detail].filter(Boolean).join('/');
  window.scrollTo(0, 0);
  const navigate = () => { if (_trustRouter) _trustRouter.push(path); };
  if (document.startViewTransition) {
    document.startViewTransition(navigate);
  } else {
    navigate();
  }
}
