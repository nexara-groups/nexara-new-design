import { COPY } from './copy';
import { PAGE_FINDER, voiced, type FinderPage, type Theme, type Voiced } from './site';

// Sections for a page's bottom bar (PageFinder), voiced. Plain module so server components can call it.
export function finderItems(page: FinderPage, theme: Theme) {
  const labels = COPY.finder[page] as Record<string, Voiced>;
  return PAGE_FINDER[page].map((id) => ({ id, label: voiced(labels[id]!, theme) }));
}
