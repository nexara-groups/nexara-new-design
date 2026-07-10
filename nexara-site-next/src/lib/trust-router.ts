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
  // base.css declares `@view-transition { navigation: auto; }`, which already
  // wraps every router.push in its own view transition. Also calling
  // document.startViewTransition() here raced that automatic one and threw
  // "InvalidStateError: Transition was aborted because of invalid state",
  // leaving a stuck transition snapshot covering the page.
  if (_trustRouter) _trustRouter.push(path);
}
