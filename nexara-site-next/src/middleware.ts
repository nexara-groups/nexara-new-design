import { NextResponse, type NextRequest } from 'next/server';

const CANONICAL_HOST = 'nexaragroups.com';

// One canonical origin: www and plain-http requests 301 to https://nexaragroups.com.
// Scheme comes from Cloudflare's visitor headers (never nextUrl, which can be the
// worker's internal URL) so an https visitor can never be bounced into a loop.
export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase();
  if (host !== CANONICAL_HOST && host !== 'www.' + CANONICAL_HOST) return NextResponse.next();
  let scheme = request.headers.get('x-forwarded-proto') || '';
  try { scheme = JSON.parse(request.headers.get('cf-visitor') || '{}').scheme || scheme; } catch {}
  if (host === CANONICAL_HOST && scheme !== 'http') return NextResponse.next();
  const { pathname, search } = request.nextUrl;
  return NextResponse.redirect(`https://${CANONICAL_HOST}${pathname}${search}`, 301);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|fonts/).*)'],
};
