import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contactPage = fs.readFileSync(path.join(projectRoot, 'contact.html'), 'utf8');
const businessFacts = JSON.parse(fs.readFileSync(path.join(projectRoot, 'docs/business-facts.json'), 'utf8'));

test('shows owner-confirmed phone and hours with direct contact actions', () => {
  assert.match(contactPage, new RegExp(businessFacts.business.phone.value.replace(/[()]/g, '\\$&')));
  assert.match(contactPage, new RegExp(businessFacts.business.regularHours.value));
  assert.match(contactPage, /href="tel:\+15026440360"/);
  assert.match(contactPage, /href="mailto:service@info\.amadorautocare\.com"/);
});

test('withholds the address and directions until an appointment is confirmed', () => {
  assert.equal(businessFacts.business.address.status, 'pending');
  assert.match(contactPage, /The shop address is provided after an appointment is confirmed\./);
  assert.doesNotMatch(contactPage, /123 Generic Street|Luisville|google\.com\/maps|<iframe/i);
});

test('sets clear holiday, after-hours, and unsafe-to-drive expectations', () => {
  assert.match(contactPage, /Holiday hours are communicated by phone and website updates as needed\./);
  assert.match(contactPage, /After-hours issues are addressed by voicemail and next-business-day follow-up\./);
  assert.match(contactPage, /If your vehicle is unsafe to drive, call for next steps before operating it\./);
  assert.doesNotMatch(contactPage, /24\/?7|emergency service available/i);
});

test('keeps service requests distinct from a confirmed appointment', () => {
  assert.match(contactPage, /scheduled based on repair type and technician availability/i);
  assert.doesNotMatch(contactPage, /your appointment is confirmed|appointment booked|book now|guaranteed availability/i);
});

test('keeps call and service-request actions usable without JavaScript', () => {
  assert.match(contactPage, /href="tel:\+15026440360"/);
  assert.match(contactPage, /href="estimate\.html"/);
  assert.match(contactPage, /href="appointment\.html"/);
  assert.match(contactPage, /<main id="main-content">/);
});