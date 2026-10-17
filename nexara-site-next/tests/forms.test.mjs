import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const moduleOf = source => import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
const { validateSubmission, buildInboxEmail, CONSENT_VERSION, INBOX } = await moduleOf(fs.readFileSync(new URL('../src/lib/forms.ts', import.meta.url), 'utf8'));

const base = { kind: 'newsletter', email: 'Asha@Example.in', consent: true, token: 'tok' };

test('newsletter: valid signup is normalised', () => {
  const r = validateSubmission(base);
  assert.equal(r.ok, true);
  assert.equal(r.value.email, 'asha@example.in');
});

test('rejects missing consent, bad email, missing token, unknown kind', () => {
  assert.deepEqual(validateSubmission({ ...base, consent: false }), { ok: false, error: 'consent' });
  assert.deepEqual(validateSubmission({ ...base, consent: 'true' }), { ok: false, error: 'consent' });
  assert.deepEqual(validateSubmission({ ...base, email: 'not-an-email' }), { ok: false, error: 'email' });
  assert.deepEqual(validateSubmission({ ...base, email: 'a@b' }), { ok: false, error: 'email' });
  assert.deepEqual(validateSubmission({ ...base, token: '' }), { ok: false, error: 'captcha' });
  assert.deepEqual(validateSubmission({ ...base, kind: 'other' }), { ok: false, error: 'invalid' });
  assert.deepEqual(validateSubmission(null), { ok: false, error: 'invalid' });
});

test('honeypot is flagged as spam before anything else', () => {
  assert.deepEqual(validateSubmission({ ...base, consent: false, website: 'http://spam' }), { ok: false, error: 'spam' });
});

test('enquiry keeps the brief, trims and caps long fields', () => {
  const r = validateSubmission({ kind: 'enquiry', email: 'r@x.com', name: '  Ravi  ', consent: true, token: 't', briefText: 'Brief', brief: { section: 'labs', context: 'x'.repeat(9000), unknown: 'dropped' } });
  assert.equal(r.ok, true);
  assert.equal(r.value.name, 'Ravi');
  assert.equal(r.value.brief.section, 'labs');
  assert.equal(r.value.brief.context.length, 4000);
  assert.equal('unknown' in r.value.brief, false);
});

test('inbox email: reply-to is the visitor and consent version is recorded', () => {
  const meta = { at: '2026-10-17T10:00:00Z', ip: '1.2.3.4', country: 'IN' };
  const news = buildInboxEmail(validateSubmission(base).value, meta);
  assert.equal(news.replyTo, 'asha@example.in');
  assert.match(news.subject, /^Newsletter signup: asha@example\.in$/);
  assert.match(news.text, new RegExp(`version ${CONSENT_VERSION}`));
  const enq = buildInboxEmail(validateSubmission({ kind: 'enquiry', email: 'r@x.com', name: 'Ravi', consent: true, token: 't', briefText: 'THE BRIEF', brief: { section: 'labs' } }).value, meta);
  assert.equal(enq.subject, 'Project enquiry (labs): Ravi');
  assert.match(enq.text, /THE BRIEF/);
  assert.equal(INBOX, 'info@nexaragroups.com');
});
