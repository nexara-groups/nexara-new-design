import React from 'react';
import { parseRoute } from './shared.js';
import { TrustSite } from './trust.jsx';
import CookieConsent from './CookieConsent.jsx';

const { useState } = React;
const Gateway = React.lazy(() => import('./gateway.jsx').then((m) => ({ default: m.Gateway })));
const NeoSite = React.lazy(() => import('./neo.jsx').then((m) => ({ default: m.Site })));

const PAGE_TITLES = {
  home:      'Home',
  academy:   'Academy — Talent Development',
  marketing: 'Marketing — Growth Infrastructure',
  labs:      'Labs — AI Software',
  customers: 'Customers — Delivery Proof',
  contact:   'Contact — Start a Project',
};

const BRAND_TITLE = 'Nexara Groups — Academy, Digital Marketing & Product Studio';

function useDynamicTitle(route) {
  React.useEffect(() => {
    // Gateway and the themed home pages carry the full keyword-rich brand title
    // (a bare "Home | Nexara Trust" wastes the highest-value SERP line, which
    // crawlers read from the JS-rendered <title>, not the static HTML).
    if (!route.theme || route.page === 'gateway' || route.page === 'home') {
      document.title = BRAND_TITLE;
      return;
    }
    const section = PAGE_TITLES[route.page] || route.page;
    const theme = route.theme === 'trust' ? 'Nexara Trust' : 'Nexara';
    document.title = `${section} | ${theme}`;
  }, [route.theme, route.page]);
}

function App() {
  const [route, setRoute] = useState(parseRoute());
  React.useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useDynamicTitle(route);

  let el;
  if (route.page === "gateway" || !route.theme) el = <Gateway />;
  else if (route.theme === "trust") el = <TrustSite page={route.page} detail={route.detail} />;
  else el = <NeoSite theme={route.theme} page={route.page} detail={route.detail} />;

  return (
    <>
      <React.Suspense fallback={null}>{el}</React.Suspense>
      <CookieConsent />
    </>
  );
}

export default App;
