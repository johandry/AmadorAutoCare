import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const html = fs.readFileSync(new URL('../services/mechanical.html', import.meta.url), 'utf8');

test('shows the core mechanical-service path and the main conversion actions', () => {
  assert.match(html, /Mechanical services/i);
  assert.match(html, /Common repair categories/i);
  assert.match(html, /Request an appointment/i);
  assert.match(html, /Contact the shop/i);

  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(hrefs.some((href) => href.endsWith('appointment.html')));
  assert.ok(hrefs.some((href) => href.endsWith('contact.html')));
});

test('keeps the page honest about diagnosis and pricing expectations', () => {
  assert.match(html, /does not diagnose problems or promise pricing online/i);
  assert.doesNotMatch(html, /guaranteed.*price|final estimate|diagnosis complete/i);
});

test('offers service discovery in plain language that matches the PRD', () => {
  assert.match(html, /warning lights|routine maintenance|brake|engine|electrical/i);
  assert.match(html, /symptom, warning light, or maintenance concern/i);
});

test('keeps the path reachable without JavaScript and with valid local links', () => {
  assert.match(html, /href="\.\.\/appointment\.html"/i);
  assert.match(html, /href="\.\.\/contact\.html"/i);
  assert.match(html, /<main[^>]*id="main-content"/i);
});

test('does not promise booking or confirmed service times before staff confirmation', () => {
  assert.doesNotMatch(html, /booked|confirmed appointment|guaranteed time/i);
  assert.match(html, /request an appointment/i);
});
