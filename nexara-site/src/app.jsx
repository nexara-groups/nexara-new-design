import React from 'react';
import { parseRoute } from './shared.js';
import { TrustSite } from './trust.jsx';

const { useState } = React;
const Gateway = React.lazy(() => import('./gateway.jsx').then((m) => ({ default: m.Gateway })));
const NeoSite = React.lazy(() => import('./neo.jsx').then((m) => ({ default: m.Site })));

function App() {
  const [route, setRoute] = useState(parseRoute());
  React.useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  let el;
  if (route.page === "gateway" || !route.theme) el = <Gateway />;
  else if (route.theme === "trust") el = <TrustSite page={route.page} detail={route.detail} />;
  else el = <NeoSite theme={route.theme} page={route.page} detail={route.detail} />;

  return <React.Suspense fallback={null}>{el}</React.Suspense>;
}

export default App;
