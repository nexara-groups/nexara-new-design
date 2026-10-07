'use client';
import React from 'react';
import { Code2, BrainCircuit, Layers3, Cloud, ArrowUpRight } from 'lucide-react';
import { Tilt } from './ui/motion-primitives';
import { routePath } from '@/lib/seo';
import Link from 'next/link';
import type { Theme } from '@/lib/routes';
import type { LucideIcon } from 'lucide-react';


const focusAreas: [LucideIcon, string, string][] = [
  [Code2, 'Full-stack projects', 'Build interfaces, API foundations and database workflows, then practise deployment.'],
  [BrainCircuit, 'Data & AI projects', 'Work with data cleaning, dashboards, AI foundations and an analytical project.'],
  [Layers3, 'Product design', 'Develop user flows, interface systems and a case study for your portfolio.'],
  [Cloud, 'Cloud & DevOps', 'Practise Git, hosting, CI basics and monitoring as part of an agreed project.'],
];

export default function InternshipOverview({ theme }: {theme:Theme}) {
  return <section className="internship-overview" aria-labelledby={`internship-scope-${theme}`}>
    <div className="internship-overview__inner">
      <header className="internship-overview__head">
        <div><p className="internship-overview__label">Nexara Academy · MVP Colony</p>
          <h2 id={`internship-scope-${theme}`}>Build work you can<br /><em>explain and demonstrate.</em></h2></div>
        <p>Our managed software internships in Vizag, Visakhapatnam connect practical projects with mentor pods, weekly demos and completion reports. Students, freshers and college teams can discuss a programme matched to their current skills and academic requirements.</p>
      </header>
      <div className="internship-overview__grid">
        {focusAreas.map(([Icon, title, body]) => <Tilt as="article" className="internship-focus" key={title}>
          <Icon className="internship-focus__icon" size={28} strokeWidth={1.5} aria-hidden="true" />
          <h3>{title}</h3><p>{body}</p>
        </Tilt>)}
      </div>
      <div className="internship-overview__enquiry">
        <div><h3>Discuss your internship in Visakhapatnam</h3>
          <p>Share your course, current skills, preferred focus and available dates. Confirm the project scope, schedule, duration, fees and reporting requirements with our team before enrolling.</p></div>
        <Link prefetch={false} href={routePath(theme, 'contact', 'academy')}>Ask about internships <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
    </div>
  </section>;
}
