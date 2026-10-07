import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [{source:'/trust/home',destination:'/trust',permanent:true},{source:'/neo/home',destination:'/neo',permanent:true},
      ...['privacy-policy','terms-of-service','cookie-policy','data-deletion'].map(page=>({source:'/'+page,destination:'/'+page+'.html',permanent:true})),
      ...['academy','marketing','labs','customers','company','contact'].map(page=>({source:'/'+page+'/:detail*',destination:'/trust/'+page+'/:detail*',permanent:true}))];
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
