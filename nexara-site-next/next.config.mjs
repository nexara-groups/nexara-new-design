import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Inline the (small) stylesheets so they stop blocking first paint and the font chain starts immediately.
  experimental: { inlineCss: true },
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'Strict-Transport-Security', value: 'max-age=31536000' }] }];
  },
  async redirects() {
    // Marketing / Academy are one scrolling page each: every old detail URL lands on its in-page anchor.
    const marketingMoves = [['brand', 'presence'], ['web', 'visibility'], ['growth', 'performance'], ['presence', 'presence'], ['visibility', 'visibility'], ['performance', 'performance']];
    const academyMoves = [['tracks', 'tracks'], ['internships', 'internships'], ['placements', 'placements']];
    return [{source:'/trust/home',destination:'/trust',permanent:true},{source:'/neo',destination:'/',permanent:true},{source:'/neo/home',destination:'/',permanent:true},{source:'/about',destination:'/neo/company',permanent:true},
      ...marketingMoves.flatMap(([from, to]) => [
        { source: `/neo/marketing/${from}`, destination: `/neo/marketing#${to}`, permanent: true },
        { source: `/trust/marketing/${from}`, destination: `/trust/marketing#${to}`, permanent: true },
        { source: `/marketing/${from}`, destination: `/neo/marketing#${to}`, permanent: true },
      ]),
      ...academyMoves.flatMap(([from, to]) => [
        { source: `/neo/academy/${from}`, destination: `/neo/academy#${to}`, permanent: true },
        { source: `/trust/academy/${from}`, destination: `/trust/academy#${to}`, permanent: true },
        { source: `/academy/${from}`, destination: `/neo/academy#${to}`, permanent: true },
      ]),
      // Academy & Sports merged into forms (Happy Forms registration).
      { source: '/neo/labs/academy-sports', destination: '/neo/labs/forms', permanent: true },
      { source: '/trust/labs/academy-sports', destination: '/trust/labs/forms', permanent: true },
      { source: '/labs/academy-sports', destination: '/neo/labs/forms', permanent: true },
      ...['privacy-policy','terms-of-service','cookie-policy','data-deletion'].map(page=>({source:'/'+page,destination:'/'+page+'.html',permanent:true})),
      ...['academy','marketing','labs','customers','company','contact'].map(page=>({source:'/'+page+'/:detail*',destination:'/neo/'+page+'/:detail*',permanent:true}))];
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
