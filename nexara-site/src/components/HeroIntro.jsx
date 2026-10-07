import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { routePath } from '../seo.js';
import { routeTo } from '../shared.js';

export default function HeroIntro({ theme }) {
  const link = (page, detail, label) => <a href={routePath(theme, page, detail)} onClick={event => {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault(); routeTo(theme, page, detail);
    }
  }}>{label}<ArrowUpRight size={16} aria-hidden="true" /></a>;
  return <div className="hero-intro">
    <p>Software, talent and digital growth.<br /><span>Built from Visakhapatnam.</span></p>
    <div className="hero-intro__links">{link('contact', null, 'Start a project')}{link('academy', 'internships', 'Explore internships')}</div>
  </div>;
}
