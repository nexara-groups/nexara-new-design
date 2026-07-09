import type { Metadata } from 'next';
import Script from 'next/script';
import '@/styles/index.css';
import '@/styles/base.css';
import '@/styles/gateway.css';
import '@/styles/neo.css';
import '@/styles/trust.css';
import '@/styles/neo-guide.css';
import '@/styles/consent.css';

export const metadata: Metadata = {
  title: 'Nexara Groups — Academy, Digital Marketing & Product Studio',
  description: "Nexara Groups: talent via Academy, growth via Digital Marketing, AI software via Product Studio. Named owners, written scope, verified delivery. Visakhapatnam, India.",
  keywords: 'Nexara, Nexara Groups, Nexara Private Limited, Nexara Academy, Nexara Digital Marketing, Nexara Labs, Nexara Product Studio, talent development, AI development India, digital marketing agency, tech training Visakhapatnam, software development India',
  authors: [{ name: 'Nexara Private Limited' }],
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  alternates: { canonical: 'https://nexaragroups.com/' },
  openGraph: {
    type: 'website',
    siteName: 'Nexara Groups',
    title: 'Nexara Groups — Academy, Digital Marketing & Product Studio',
    description: 'Three forces. One operating standard. Nexara Private Limited builds careers, grows brands, and ships production software — all from one house.',
    url: 'https://nexaragroups.com/',
    images: [{ url: 'https://nexaragroups.com/brand/og-image.png', width: 1200, height: 630, alt: 'Nexara Groups — Academy, Digital Marketing & Product Studio' }],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexara Groups — Academy, Digital Marketing & Product Studio',
    description: 'Three forces. One operating standard. Nexara builds careers, grows brands, and ships production AI software — all from one house.',
    images: ['https://nexaragroups.com/brand/og-image.png'],
  },
  icons: { icon: '/brand/nexara-mark.svg' },
};

const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://nexaragroups.com/#organization',
      name: 'Nexara',
      legalName: 'Nexara Private Limited',
      alternateName: ['Nexara Groups', 'Nexara Group', 'Nexara Pvt Ltd'],
      url: 'https://nexaragroups.com/',
      logo: { '@type': 'ImageObject', url: 'https://nexaragroups.com/brand/nexara-logo.svg' },
      email: 'info@nexaragroups.com',
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: 'info@nexaragroups.com', areaServed: ['IN', 'AE', 'GB', 'US'], availableLanguage: ['en', 'hi', 'te'] },
      description: 'Nexara Private Limited (Nexara Groups) is a structured talent and technology company operating three divisions: Academy (talent development), Digital Marketing (growth infrastructure), and Product Studio (AI software). Every engagement has a named owner, a written scope, and verified delivery.',
      address: { '@type': 'PostalAddress', addressLocality: 'Visakhapatnam', addressRegion: 'Andhra Pradesh', addressCountry: 'IN' },
      areaServed: ['IN', 'AE', 'GB', 'US'],
      knowsAbout: ['Talent Development', 'Digital Marketing', 'AI Software', 'SaaS', 'Career Training'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Nexara Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Nexara Academy', description: 'Structured talent development. Cohort-based training with verified placement outcomes.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Nexara Marketing', description: 'Full-stack growth infrastructure — positioning, brand build, campaigns, and measurement.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Nexara Labs', description: 'Production AI software. SaaS products, applied AI, and intelligent systems shipped end-to-end.' } },
        ],
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://nexaragroups.com/#website',
      url: 'https://nexaragroups.com/',
      name: 'Nexara Groups',
      alternateName: 'Nexara Private Limited',
      publisher: { '@id': 'https://nexaragroups.com/#organization' },
      inLanguage: 'en-IN',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script id="host-guard" strategy="beforeInteractive">{`
          (function () {
            var h = location.hostname;
            if (h.indexOf('pages.dev') !== -1) {
              location.replace('https://nexaragroups.com' + location.pathname + location.search + location.hash);
            }
          })();
        `}</Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-BPYYD3KQ99" strategy="afterInteractive" />
        <Script id="ga-consent" strategy="beforeInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            'ad_storage': 'denied', 'ad_user_data': 'denied', 'ad_personalization': 'denied',
            'analytics_storage': 'denied', 'functionality_storage': 'granted', 'security_storage': 'granted',
            'wait_for_update': 500
          });
          try {
            var _cc = JSON.parse(localStorage.getItem('cc-consent') || 'null');
            if (_cc && _cc.analytics === true) gtag('consent', 'update', { 'analytics_storage': 'granted' });
          } catch (e) {}
          gtag('config', 'G-BPYYD3KQ99');
        `}</Script>
        <noscript>
          <div style={{ padding: 40, fontFamily: 'sans-serif', maxWidth: 700, margin: '0 auto' }}>
            <h1>Nexara Groups</h1>
            <p>Nexara Private Limited (Nexara Groups) builds talent through Academy, grows businesses through Digital Marketing, and ships AI software through Product Studio. Three forces. One operating standard. Based in Visakhapatnam, India — serving India, UAE, UK, and US.</p>
          </div>
        </noscript>
        {children}
      </body>
    </html>
  );
}
