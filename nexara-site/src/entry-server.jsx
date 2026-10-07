import React from 'react';
import { renderToString } from 'react-dom/server';
import { TrustSite } from './trust.jsx';
import { Site } from './neo.jsx';
import { Gateway } from './gateway.jsx';

export function render(route) {
  if (!route.theme) return renderToString(<Gateway initialPhase="live" />);
  return renderToString(route.theme === 'trust'
    ? <TrustSite page={route.page} detail={route.detail} />
    : <Site theme="neo" page={route.page} detail={route.detail} />);
}
