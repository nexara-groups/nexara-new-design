import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DATA } from '../src/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.resolve(DIST_DIR, 'index.html');

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error('Error: dist/index.html template not found. Run "npm run build" first.');
  process.exit(1);
}

const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

const BRAND_TITLE = 'Nexara Groups — Academy, Digital Marketing & Product Studio';
const BASE_DESC = 'Three forces. One operating standard. Nexara Private Limited builds careers, grows brands, and ships production software — all from one house.';

// Definition of all crawlable routes
const routes = [
  // Gateway
  { path: '', theme: null, page: 'gateway', detail: null },
  // Trust Pages
  { path: 'trust', theme: 'trust', page: 'home', detail: null },
  { path: 'trust/academy', theme: 'trust', page: 'academy', detail: null },
  { path: 'trust/marketing', theme: 'trust', page: 'marketing', detail: null },
  { path: 'trust/labs', theme: 'trust', page: 'labs', detail: null },
  { path: 'trust/customers', theme: 'trust', page: 'customers', detail: null },
  { path: 'trust/company', theme: 'trust', page: 'company', detail: null },
  { path: 'trust/contact', theme: 'trust', page: 'contact', detail: null },
  // Trust Details
  { path: 'trust/academy/tracks', theme: 'trust', page: 'academy', detail: 'tracks' },
  { path: 'trust/marketing/brand', theme: 'trust', page: 'marketing', detail: 'brand' },
  { path: 'trust/marketing/web', theme: 'trust', page: 'marketing', detail: 'web' },
  { path: 'trust/marketing/growth', theme: 'trust', page: 'marketing', detail: 'growth' },
  { path: 'trust/labs/products', theme: 'trust', page: 'labs', detail: 'products' },
  { path: 'trust/labs/ai-automation', theme: 'trust', page: 'labs', detail: 'ai-automation' },
  { path: 'trust/labs/delivery', theme: 'trust', page: 'labs', detail: 'delivery' },
  // Neo Pages
  { path: 'neo', theme: 'neo', page: 'home', detail: null },
  { path: 'neo/academy', theme: 'neo', page: 'academy', detail: null },
  { path: 'neo/marketing', theme: 'neo', page: 'marketing', detail: null },
  { path: 'neo/labs', theme: 'neo', page: 'labs', detail: null },
  { path: 'neo/customers', theme: 'neo', page: 'customers', detail: null },
  { path: 'neo/company', theme: 'neo', page: 'company', detail: null },
  { path: 'neo/contact', theme: 'neo', page: 'contact', detail: null },
  // Neo Details
  { path: 'neo/academy/tracks', theme: 'neo', page: 'academy', detail: 'tracks' },
  { path: 'neo/marketing/brand', theme: 'neo', page: 'marketing', detail: 'brand' },
  { path: 'neo/marketing/web', theme: 'neo', page: 'marketing', detail: 'web' },
  { path: 'neo/marketing/growth', theme: 'neo', page: 'marketing', detail: 'growth' },
  { path: 'neo/labs/products', theme: 'neo', page: 'labs', detail: 'products' },
  { path: 'neo/labs/ai-automation', theme: 'neo', page: 'labs', detail: 'ai-automation' },
  { path: 'neo/labs/delivery', theme: 'neo', page: 'labs', detail: 'delivery' },
];

function getTitle(theme, page, detail) {
  if (page === 'gateway') return BRAND_TITLE;
  const capitalizedPage = page.charAt(0).toUpperCase() + page.slice(1);
  const themeName = theme === 'trust' ? 'Nexara Trust' : 'Nexara';
  if (detail) {
    const capitalizedDetail = detail.charAt(0).toUpperCase() + detail.slice(1).replace('-', ' ');
    return `${capitalizedDetail} | ${capitalizedPage} | ${themeName}`;
  }
  if (page === 'home') return BRAND_TITLE;
  return `${capitalizedPage} — ${themeName}`;
}

