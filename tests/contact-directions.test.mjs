import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contactPage = fs.readFileSync(path.join(projectRoot, 'contact.html'), 'utf8');
const businessFacts = JSON.parse(fs.readFileSync(path.join(projectRoot, 'docs/business-facts.json'), 'utf8'));

test('shows the only approved contact detail and usable email action', () => {
  assert.equal(businessFacts.business.displayName.status, 'approved');
  assert.equal(businessFacts.business.monitoredEmail.status, 'approved');
  assert.match(contactPage, new RegExp(businessFacts.business.monitoredEmail.value));
  assert.match(contactPage, /href="mailto:service@info\.amadorautocare\.com"/);
});

test('keeps phone, address, hours, and directions unavailable until owner confirmation', () => {
  for (const field of ['phone', 'address', 'regularHours', 'serviceArea']) {
    assert.equal(businessFacts.business[field].status, 'pending');
  }
  assert.match(contactPage, /Phone, address, hours, and directions will be published after owner confirmation\./);
  assert.doesNotMatch(contactPage, /href="tel:|google\.com\/maps|<iframe/i);
});

test('does not make unverified emergency, after-hours, or response-time promises', () => {
  assert.match(contactPage, /Hours, holiday scheduling, after-hours guidance, and emergency guidance are pending owner confirmation\./);
  assert.doesNotMatch(contactPage, /24\/?7|emergency service available|next-business-day follow-up/i);
});

test('keeps service requests distinct from a confirmed appointment', () => {
  assert.match(contactPage, /Appointment availability and response-time expectations are pending owner confirmation\./);
  assert.doesNotMatch(contactPage, /your appointment is confirmed|appointment booked|book now|guaranteed availability/i);
});

test('keeps email and service-request actions usable without JavaScript', () => {
  assert.match(contactPage, /href="mailto:service@info\.amadorautocare\.com"/);
  assert.match(contactPage, /href="estimate\.html"/);
  assert.match(contactPage, /href="appointment\.html"/);
  assert.match(contactPage, /<main id="main-content">/);
});