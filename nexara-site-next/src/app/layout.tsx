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
import '@/styles/gateway.css';
import '@/styles/consent.css';
import '@/styles/refinements.css';
import '@/styles/elevation.css';
import '@/styles/cards.css';

export const metadata: Metadata = {
  title: 'Nexara Groups — Academy, Digital Marketing & Product Studio',
  description: "Nexara Groups: talent via Academy, growth via Digital Marketing, AI software via Product Studio. Named owners, written scope, verified delivery. Visakhapatnam, India.",
  keywords: 'Nexara, Nexara Groups, Nexara Private Limited, Nexara Academy, Nexara Digital Marketing, Nexara Labs, Nexara Product Studio, talent development, AI development India, digital marketing agency, tech training Visakhapatnam, software development India',
  authors: [{ name: 'Nexara Private Limited' }],
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
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
  verification: { google: 'fLwXJBPqsWL-8uTW8q2DDuRbOJnOY0WPe3xABNY4ftc' },
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
        {children}
      </body>
    </html>
  );
}
