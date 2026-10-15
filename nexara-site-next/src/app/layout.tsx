import type { Metadata } from 'next';
import Script from 'next/script';
// Self-hosted (same-origin, latin subset) — replaces the render-blocking Google
// Fonts stylesheet. @fontsource keeps the real family names, so CSS is unchanged.
import '@fontsource/syne/latin-600.css';
import '@fontsource/syne/latin-700.css';
import '@fontsource/syne/latin-800.css';
import '@fontsource/space-grotesk/latin-400.css';
import '@fontsource/space-grotesk/latin-500.css';
import '@fontsource/space-grotesk/latin-600.css';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource/jetbrains-mono/latin-700.css';
import '@fontsource/plus-jakarta-sans/latin-400.css';
import '@fontsource/plus-jakarta-sans/latin-500.css';
import '@fontsource/plus-jakarta-sans/latin-600.css';
import '@fontsource/plus-jakarta-sans/latin-700.css';
import '@fontsource/plus-jakarta-sans/latin-800.css';
import '@fontsource/libre-baskerville/latin-400.css';
import '@fontsource/libre-baskerville/latin-700.css';
import '@fontsource/libre-baskerville/latin-400-italic.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/inter/latin-800.css';
import '@/styles/index.css';
import '@/styles/base.css';
import '@/styles/consent.css';
import '@/styles/shared.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://nexaragroups.com'),
  title: 'Nexara | Software Company in Vizag & Website Development',
  description: 'Nexara Private Limited builds software, websites, SaaS and digital marketing from MVP Colony, Visakhapatnam (Vizag). Call 9257535757.',
  keywords: 'Nexara, Nexera, Nexera Vizag, Nexara Vizag, Nexara Groups, Nexara Private Limited, software company in Vizag, websites in vizag, best websites contacts in Vizag, web development Visakhapatnam, IT company in Vizag, Next.js React developers Vizag, Nexara Voice, Agency OS, HappyGrow, MVP Colony software company, Sai Nirmaan Architects, Sri Engineering Works, Happy Farms, Rise Medical Hub, Qualigene',
  authors: [{ name: 'Nexara Private Limited', url: 'https://nexaragroups.com' }],
  category: 'Technology',
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  openGraph: {
    type: 'website',
    siteName: 'Nexara',
    title: 'Nexara | Software Company in Vizag & Website Development',
    description: 'Custom software, websites, AI products, and tech talent training from MVP Colony, Visakhapatnam. Shipped for real clients.',
    url: 'https://nexaragroups.com',
    images: [{ url: 'https://nexaragroups.com/brand/og-image.png', width: 1200, height: 630, alt: 'Nexara - Software, Websites & Digital Growth in Visakhapatnam' }],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexara | Software Company in Vizag & Website Development',
    description: 'Custom software, websites, AI products, and tech talent training from MVP Colony, Visakhapatnam. Shipped for real clients.',
    images: ['https://nexaragroups.com/brand/og-image.png'],
  },
  icons: { icon: '/brand/nexara-mark.svg' },
  verification: { google: 'fLwXJBPqsWL-8uTW8q2DDuRbOJnOY0WPe3xABNY4ftc' },
  other: {
    'geo.region': 'IN-AP',
    'geo.placename': 'Visakhapatnam',
    'geo.position': '17.738047;83.341405',
    'ICBM': '17.738047, 83.341405',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="no-js" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html:"document.documentElement.classList.remove('no-js')"}} />
        <Script id="host-guard" strategy="beforeInteractive">{`
          (function () {
            var h = location.hostname;
            if (h.indexOf('pages.dev') !== -1) {
              location.replace('https://nexaragroups.com' + location.pathname + location.search + location.hash);
            }
          })();
        `}</Script>

      </head>
      {/* Extensions (e.g. Grammarly) inject attributes on <body> before hydrate. */}
      <body suppressHydrationWarning>
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
        {/* gtag.js (180 KB) runs only while the page is at rest. It used to load on the first
            touch/scroll, and its ~75-100 ms evaluation froze the hero mid-swipe on every first
            scroll. Now it is fetched into the HTTP cache in the background, then executed only
            after 1.2 s without scrolling, so the blocking run never overlaps a gesture.
            Queued dataLayer events and the consent default above are replayed when it arrives. */}
        <Script id="ga-loader" strategy="afterInteractive">{`
          (function () {
            var src = 'https://www.googletagmanager.com/gtag/js?id=G-BPYYD3KQ99';
            var done = false, lastScroll = 0, QUIET = 1200;
            function onScroll() { lastScroll = Date.now(); }
            addEventListener('scroll', onScroll, { passive: true });
            addEventListener('touchmove', onScroll, { passive: true });
            function run() {
              if (done) return;
              var wait = QUIET - (Date.now() - lastScroll);
              if (wait > 0) { setTimeout(run, wait + 50); return; }
              done = true;
              removeEventListener('scroll', onScroll);
              removeEventListener('touchmove', onScroll);
              var s = document.createElement('script');
              s.async = true; s.src = src;
              document.head.appendChild(s);
            }
            function start() {
              var warm = window.fetch ? fetch(src, { mode: 'no-cors' }).catch(function () {}) : Promise.resolve();
              warm.then(function () { setTimeout(run, 0); });
            }
            function later() { setTimeout(start, 3000); }
            if (document.readyState === 'complete') later(); else addEventListener('load', later);
          })();
        `}</Script>
        {children}
      </body>
    </html>
  );
}
