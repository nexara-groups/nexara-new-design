// Contact hero: the brief preview is split into lines so the line a visitor just changed can flash.
// Pure on purpose: no imports, no DOM.

/** Lines the page fills in by itself after mount (the date). They never flash. */
const AUTO_LINE = /^Generated on:/;

/** Indices of lines that differ between two brief texts, ignoring the automatic date line. */
export function changedLines(previous: string, next: string): number[] {
  const a = previous.split('\n');
  const b = next.split('\n');
  const out: number[] = [];
  for (let i = 0; i < b.length; i += 1) if (a[i] !== b[i] && !AUTO_LINE.test(b[i] ?? '')) out.push(i);
  return out;
}
