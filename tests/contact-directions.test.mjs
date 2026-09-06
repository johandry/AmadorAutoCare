import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contactPage = fs.readFileSync(path.join(projectRoot, 'contact.html'), 'utf8');
const businessFacts = JSON.parse(fs.readFileSync(path.join(projectRoot, 'docs/business-facts.json'), 'utf8'));

test('shows the approved contact details and direct customer actions', () => {
  assert.match(contactPage, new RegExp(businessFacts.business.phone.value.replace(/[()]/g, '\\$&')));
  assert.match(contactPage, new RegExp(businessFacts.business.address.value));
  assert.match(contactPage, new RegExp(businessFacts.business.regularHours.value));
  assert.match(contactPage, /href="tel:\+15551234567"/);
  assert.match(contactPage, /href="mailto:service@info\.amadorautocare\.com"/);
  assert.match(contactPage, /Get directions/);
});

test('uses a lightweight external directions action without exposing a map API key', () => {
  assert.match(contactPage, /https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=123\+Generic\+Street%2C\+Luisville%2C\+KY/);
  assert.doesNotMatch(contactPage, /maps\.googleapis\.com|apiKey|AIza/i);
  assert.doesNotMatch(contactPage, /<iframe/i);
});

test('sets clear holiday, after-hours, and unsafe-to-drive expectations', () => {
  assert.match(contactPage, /Holiday hours are communicated by phone and website updates as needed\./);
  assert.match(contactPage, /After-hours issues are addressed by voicemail and next-business-day follow-up\./);
  assert.match(contactPage, /If your vehicle is unsafe to drive, call for next steps before operating it\./);
  assert.doesNotMatch(contactPage, /24\/?7|emergency service available/i);
});

test('keeps service requests distinct from a confirmed appointment', () => {
  assert.match(contactPage, /scheduled based on repair type and technician availability/i);
  assert.doesNotMatch(contactPage, /confirmed appointment|book now|guaranteed availability/i);
});

test('keeps call, directions, and service-request actions usable without JavaScript', () => {
  assert.match(contactPage, /href="tel:\+15551234567"/);
  assert.match(contactPage, /href="https:\/\/www\.google\.com\/maps\/search/);
  assert.match(contactPage, /href="estimate\.html"/);
  assert.match(contactPage, /href="appointment\.html"/);
  assert.match(contactPage, /<main id="main-content">/);
});