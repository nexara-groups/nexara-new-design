import { getRoutes, getSeo } from './seo';
export type Theme = 'trust' | 'neo';
export interface Route { path: string; theme: Theme | null; page: string; detail: string | null; }
export const ROUTES: Route[] = getRoutes();
export const routeTitle = (route: Route) => getSeo(route).title;
export const routeDescription = (route: Route) => getSeo(route).description;
