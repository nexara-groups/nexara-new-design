'use client';
import React from 'react';
import { Tilt } from '../ui/motion-primitives';
import { motion, useReducedMotion } from 'framer-motion';

type Theme = 'neo' | 'trust';

interface ThemeProps {
  theme: Theme;
}

interface CardVisualProps extends ThemeProps {
  title: string;
}

interface ModuleCardProps extends ThemeProps {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  /** Rendered after the body. Keeps buttons out of the paragraph. */
  footer?: React.ReactNode;
  visualTitle?: string | null;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement> | null;
}

export const CARD_MOTION = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
  }
};

function CardVisual({ title, theme }: CardVisualProps) {
  const normTitle = title.toLowerCase();

  if (normTitle.includes("brand") || normTitle.includes("visual identity") || normTitle.includes("positioning") || normTitle.includes("branding")) {
    return (
      <div className="card-visual visual-brand">
        <div className="brand-specimen">Aa</div>
        <div className="brand-circle-grid">
          <div className="brand-circle circle-1"></div>
          <div className="brand-circle circle-2"></div>
        </div>
        <div className="brand-swatches">
          <div className="swatch swatch-1"></div>
          <div className="swatch swatch-2"></div>
          <div className="swatch swatch-3"></div>
        </div>
      </div>
    );
  }

  if (normTitle.includes("web") || normTitle.includes("landing") || normTitle.includes("corporate") || normTitle.includes("product page")) {
    return (
      <div className="card-visual visual-web">
        <div className="browser-header">
          <div className="browser-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="browser-address"></div>
        </div>
        <div className="browser-content">
          <div className="browser-hero"></div>
          <div className="browser-cols">
            <div className="browser-col"></div>
            <div className="browser-col"></div>
            <div className="browser-col"></div>
          </div>
        </div>
      </div>
    );
  }

  if (normTitle.includes("social") || normTitle.includes("content studio") || normTitle.includes("visibility") || normTitle.includes("search")) {
    return (
      <div className="card-visual visual-social">
        <div className="social-header">
          <div className="social-avatar"></div>
          <div className="social-meta">
            <div className="social-line short"></div>
            <div className="social-line tiny"></div>
          </div>
        </div>
        <div className="social-body">
          <div className="social-line"></div>
          <div className="social-line"></div>
          <div className="social-image-mock"></div>
        </div>
        <div className="social-footer">
          <div className="social-icon"></div>
          <div className="social-icon"></div>
          <div className="social-icon"></div>
        </div>
      </div>
    );
  }

  if (normTitle.includes("performance") || normTitle.includes("growth") || normTitle.includes("ads") || normTitle.includes("paid acquisition") || normTitle.includes("reporting")) {
    return (
      <div className="card-visual visual-performance">
        <div className="chart-grid">
          <div className="chart-grid-line"></div>
          <div className="chart-grid-line"></div>
          <div className="chart-grid-line"></div>
        </div>
        <svg className="chart-svg" viewBox="0 0 100 40">
          <path className="chart-path" d="M0,35 C20,32 40,25 60,18 C70,14 85,5 95,2" fill="none" strokeWidth="2.5" />
          <circle className="chart-node" cx="95" cy="2" r="3" />
        </svg>
        <div className="chart-label">tracked</div>
      </div>
    );
  }

  if (normTitle.includes("tracks") || normTitle.includes("full-stack") || normTitle.includes("ai/data") || normTitle.includes("cloud") || normTitle.includes("design studio")) {
    return (
      <div className="card-visual visual-code">
        <div className="code-header">
          <div className="code-dots">
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="code-title">index.js</div>
        </div>
        <div className="code-body">
          <div className="code-line"><span className="code-keyword">const</span> nexara = <span className="code-string">"growth"</span>;</div>
          <div className="code-line indent"><span className="code-keyword">function</span> ship() {"{"}</div>
          <div className="code-line indent-2">runSystem(); <span className="cursor-blink">|</span></div>
          <div className="code-line indent">{"}"}</div>
        </div>
      </div>
    );
  }

  if (normTitle.includes("internship") || normTitle.includes("mentor") || normTitle.includes("review") || normTitle.includes("kanban") || normTitle.includes("briefs") || normTitle.includes("projects")) {
    return (
      <div className="card-visual visual-kanban">
        <div className="kanban-col">
          <div className="kanban-header">TODO</div>
          <div className="kanban-card"></div>
          <div className="kanban-card"></div>
        </div>
        <div className="kanban-col">
          <div className="kanban-header">DOING</div>
          <div className="kanban-card active"></div>
        </div>
        <div className="kanban-col">
          <div className="kanban-header">DONE</div>
          <div className="kanban-card done"></div>
        </div>
      </div>
    );
  }

  if (normTitle.includes("placement") || normTitle.includes("matching") || normTitle.includes("partner") || normTitle.includes("nodes") || normTitle.includes("alumni")) {
    return (
      <div className="card-visual visual-nodes">
        <div className="node-center"></div>
        <div className="node-satellite sat-1"></div>
        <div className="node-satellite sat-2"></div>
        <div className="node-satellite sat-3"></div>
        <div className="node-satellite sat-4"></div>
        <svg className="node-lines" viewBox="0 0 100 60">
          <line x1="50" y1="30" x2="20" y2="15" stroke="var(--line)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="50" y1="30" x2="80" y2="15" stroke="var(--line)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="50" y1="30" x2="30" y2="45" stroke="var(--line)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="50" y1="30" x2="70" y2="45" stroke="var(--line)" strokeWidth="1" strokeDasharray="2,2" />
        </svg>
      </div>
    );
  }

  if (normTitle.includes("atlas") || normTitle.includes("search") || normTitle.includes("knowledge")) {
    return (
      <div className="card-visual visual-search">
        <div className="search-bar">
          <div className="search-icon"></div>
          <div className="search-text">Query knowledgeBase...</div>
        </div>
        <div className="search-results">
          <div className="search-result-row">
            <span className="search-result-bullet"></span>
            <div className="search-result-line"></div>
          </div>
          <div className="search-result-row">
            <span className="search-result-bullet"></span>
            <div className="search-result-line short"></div>
          </div>
        </div>
      </div>
    );
  }

  if (normTitle.includes("pulse") || normTitle.includes("analytics") || normTitle.includes("metrics")) {
    return (
      <div className="card-visual visual-pulse">
        <div className="pulse-gauge">
          <svg viewBox="0 0 36 36" className="circular-chart">
            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="circle" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <text x="18" y="20.35" className="percentage">85%</text>
          </svg>
        </div>
        <div className="pulse-bars">
          <div className="pulse-bar-row"><div className="pulse-bar-fill" style={{ width: "70%" }}></div></div>
          <div className="pulse-bar-row"><div className="pulse-bar-fill" style={{ width: "90%" }}></div></div>
          <div className="pulse-bar-row"><div className="pulse-bar-fill" style={{ width: "40%" }}></div></div>
        </div>
      </div>
    );
  }

  if (normTitle.includes("forge") || normTitle.includes("agent") || normTitle.includes("pipeline")) {
    return (
      <div className="card-visual visual-forge">
        <div className="forge-step step-in">IN</div>
        <div className="forge-arrow arrow-1">&rarr;</div>
        <div className="forge-step step-proc">MODEL</div>
        <div className="forge-arrow arrow-2">&rarr;</div>
        <div className="forge-step step-out">OUT</div>
        <div className="forge-pulse-dot"></div>
      </div>
    );
  }

  if (normTitle.includes("vault") || normTitle.includes("extraction") || normTitle.includes("document") || normTitle.includes("ocr")) {
    return (
      <div className="card-visual visual-vault">
        <div className="vault-page">
          <div className="vault-scan-bar"></div>
          <div className="vault-text-block block-1"></div>
          <div className="vault-text-block block-2"></div>
          <div className="vault-text-block block-3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-visual visual-fallback">
      <div className="fallback-grid">
        <span></span><span></span><span></span>
        <span></span><span></span><span></span>
      </div>
    </div>
  );
}

export function ModuleCard({ theme, eyebrow, title, children, footer = null, visualTitle = null, className = "", onClick = null }: ModuleCardProps) {
  const reduceMotion = useReducedMotion();
  const isClickable = onClick !== null;

  // Spotlight border position comes from Tilt's --light-x/--light-y (see styles/cards.css).
  return (
    <Tilt as={isClickable ? "button" : "article"} type={isClickable ? "button" : undefined}
      className={`nx-card nx-module ${className} ${isClickable ? 'is-clickable' : ''}`}
      onClick={onClick || undefined}
      variants={CARD_MOTION}
      initial={false}
      whileInView="show"
      viewport={{ once: true, amount: 0.24 }}
      whileTap={reduceMotion || !isClickable ? undefined : { scale: 0.985 }}
    >
      <span className="nx-module-eyebrow">{eyebrow}</span>
      {visualTitle && <div className="nx-module-visual"><CardVisual title={visualTitle} theme={theme} /></div>}
      <h3 className="nx-module-title">{title}</h3>
      <p className="nx-module-body">{children}</p>
      {footer}
      {isClickable && (
        <span className="nx-module-cta">
          {theme === "neo" ? "Open the full drop" : "View specifications"} <span aria-hidden="true">→</span>
        </span>
      )}
    </Tilt>
  );
}
