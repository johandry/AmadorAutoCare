import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const page = fs.readFileSync(new URL('../services/body-collision.html', import.meta.url), 'utf8');

test('shows approved body and collision services with estimate and call actions', () => {
  for (const service of ['Minor dent repair', 'Collision estimates', 'Paint matching']) {
    assert.match(page, new RegExp(service));
  }
  assert.match(page, /href="\.\.\/estimate\.html">Request an estimate/);
  assert.match(page, /href="tel:\+15026440360">Call 502 644 0360/);
});

test('explains inspection and photo limitations without promising a binding estimate', () => {
  assert.match(page, /in-person inspection may be required before a final estimate/i);
  assert.match(page, /Photos may help staff understand the request, but hidden damage can require inspection/i);
  assert.match(page, /does not provide a binding estimate/i);
  assert.doesNotMatch(page, /guaranteed estimate|final price|instant quote/i);
});

test('keeps insurance guidance accurate while no insurance relationships are offered', () => {
  assert.match(page, /Insurance relationships are not currently offered/i);
  assert.doesNotMatch(page, /insurance claim coordination|approved insurer|insurance partner/i);
});

test('keeps the core collision journey available without JavaScript', () => {
  assert.match(page, /<main id="main-content">/);
  assert.match(page, /href="\.\.\/estimate\.html"/);
  assert.match(page, /href="tel:\+15026440360"/);
});