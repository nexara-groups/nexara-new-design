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
    return [{source:'/trust/home',destination:'/trust',permanent:true},{source:'/neo',destination:'/',permanent:true},{source:'/neo/home',destination:'/',permanent:true},
      ...['privacy-policy','terms-of-service','cookie-policy','data-deletion'].map(page=>({source:'/'+page,destination:'/'+page+'.html',permanent:true})),
      ...['academy','marketing','labs','customers','company','contact'].map(page=>({source:'/'+page+'/:detail*',destination:'/neo/'+page+'/:detail*',permanent:true}))];
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
