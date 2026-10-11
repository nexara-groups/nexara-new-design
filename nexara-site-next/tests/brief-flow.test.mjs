import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/components/neo/briefFlow.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { startBrief, nextBrief } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
const cfg = { whatsappNumber: '919257535757', email: 'info@nexaragroups.com' };

const run = (answers) => {
  let turn = startBrief();
  for (const a of answers) turn = nextBrief(turn.state, a, cfg);
  return turn;
};

test('walks six steps and ends on a review with both send links', () => {
  const t = run(['A website', 'Sri Engineering Works', 'This month', 'Ravi', '98765 43210', 'Morning']);
  assert.equal(t.state.step, 'review');
  assert.ok(t.done.text.includes('Need: A website'));
  assert.ok(t.done.text.includes('Phone: +91 9876543210'));
  assert.ok(t.done.text.includes('Best time to call (IST): Morning'));
  assert.ok(t.done.whatsapp.startsWith('https://wa.me/919257535757?text='));
  assert.ok(t.done.mailto.startsWith('mailto:info@nexaragroups.com?subject='));
  assert.ok(decodeURIComponent(t.done.whatsapp.split('text=')[1]).includes('Ravi'));
});

test('rejects bad phone numbers and short names, then re-asks the same step', () => {
  let t = run(['A website', 'Acme', 'This month', 'R']);
  assert.equal(t.invalid, true);
  assert.equal(t.state.step, 'name');
  t = nextBrief(t.state, 'Ravi', cfg);
  assert.equal(t.state.step, 'phone');
  t = nextBrief(t.state, '12345', cfg);
  assert.equal(t.invalid, true);
  assert.equal(t.state.step, 'phone');
  t = nextBrief(t.state, '+91 98765 43210', cfg);
  assert.equal(t.state.data.phone, '+91 9876543210');
});

test('cancel stops cleanly, back goes one step, start over resets', () => {
  assert.equal(run(['A website', 'cancel']).cancelled, true);
  const b = run(['A website', 'Acme', 'back']);
  assert.equal(b.state.step, 'who');
  const done = run(['A website', 'Acme', 'This month', 'Ravi', '9876543210', 'Any time']);
  const again = nextBrief(done.state, 'Start over', cfg);
  assert.equal(again.state.step, 'need');
  assert.deepEqual(again.state.data, {});
});

test('answers are trimmed and capped at 160 characters', () => {
  const long = 'x'.repeat(500);
  const t = run([long]);
  assert.equal(t.state.data.need.length, 160);
});

test('the first question allows several picks and joins them', () => {
  const first = startBrief();
  assert.equal(first.multi, true);
  assert.equal(first.exclusive, 'Not sure yet');
  assert.equal(nextBrief(first.state, 'A website', cfg).multi, undefined);
  const t = run(['A website, Marketing, Training or internships']);
  assert.equal(t.state.data.need, 'A website, Marketing, Training or internships');
});
