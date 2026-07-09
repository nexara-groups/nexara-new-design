import { useRouter } from 'next/navigation';

// `routeTo` is called from dozens of call sites spread across many sibling
// top-level components, not just from the main Site component — so the router
// instance is captured once via a registration effect in Site and this module-scope
// function reads it, preserving every existing call site's signature and behavior
// unchanged. Extracted the same way during Phase 2 decomposition, this used to live
// at the top of NeoSiteClient.tsx.
let _neoRouter: ReturnType<typeof useRouter> | null = null;

export function setNeoRouter(router: ReturnType<typeof useRouter>) {
  _neoRouter = router;
}

export function routeTo(theme: string, page = 'home', detail: string | null = null) {
  const path = theme === 'gateway' || !theme ? '/' : '/' + [theme, page, detail].filter(Boolean).join('/');
  window.scrollTo(0, 0);
  const navigate = () => { if (_neoRouter) _neoRouter.push(path); };
  if (document.startViewTransition) {
    document.startViewTransition(navigate);
  } else {
    navigate();
  }
}
