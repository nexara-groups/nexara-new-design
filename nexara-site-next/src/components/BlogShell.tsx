'use client';
// Neo chrome (Nav + Footer) around server-rendered blog content, wired like NeoSiteClient's Site.
import React from 'react';
import { Nav } from './neo/Nav';
import { Footer } from './neo/Footer';
import { useSmoothScroll } from './useSmoothScroll';

export function BlogShell({ children }: { children: React.ReactNode }) {
  useSmoothScroll();
  return (
    <div className="site neo">
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav theme="neo" page="blog" detail={null} />
      <div id="main">{children}</div>
      <Footer theme="neo" />
    </div>
  );
}
