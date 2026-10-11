import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/components/neo/guideAgent.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { answer, suggestions } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));

const kb = {
  base: '/neo',
  phone: { display: '9257535757', href: 'tel:+919257535757' },
  email: 'info@nexaragroups.com',
  address: 'MVP Colony, Visakhapatnam',
  clients: [
    { name: 'Sri Engineering Works', url: 'https://sriengineeringworks.com/', line: 'HVAC product site.', place: 'Hyderabad', scope: [] },
    { name: 'Happy Farms', url: 'https://ourhappyfarms.com/', line: 'Agri SaaS.', place: 'Andhra Pradesh', scope: [] },
  ],
  teams: [
    { id: 'academy', name: 'Academy', pitch: 'training and internships.', packages: [{ name: 'Internship Batch', fit: '', price: 'Priced per batch size', duration: 'Aligned to the academic calendar' }] },
    { id: 'marketing', name: 'Marketing', pitch: 'websites and campaigns.', packages: [{ name: 'Presence', fit: '', price: 'Priced per identity and site scope', duration: 'Confirmed at kickoff' }] },
    { id: 'labs', name: 'Labs', pitch: 'custom software.', packages: [{ name: 'Product Build', fit: '', price: 'Priced per product scope', duration: 'Set by build phases' }] },
  ],
  faqs: [['What is Nexara’s engineering tech stack for software and websites?', 'We build with Next.js, React, TypeScript, Node.js and PostgreSQL.']],
};

test('contact intents return real details and actions', () => {
  const phone = answer('what is your phone number', kb);
  assert.ok(phone.line.includes('9257535757'));
  assert.equal(phone.actions[0].type, 'tel');
  assert.ok(answer('email you', kb).line.includes('info@nexaragroups.com'));
});

test('named client opens that client, not a guess', () => {
  const r = answer('tell me about happy farms', kb);
  assert.ok(r.line.includes('Happy Farms'));
  assert.ok(r.actions.some((a) => a.type === 'open' && a.url === 'https://ourhappyfarms.com/'));
});

test('partial client names and generic words are handled', () => {
  assert.ok(answer('tell me about Sri Engineering', kb).actions.some((a) => a.type === 'open'));
  assert.equal(answer('what does the academy do', kb).actions.some((a) => a.type === 'open'), false);
});

test('pricing quotes only package wording, never a number', () => {
  const r = answer('how much does a website cost', kb);
  assert.ok(/priced per identity and site scope/i.test(r.line));
  assert.equal(/₹|rs\.?\s?\d|\$\d/i.test(r.line), false);
  assert.ok(/no public price list/i.test(answer('what do you charge', kb).line));
});

test('internship questions route to Academy', () => {
  const r = answer('do you run internships', kb);
  assert.ok(r.line.startsWith('Academy'));
  assert.ok(r.actions.some((a) => a.type === 'goto' && a.path === '/neo/academy'));
});

test('FAQ match answers from site copy', () => {
  assert.ok(answer('what tech stack do you use', kb).line.includes('Next.js'));
});

test('navigation and theme switch', () => {
  assert.ok(answer('take me to the blog', kb).actions.some((a) => a.path === '/neo/blog'));
  assert.equal(answer('switch to the corporate version', kb).actions[0].type, 'theme');
});

test('unknown questions admit it instead of guessing', () => {
  const r = answer('what is the airspeed of a laden swallow', kb);
  assert.equal(r.fallback, true);
  assert.ok(/rather say so than guess/.test(r.line));
  assert.ok(suggestions().length >= 3);
});

test('wanting a call or a project starts the quick brief and is honest about booking', () => {
  for (const q of ['can you call me back', 'schedule a meeting', 'i want to start a project', 'book a demo']) {
    const r = answer(q, kb);
    assert.ok(r.actions.some((a) => a.type === 'brief'), q);
    assert.ok(/can't book calendar slots/.test(r.line), q);
  }
  assert.equal(answer('what is your phone number', kb).actions[0].type, 'tel');
});
