import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { routePath } from '@/lib/seo';
import type { Theme } from '@/lib/routes';
export default function HeroIntro({theme}:{theme:Theme}) {
 return <div className="hero-intro"><p>Software, talent and digital growth.<br/><span>Built from Visakhapatnam.</span></p><div className="hero-intro__links"><Link prefetch={false} href={routePath(theme,'contact')}>Start a project <ArrowUpRight size={16} aria-hidden="true"/></Link><Link prefetch={false} href={routePath(theme,'academy','internships')}>Explore internships <ArrowUpRight size={16} aria-hidden="true"/></Link></div></div>;
}
