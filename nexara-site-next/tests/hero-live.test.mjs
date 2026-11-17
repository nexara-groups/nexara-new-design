import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

// Pure modules behind the live Contact, Labs and Marketing heroes. They have no imports, so each loads on its own.
const read = (file) => fs.readFileSync(new URL('../src/' + file, import.meta.url), 'utf8');
const moduleOf = (source) => import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText).toString('base64'));
const mk = await moduleOf(read('lib/marketing-sequence.ts'));
const contact = await moduleOf(read('lib/contact-hero.ts'));

test('marketing: server state is the finished card', () => {
  const s = mk.finalSequence(20);
  assert.deepEqual(s, { typed: 20, step: 4, phase: 'ready' });
  assert.equal(mk.sequenceDelay(s, 20), null);
});

test('marketing: types the query, builds the four steps in order, then rests', () => {
  const length = 5;
  let s = mk.beginRun(mk.finalSequence(length));
  assert.deepEqual(s, { typed: 0, step: 0, phase: 'running' });
  assert.equal(mk.sequenceDelay(s, length), mk.TYPE_START_MS);
  const trace = [];
  for (let i = 0; i < 40 && mk.sequenceDelay(s, length) !== null; i += 1) { s = mk.tickSequence(s, length); trace.push(`${s.typed}/${s.step}`); }
  assert.deepEqual(trace.slice(0, 9), ['1/0', '2/0', '3/0', '4/0', '5/0', '5/1', '5/2', '5/3', '5/4']);
  assert.equal(s.phase, 'rested');
  assert.equal(mk.sequenceDelay(s, length), null);
  assert.deepEqual(mk.beginRun(s), s, 'never restarts');
  // Typing is quick, the card steps are slower.
  assert.ok(mk.sequenceDelay({ typed: 2, step: 0, phase: 'running' }, length) < mk.sequenceDelay({ typed: 5, step: 1, phase: 'running' }, length));
});

test('marketing: jumping to a stage stops the run, completes the field and shows that stage', () => {
  let s = mk.beginRun(mk.finalSequence(12));
  s = mk.tickSequence(s, 12);
  const jumped = mk.jumpTo(s, 12, 2);
  assert.deepEqual(jumped, { typed: 12, step: 2, phase: 'stopped' });
  assert.equal(mk.sequenceDelay(jumped, 12), null);
  assert.deepEqual(mk.tickSequence(jumped, 12), jumped);
  assert.deepEqual(mk.beginRun(jumped), jumped);
  assert.equal(mk.jumpTo(s, 12, 9).step, 4);
  assert.equal(mk.jumpTo(s, 12, -1).step, 0);
  const stopped = mk.stopSequence({ typed: 3, step: 0, phase: 'running' }, 12);
  assert.deepEqual(stopped, { typed: 12, step: 0, phase: 'stopped' });
});

test('marketing: items are built step by step', () => {
  const steps = [1, 1, 1, 2, 3, 3, 4];
  assert.deepEqual(mk.builtItems(steps, 0), steps.map(() => false));
  assert.deepEqual(mk.builtItems(steps, 2), [true, true, true, true, false, false, false]);
  assert.ok(mk.builtItems(steps, 4).every(Boolean));
});

test('contact: only the changed line is reported, and the automatic date line is ignored', () => {
  const a = 'NEXARA\nEngagement Section: Combined\nTarget City: Visakhapatnam\n--';
  const b = 'NEXARA\nEngagement Section: Labs\nTarget City: Visakhapatnam\n--';
  assert.deepEqual(contact.changedLines(a, b), [1]);
  assert.deepEqual(contact.changedLines(a, a), []);
  assert.deepEqual(contact.changedLines(a, a + '\nGenerated on: 2026-11-17'), []);
  assert.deepEqual(contact.changedLines(a, b + '\nGenerated on: 2026-11-17'), [1]);
});

// The headlines must not change: the source strings are pinned here and each page must still render them one line per span.
const h1 = [
  ['shared/ContactPage.tsx', '<h1 className="nx-ct-h1">{t(copy.lines).map((line) => <span className="nx-ct-ln" key={line}><span>{line}</span></span>)}</h1>'],
  ['shared/MarketingPage.tsx', '<h1 className="nx-mk-h1">{t(PAGE.hero.lines).map((line) => <span className="nx-mk-ln" key={line}><span>{line}</span></span>)}</h1>'],
  ['shared/LabsPage.tsx', '<h1 className="nx-lab-title">{hero.title}</h1>'],
];
test('hero headlines are still rendered one line per span, not split into words', () => {
  for (const [file, markup] of h1) assert.ok(read('components/' + file).includes(markup), file);
});

test('hero headline strings are unchanged', () => {
  const copy = read('lib/copy.ts');
  assert.ok(copy.includes(`lines: { neo: ['Tell us what', "you're building."], trust: ['Every project starts', 'with one conversation.'] }`), 'contact lines');
  const data = read('lib/data.ts');
  assert.ok(data.includes(`lines: { neo: ["Someone searches", "your name."], trust: ["A customer searches", "the business."] }`), 'marketing lines');
  assert.ok(data.includes(`query: { neo: "your business name", trust: "the business name" }`), 'marketing query');
  assert.equal(data.split('title: "We build the system that solves the problem."').length - 1, 2, 'labs title, both voices');
});
