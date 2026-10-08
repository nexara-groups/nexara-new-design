import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source = ts.transpileModule(fs.readFileSync(new URL('../src/lib/hero-chapters.ts', import.meta.url), 'utf8'), {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {opacityForAnchoredChapter: opacity} = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const anchors = [0, .175, .36, .54, .72, .93];

test('stopping anywhere in a scroll transition never superimposes two headings', () => {
  for (let i = 0; i <= 10000; i++) {
    const visible = anchors.map((_, index) => opacity(i / 10000, index, anchors)).filter(value => value > .01);
    assert.ok(visible.length <= 1, `Overlapping copy at progress ${i / 10000}`);
  }
});

test('every chapter anchor and both ends remain fully readable', () => {
  anchors.forEach((anchor, index) => assert.equal(opacity(anchor, index, anchors), 1));
  assert.equal(opacity(1, anchors.length - 1, anchors), 1);
  assert.equal(opacity(.5, 0, [0]), 1);
});

test('headings ease out and in over a readable distance instead of popping', () => {
  // Chapter 2 leaving: measure how much progress it takes to go from 0.99 to 0.01.
  const span = (index, from, to, step) => {
    let first = null, last = null;
    for (let p = from; step > 0 ? p <= to : p >= to; p += step) {
      const v = opacity(p, index, anchors);
      if (v < .99 && v > .01) { if (first === null) first = p; last = p; }
    }
    return Math.abs(last - first);
  };
  assert.ok(span(2, .36, .54, .0001) >= .025, 'fade-out too abrupt');
  assert.ok(span(3, .36, .54, .0001) >= .025, 'fade-in too abrupt');
});