function getDescription(theme, page, detail) {
  if (page === 'gateway' || page === 'home') return BASE_DESC;
  if (page === 'academy') {
    return 'Nexara Academy: cohort-based talent development and managed internships with verified placement outcomes. Built for India\'s growth cities like Visakhapatnam.';
  }
  if (page === 'marketing') {
    return 'Nexara Digital Marketing: positioning, visual identity, landing pages, corporate websites, campaigns, and growth measurement infrastructure.';
  }
  if (page === 'labs') {
    return 'Nexara Product Studio: production AI software, custom SaaS platforms, B2B portals, and system integrations built to solve real business problems.';
  }
  if (page === 'customers') {
    return 'Nexara Delivery Proof: evidence before claims. Documented customer stories and delivery standards across academy, marketing, and labs.';
  }
  if (page === 'contact') {
    return 'Plan an engagement with Nexara. Submit a brief, request an AI automation consult, or coordinate student hiring in Visakhapatnam, India.';
  }
  if (page === 'company') {
    return theme === 'neo'
      ? "Nexara Gen Z: the IT company that doesn't act like one. Academy turns learning into portfolio proof, Digital Marketing turns offers into market signal, Labs turns AI ideas into working systems."
      : 'Nexara is an incorporated capability firm with three specialist forces — Academy, Digital, Labs — answering to one governance standard: named ownership, written scope, reported cadence.';
  }
  return BASE_DESC;
}

function generateNoscriptHTML(theme, page, detail) {
  if (page === 'gateway') {
    return `
      <h1>Nexara Groups</h1>
      <p>Nexara Private Limited (Nexara Groups) operates two core portals: Nexara Trust (for scoped enterprise governance) and Nexara Neo (for rapid growth initiatives).</p>
      <ul>
        <li><strong>Academy</strong> — Cohort-based talent development and portfolio proof</li>
        <li><strong>Digital Marketing</strong> — Positioning, web development, growth campaigns</li>
        <li><strong>Product Studio</strong> — Custom software, B2B portals, AI automation systems</li>
      </ul>
      <p>Please enable JavaScript to explore the interactive Nexara experience.</p>
    `;
  }

  const activeTheme = theme || 'trust';
  let html = `<h1>Nexara Groups — ${page.toUpperCase()} (${activeTheme.toUpperCase()})</h1>`;

  if (page === 'home') {
    const homeCopy = DATA.home[activeTheme];
    html += `
      <p><strong>${homeCopy.eyebrow}</strong></p>
      <h2>${homeCopy.title} ${homeCopy.accent || ''}</h2>
      <p>${homeCopy.body}</p>
      <h3>${homeCopy.calloutTitle}</h3>
      <p>${homeCopy.calloutBody}</p>
      <h3>Operating Divisions</h3>
      <ul>
        <li><a href="/${activeTheme}/academy">Academy & Talent Development</a></li>
        <li><a href="/${activeTheme}/marketing">Digital Marketing & Growth Systems</a></li>
        <li><a href="/${activeTheme}/labs">Product Studio & Applied AI Software</a></li>
      </ul>
    `;
    return html;
  }

  const section = DATA.sections[page];
  if (section) {
    const hero = section.hero[activeTheme];
    html += `
      <p><strong>${hero.eyebrow}</strong></p>
      <h2>${hero.title} ${hero.accent || ''}</h2>
      <p>${hero.body}</p>
      <p><em>Statement: ${section.statement}</em></p>
    `;

    if (detail) {
      const subpage = section.subpages.find(s => s.slug === detail);
      if (subpage) {
        html += `
          <h2>Subpage: ${subpage.title}</h2>
          <p>${subpage.callout[activeTheme] || ''}</p>
          <ul>
        `;
        if (subpage.cards) {
          subpage.cards.forEach(card => {
            html += `<li><strong>${card.title}</strong>: ${card[activeTheme] || card.neo || card.trust || ''}</li>`;
          });
        }
        html += `</ul>`;
      }
    } else {
      if (section.modules) {
        html += `<h3>Key Capabilities</h3><ul>`;
        section.modules.forEach(m => {
          html += `<li><strong>${m.title}</strong>: ${m[activeTheme] || m.trust || m.neo}</li>`;
        });
        html += `</ul>`;
      }

      if (section.subpages) {
        html += `<h3>Topics explored</h3><ul>`;
        section.subpages.forEach(s => {
          html += `<li><a href="/${activeTheme}/${page}/${s.slug}">${s.title}</a> — ${s.callout[activeTheme] || ''}</li>`;
        });
        html += `</ul>`;
      }

      if (section.packages) {
        html += `<h3>Engagement Options</h3><ul>`;
        section.packages.forEach(p => {
          html += `<li><strong>${p.name}</strong> (${p.fit}) — ${p.includes.join(', ')}</li>`;
        });
        html += `</ul>`;
      }
    }
  } else if (page === 'customers') {
    html += `
      <h2>Delivery Proof & Verified Case Studies</h2>
      <p>Every engagement at Nexara carries a named owner, a written scope, and outcome evidence.</p>
      <ul>
        <li><strong>Academy Placement:</strong> Cohort outcome dashboards.</li>
        <li><strong>Digital Solutions:</strong> Brand, positioning, and conversion funnel results.</li>
        <li><strong>AI & Product Studio:</strong> Scoped custom SaaS platforms shipped to production.</li>
      </ul>
    `;
  } else if (page === 'company') {
    const co = DATA.company[activeTheme];
    html += `
      <h2>${activeTheme === 'neo' ? 'Nexara Gen Z' : 'The Operating Standard'}</h2>
      <p>${co.manifesto}</p>
      <h3>Standards</h3>
      <ul>
    `;
    DATA.company.standards.forEach(s => {
      html += `<li><strong>${s.title}</strong>: ${s.body}</li>`;
    });
    html += `</ul>`;
  } else if (page === 'contact') {
    html += `
      <h2>Start a Project Enquiry</h2>
      <p>We work in growth cities to establish talent pipelines, launch brand presence, and build AI automation workflows.</p>
      <p>Contact us at <a href="mailto:info@nexaragroups.com">info@nexaragroups.com</a> to outline your timeline, audience, and primary success metric.</p>
    `;
  }

  html += `<p>Please enable JavaScript to explore the full interactive experience and view live 3D showcases.</p>`;
  return html;
}

