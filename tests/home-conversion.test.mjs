import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('shows the core home conversion journey with both service paths and request actions', () => {
  assert.match(html, /Amador Auto Care/i);
  assert.match(html, /Mechanical services/i);
  assert.match(html, /Body.*collision.*repair/i);
  assert.match(html, /Request an estimate/i);
  assert.match(html, /Request an appointment/i);

  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(hrefs.some((href) => href.includes('services/mechanical.html')));
  assert.ok(hrefs.some((href) => href.includes('services/body-collision.html')));
  assert.ok(hrefs.some((href) => href.includes('estimate.html')));
  assert.ok(hrefs.some((href) => href.includes('appointment.html')));
});

test('shows confirmed contact information while withholding the address', () => {
  assert.match(html, /502 644 0360/);
  assert.match(html, /Monday-Friday from 9:00 AM to 5:00 PM/);
  assert.match(html, /Louisville, KY and surrounding communities/);
  assert.match(html, /shop address is provided after an appointment is confirmed/i);
  assert.doesNotMatch(html, /123 Generic Street|Get directions/i);
  assert.doesNotMatch(html, /guaranteed availability|final price|confirmed booking/i);
  assert.doesNotMatch(html, /call now|book now/i);
});

test('keeps the primary conversion paths accessible without JavaScript', () => {
  assert.match(html, /href="estimate\.html"/i);
  assert.match(html, /href="appointment\.html"/i);
  assert.match(html, /href="services\/mechanical\.html"/i);
  assert.match(html, /href="services\/body-collision\.html"/i);
});

test('includes a clear service-area and next-step message in the first viewport', () => {
  assert.match(html, /service area|Need to talk\?|How can we help\?/i);
  assert.match(html, /mechanical.*body repair|repair.*next step/i);
});
