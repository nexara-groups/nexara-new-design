import React from 'react';
import { DATA } from './data.js';
const { useMemo, useState, useEffect } = React;
const STATIC_PAGES = ["home", "customers", "company", "contact"];
const HAS_SCROLL_ANIMATION = true;

/* ─── Animated hero cycling words (per section × theme) ─────────── */
const SECTION_HERO_WORDS = {
  trust: {
    academy:   ['on record', 'by design', 'end-to-end', 'to plan'],
    marketing: ['that converts', 'with proof', 'on-brand', 'to launch'],
    labs:      ['to spec', 'in production', 'on time', 'with receipts'],
    customers: ['on time', 'as scoped', 'with proof', 'as documented'],
    contact:   ['with governance', 'named and scoped', 'cleanly', 'on the record'],
  },
  neo: {
    academy:   ['different', 'proof-ready', 'placed', 'fast'],
    marketing: ['loud', 'viral', 'live', 'sticky'],
    labs:      ['shipped', 'smart', 'real', 'in prod'],
    customers: ['proven', 'real', 'public', 'receipted'],
  },
};


function voice(theme, value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[theme] || value.trust || value.neo || value;
  }
  return value;
}

function parseRoute() {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) {
    return { theme: null, page: "gateway", detail: null };
  }
  const parts = raw.split("/");
  if (parts[0] === "neo" || parts[0] === "trust") {
    return {
      theme: parts[0],
      page: parts[1] || "home",
      detail: parts[2] || null,
    };
  }
  const storedTheme = localStorage.getItem("nexara_theme") || "trust";
  return {
    theme: storedTheme,
    page: parts[0] || "home",
    detail: parts[1] || null,
  };
}

function routeTo(theme, page = "home", detail = null) {
  if (theme === "neo" || theme === "trust") {
    localStorage.setItem("nexara_theme", theme);
  }
  const hash = [theme, page, detail].filter(Boolean).join("/");
  window.scrollTo(0, 0);
  if (document.startViewTransition) {
    document.startViewTransition(() => { window.location.hash = hash; });
  } else {
    window.location.hash = hash;
  }
}

function getBriefSections() {
  return [
    { id: "academy", name: "Academy (Talent)" },
    { id: "marketing", name: "Digital Marketing (Growth)" },
    { id: "labs", name: "Labs (AI Systems)" },
    { id: "home", name: "Combined Play (All)" },
  ];
}

function buildBriefText(sections, formData) {
  return `NEXARA PROJECT SCOPE
--------------------------------------------------
Engagement Section: ${sections.find(s => s.id === formData.section)?.name || formData.section}
Target City: ${formData.city}
Target Audience/Users: ${formData.audience || "Not specified"}
Timeline: ${formData.timeline}
Current Assets/Tools: ${formData.context || "None/Not specified"}
Primary Success Metric: ${formData.successMetric || "Not specified"}
Decision-Maker Name: ${formData.name || "Not specified"}
Contact Email: ${formData.email || "Not specified"}
--------------------------------------------------
Generated on: ${new Date().toLocaleDateString()}`;
}

function buildBriefMailto(sections, formData, briefText) {
  const mailtoSubject = encodeURIComponent(`Nexara Project Enquiry - ${sections.find(s => s.id === formData.section)?.name} (${formData.city})`);
  const mailtoBody = encodeURIComponent(briefText);
  return `${DATA.contact.enquiry.href}?subject=${mailtoSubject}&body=${mailtoBody}`;
}

function useBriefForm(detail, options = {}) {
  const sections = useMemo(() => getBriefSections(), []);
  const initialSection = detail && sections.some(s => s.id === detail) ? detail : "home";
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    section: initialSection,
    city: "Visakhapatnam",
    audience: "",
    timeline: "1-3 months",
    context: "",
    successMetric: "",
    name: "",
    email: "",
  });

  React.useEffect(() => {
    if (detail && sections.some(s => s.id === detail)) {
      setFormData(prev => ({ ...prev, section: detail }));
    }
  }, [detail, sections]);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleLaneSelect = (sectionId) => {
    setFormData(prev => ({ ...prev, section: sectionId }));
    if (options.scrollSelector) {
      const formElement = document.querySelector(options.scrollSelector);
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const briefText = buildBriefText(sections, formData);
  const mailtoUrl = buildBriefMailto(sections, formData, briefText);
  const handleSubmit = (event) => {
    event.preventDefault();
    setShowSuccess(true);
    window.location.href = mailtoUrl;
  };

  return {
    sections,
    formData,
    handleChange,
    handleLaneSelect,
    handleSubmit,
    briefText,
    mailtoUrl,
    showSuccess,
  };
}


export { DATA, voice, parseRoute, routeTo, useBriefForm, getBriefSections, buildBriefText, buildBriefMailto, STATIC_PAGES, HAS_SCROLL_ANIMATION, SECTION_HERO_WORDS };
