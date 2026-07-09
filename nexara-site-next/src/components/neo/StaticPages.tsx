'use client';
import { DATA } from '@/lib/data';
import { useBriefForm } from '@/lib/shared';
import { NotFound } from '../NotFound';
import { HeroBanner } from './SectionShell';

type Theme = 'trust' | 'neo';

interface DetailPageProps {
  theme: Theme;
  detail: string | null;
}

interface ThemeOnlyProps {
  theme: Theme;
}

interface ContactHeroProps {
  theme: Theme;
  onStartBrief: () => void;
}

interface SectionSummary {
  name: string;
}

function Customers({ theme, detail }: DetailPageProps) {
  const activeSection = detail ? (DATA.sections as Record<string, SectionSummary | undefined>)[detail] : null;
  if (detail && !activeSection) return <NotFound theme={theme} page={`customers/${detail}`} />;
  const proofItems = activeSection ? DATA.customers.filter((customer) => customer.id === detail) : DATA.customers;
  const copy = theme === "neo"
    ? { title: "Proof without fake trophies.", accent: "Readiness stays visible.", body: "Until public client stories are approved, Nexara shows the operating proof each section is built to produce." }
    : { title: "Readiness proof across all three sections.", accent: "Clear outcomes by section.", body: "Each proof card is framed as a delivery model, not an invented customer claim." };
  return (
    <main>
      <HeroBanner compact theme={theme} eyebrow={activeSection ? `${activeSection.name} proof` : "Proof"} title={copy.title} accent={copy.accent} body={copy.body} />
      <section className="module-grid">
        {proofItems.map((customer) => (
          <article className="module-card" key={customer.company}>
            <span>{customer.section}</span>
            <h3>{customer.company}</h3>
            <p>{customer[theme]}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

function Company({ theme }: ThemeOnlyProps) {
  const company = DATA.company[theme];
  return (
    <main>
      <HeroBanner compact theme={theme} eyebrow="Company" title={theme === "neo" ? "Incorporated, then built to move." : "The operating idea is simple."} accent="Capability compounds." body={company.manifesto} />
      <section className="fact-strip">
        {DATA.company.facts.map(([label, value]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>
      <section className="module-grid compact">
        {company.principles.map((principle) => (
          <article className="module-card" key={principle.title}>
            <span>Principle</span>
            <h3>{principle.title}</h3>
            <p>{principle.body}</p>
          </article>
        ))}
      </section>
      <section className="content-band">
        <div className="section-head">
          <div>
            <p className="eyebrow">{theme === "neo" ? "Operating standards" : "Delivery governance"}</p>
            <h2>{theme === "neo" ? "The standards that keep the site honest." : "Public claims and delivery promises stay evidence-led."}</h2>
          </div>
        </div>
        <div className="module-grid compact">
          {DATA.company.standards.map((item) => (
            <article className="module-card" key={item.title}>
              <span>Standard</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function ContactHero({ theme, onStartBrief }: ContactHeroProps) {
  const copy = DATA.contact[theme];
  const isNeo = theme === "neo";
  return (
    <section className={`contact-hero contact-hero--${theme}`}>
      <div className="contact-hero__bg" aria-hidden="true">
        <div className="orb one"/>
        <div className="orb two"/>
        <div className="scanlines"/>
      </div>
      <div className="contact-hero__body">
        <p className="contact-hero__eyebrow eyebrow">{copy.eyebrow}</p>
        <h1 className="contact-hero__heading">{copy.title}</h1>
        <p className="contact-hero__subtext">{copy.body}</p>
        <a className="contact-hero__email-pill" href={`mailto:${copy.accent}`}>{copy.accent}</a>
        <button className="contact-hero__cta" onClick={onStartBrief}>{copy.primary}</button>
      </div>
    </section>
  );
}

function Contact({ theme, detail }: DetailPageProps) {
  const copy = DATA.contact[theme];
  const {
    sections,
    formData,
    handleChange,
    handleLaneSelect,
    briefText,
    mailtoUrl,
  } = useBriefForm(detail, { scrollSelector: ".brief-planner-grid" });

  return (
    <main>
      <ContactHero theme={theme} onStartBrief={() => {
        document.querySelector(".brief-planner-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }} />

      <section className="contact-layout brief-planner-grid">
        {/* Left Column: The Form */}
        <div className="brief-form-panel">
          <p className="eyebrow">{theme === "neo" ? "01 / YOUR PROJECT" : "Step 1: Project Parameters"}</p>
          <h2 className="planner-title">{theme === "neo" ? "Tell us what you're building." : "Define the engagement scope."}</h2>
          <p className="planner-subtitle">
            {theme === "neo"
              ? "Six fields. One email. We read every one."
              : "Complete each field below. Your responses generate a formatted message sent directly to our intake team."}
          </p>

          <div className="brief-form-group">
            <label>
              <span>Engagement Area</span>
              <small>{theme === "neo" ? "// which section owns this" : "Select the Nexara section that best fits your need"}</small>
            </label>
            <div className="brief-selector-grid">
              {sections.map(s => (
                <button
                  key={s.id}
                  type="button"
                  className={formData.section === s.id ? "brief-select-btn is-active" : "brief-select-btn"}
                  onClick={() => handleChange("section", s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="brief-form-row">
            <div className="brief-form-group">
              <label>
                <span>Target City</span>
                <small>{theme === "neo" ? "// where this runs" : "Primary city of operation or delivery"}</small>
              </label>
              <select
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              >
                {DATA.market.cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="brief-form-group">
              <label>
                <span>Timeline</span>
                <small>{theme === "neo" ? "// how fast" : "Expected start-to-completion window"}</small>
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => handleChange("timeline", e.target.value)}
              >
                <option value="Under 1 month">Under 1 month</option>
                <option value="1-3 months">1–3 months</option>
                <option value="3-6 months">3–6 months</option>
                <option value="Ongoing">Ongoing support</option>
              </select>
            </div>
          </div>

          <div className="brief-form-group">
            <label>
              <span>Target Audience</span>
              <small>{theme === "neo" ? "// who you're building for" : "End users, learners, or customer segment"}</small>
            </label>
            <input
              type="text"
              placeholder="e.g. engineering students, local shoppers"
              value={formData.audience}
              onChange={(e) => handleChange("audience", e.target.value)}
            />
          </div>

          <div className="brief-form-group">
            <label>
              <span>Current Assets & Stack</span>
              <small>{theme === "neo" ? "// what you're starting with" : "Existing website, tools, platforms, or repositories"}</small>
            </label>
            <input
              type="text"
              placeholder="e.g. React website, legacy CRM, none"
              value={formData.context}
              onChange={(e) => handleChange("context", e.target.value)}
            />
          </div>

          <div className="brief-form-group">
            <label>
              <span>Primary Success Metric</span>
              <small>{theme === "neo" ? "// what winning looks like" : "The measurable outcome this engagement should move"}</small>
            </label>
            <input
              type="text"
              placeholder="e.g. 90% placement rate, 2x sales conversion"
              value={formData.successMetric}
              onChange={(e) => handleChange("successMetric", e.target.value)}
            />
          </div>

          <div className="brief-form-row">
            <div className="brief-form-group">
              <label>
                <span>Contact Name</span>
                <small>Decision-maker name</small>
              </label>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div className="brief-form-group">
              <label>
                <span>Contact Email</span>
                <small>Intake routing path</small>
              </label>
              <input
                type="email"
                placeholder="e.g. jane@company.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Brief Preview */}
        <div className="brief-preview-panel glass-panel">
          <p className="eyebrow">{theme === "neo" ? "02 / YOUR SCOPE" : "Step 2: Project Summary"}</p>
          <div className="brief-preview-container">
            <pre className="brief-preview-text">{briefText}</pre>
          </div>
          <div className="brief-preview-actions">
            <a href={mailtoUrl} className="brief-submit-btn">
              {theme === "neo" ? "Send it →" : "Submit via email"}
            </a>
            <p className="brief-disclaimer">
              {theme === "neo"
                ? "Opens your email client with your project details sent to info@nexaragroups.com."
                : "Selecting this opens your email application with your project scope addressed to info@nexaragroups.com."}
            </p>
          </div>
        </div>
      </section>

      {/* The bottom lane selector */}
      <section className="contact-action-explained">
        <p className="eyebrow">{theme === "neo" ? "PICK YOUR LANE" : "Engagement Lanes"}</p>
        <h2>{theme === "neo" ? "Not sure where to start?" : "Select the section that matches your project."}</h2>
        <p>{theme === "neo"
          ? "Each card pre-fills the form for that section. Pick the one that fits."
          : "Choosing a lane pre-populates the form fields for the relevant section scope."}</p>
      </section>

      <section className="module-grid compact">
        {DATA.contact.channels.map((channel) => (
          <article className={"module-card " + (formData.section === channel.section ? "is-active" : "")} key={channel.title}>
            <span>{channel.section === "home" ? "Combined" : (DATA.sections as Record<string, SectionSummary | undefined>)[channel.section]?.name}</span>
            <h3>{channel.title}</h3>
            <p>{channel.body}</p>
            <button onClick={() => handleLaneSelect(channel.section)}>{theme === "neo" ? "Set this lane" : "Select lane"}</button>
          </article>
        ))}
      </section>
    </main>
  );
}

export { Customers, Company, ContactHero, Contact };
