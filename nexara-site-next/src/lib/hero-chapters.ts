function smoothstep(value: number, min: number, max: number): number {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return t * t * (3 - 2 * t);
}

export function opacityForAnchoredChapter(progress: number, index: number, anchors: number[]): number {
  // Fade through the scene: the outgoing heading finishes leaving before the
  // next one starts arriving, so two full-screen headings never overlap. Each
  // half is long enough (~100px of scroll on desktop) to read as motion rather
  // than a pop.
  const fade = 0.032;
  const gap = 0.002;
  const isFirst = index === 0;
  const isLast = index === anchors.length - 1;
  const leftBoundary = isFirst ? 0 : ((anchors[index - 1] ?? 0) + (anchors[index] ?? 0)) / 2;
  const rightBoundary = isLast ? 1 : ((anchors[index] ?? 1) + (anchors[index + 1] ?? 1)) / 2;
  const fadeIn = isFirst
    ? 1
    : smoothstep(progress, leftBoundary + gap, leftBoundary + gap + fade);
  const fadeOut = isLast
    ? 1
    : 1 - smoothstep(progress, rightBoundary - gap - fade, rightBoundary - gap);
  return Math.min(fadeIn, fadeOut);
}

/** -1 while a chapter is still arriving (below its anchor), +1 once it is leaving. */
export function chapterDirection(progress: number, index: number, anchors: number[]): number {
  return progress < (anchors[index] ?? 0) ? -1 : 1;
}
