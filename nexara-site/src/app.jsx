import React from 'react';
import { parseRoute } from './shared.js';
import { updatePageSeo } from './seo.js';
import CookieConsent from './CookieConsent.jsx';

const { useState } = React;
const loaders = {
  trust: () => import('./trust.jsx').then(module => module.TrustSite),
  neo: () => import('./neo.jsx').then(module => module.Site),
  gateway: () => import('./gateway.jsx').then(module => module.Gateway),
};
const loaded = {};
const components = Object.fromEntries(Object.entries(loaders).map(([key, load]) => [key,
  React.lazy(() => load().then(Component => { loaded[key] = Component; return { default: Component }; })),
]));

export async function loadPresentation(route) {
  const key = route.theme || 'gateway';
  loaded[key] = await loaders[key]();
}

function App() {
  const [route, setRoute] = useState(parseRoute());
  React.useEffect(() => {
    const onPopState = () => setRoute(parseRoute());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  React.useEffect(() => {
    updatePageSeo(route);
  }, [route.theme, route.page, route.detail]);
  React.useEffect(() => { document.documentElement.classList.remove('no-js'); }, []);

  const key = route.theme || 'gateway';
  const Presentation = loaded[key] || components[key];
  const el = <Presentation theme={route.theme} page={route.page} detail={route.detail} />;

  return (
    <>
      <React.Suspense fallback={<div className="site-loading" role="status"><img src="/brand/nexara-logo.svg" alt="Nexara" width="220" height="54" /><span>Opening Nexara…</span></div>}>{el}</React.Suspense>
      <CookieConsent />
    </>
  );
}

export default App;
