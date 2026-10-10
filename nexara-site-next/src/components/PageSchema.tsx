import type { Route } from '@/lib/routes';
import { getStructuredData } from '@/lib/seo';
export function PageSchema({ route }: { route: Pick<Route, 'theme' | 'page' | 'detail'> }) {
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(getStructuredData(route)).replace(/</g, '\\u003c')}} />;
}
