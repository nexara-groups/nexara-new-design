import { NextResponse, type NextRequest } from 'next/server';

const CANONICAL_HOST = 'nexaragroups.com';
// Brand domains we own. They never serve pages: every path 301s to the same path on the canonical host,
// so search engines consolidate all signals onto nexaragroups.com instead of indexing duplicates.
const ALIAS_HOSTS = new Set(['www.' + CANONICAL_HOST, ...['nexaraprivatelimited.in', 'nexaraprivatelimited.com', 'nexaraprivatelimited.si'].flatMap(d => [d, 'www.' + d])]);

// One canonical origin: www, alias domains and plain-http requests 301 to https://nexaragroups.com.
// Scheme comes from Cloudflare's visitor headers (never nextUrl, which can be the
// worker's internal URL) so an https visitor can never be bounced into a loop.
export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase();
  if (host !== CANONICAL_HOST && !ALIAS_HOSTS.has(host)) return NextResponse.next();
  let scheme = request.headers.get('x-forwarded-proto') || '';
  try { scheme = JSON.parse(request.headers.get('cf-visitor') || '{}').scheme || scheme; } catch {}
  if (host === CANONICAL_HOST && scheme !== 'http') return NextResponse.next();
  const { pathname, search } = request.nextUrl;
  return NextResponse.redirect(`https://${CANONICAL_HOST}${pathname}${search}`, 301);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|fonts/).*)'],
};