// Generate files for all routes
routes.forEach((route) => {
  const routeTitle = getTitle(route.theme, route.page, route.detail);
  const routeDesc = getDescription(route.theme, route.page, route.detail);
  const routeUrl = `https://nexaragroups.com/${route.path}`;
  const routeNoscript = generateNoscriptHTML(route.theme, route.page, route.detail);

  let outputHTML = template;

  // 1. Replace Title
  outputHTML = outputHTML.replace(/<title>.*?<\/title>/g, `<title>${routeTitle}</title>`);
  
  // 2. Replace Primary SEO Tags
  outputHTML = outputHTML.replace(/<meta name="description" content=".*?" \/>/g, `<meta name="description" content="${routeDesc}" />`);
  outputHTML = outputHTML.replace(/<link rel="canonical" href=".*?" \/>/g, `<link rel="canonical" href="${routeUrl}" />`);

  // 3. Replace Open Graph Tags
  outputHTML = outputHTML.replace(/<meta property="og:title" content=".*?" \/>/g, `<meta property="og:title" content="${routeTitle}" />`);
  outputHTML = outputHTML.replace(/<meta property="og:description" content=".*?" \/>/g, `<meta property="og:description" content="${routeDesc}" />`);
  outputHTML = outputHTML.replace(/<meta property="og:url" content=".*?" \/>/g, `<meta property="og:url" content="${routeUrl}" />`);

  // 4. Replace Twitter Card Tags
  outputHTML = outputHTML.replace(/<meta name="twitter:title" content=".*?" \/>/g, `<meta name="twitter:title" content="${routeTitle}" />`);
  outputHTML = outputHTML.replace(/<meta name="twitter:description" content=".*?" \/>/g, `<meta name="twitter:description" content="${routeDesc}" />`);

  // 5. Replace Noscript contents
  outputHTML = outputHTML.replace(/<noscript>[\s\S]*?<\/noscript>/g, `<noscript>\n      <div style="padding:40px;font-family:sans-serif;max-width:700px;margin:0 auto">\n        ${routeNoscript}\n      </div>\n    </noscript>`);

  // Save index.html file in corresponding folder path
  let targetFile = path.join(DIST_DIR, 'index.html');
  if (route.path !== '') {
    const routeFolder = path.join(DIST_DIR, route.path);
    if (!fs.existsSync(routeFolder)) {
      fs.mkdirSync(routeFolder, { recursive: true });
    }
    targetFile = path.join(routeFolder, 'index.html');
  }

  // Write file
  fs.writeFileSync(targetFile, outputHTML, 'utf-8');
  console.log(`Pre-rendered route: /${route.path} -> ${targetFile.replace(DIST_DIR, '')}`);
});

console.log('Pre-rendering completed successfully!');
