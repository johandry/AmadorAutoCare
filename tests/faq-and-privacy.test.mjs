import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const faqPage = fs.readFileSync(new URL('../faq.html', import.meta.url), 'utf8');
const privacyPage = fs.readFileSync(new URL('../privacy.html', import.meta.url), 'utf8');

test('answers the core service, appointment, estimate, and urgent vehicle questions', () => {
  assert.match(faqPage, /Brake service, oil changes, diagnostics, tune-ups/i);
  assert.match(faqPage, /minor dent repair, collision estimates, or paint matching/i);
  assert.match(faqPage, /not booked until staff confirms/i);
  assert.match(faqPage, /in-person inspection before a final estimate/i);
  assert.match(faqPage, /unsafe to drive/i);
});

test('sets accurate timing and after-hours expectations without promising service', () => {
  assert.match(faqPage, /next-business-day follow-up/i);
  assert.match(faqPage, /Response time varies by repair urgency and current shop demand/i);
  assert.match(faqPage, /reviewed at least every four hours/i);
  assert.doesNotMatch(faqPage, /guaranteed response|24\/?7 emergency service|confirmed appointment/i);
});

test('explains collection purpose, Supabase processing, and completed-request retention', () => {
  assert.match(privacyPage, /contact, vehicle, service, scheduling, and notes details/i);
  assert.match(privacyPage, /only to review and respond to your request/i);
  assert.match(privacyPage, /Supabase processes and stores service requests/i);
  assert.match(privacyPage, /Completed service requests are deleted after 90 days/i);
});

test('provides a privacy contact and describes customer choices without enabling unsupported features', () => {
  assert.match(privacyPage, /correct, or request deletion of a service request/i);
  assert.match(privacyPage, /mailto:service@info\.amadorautocare\.com/);
  assert.match(privacyPage, /Photo uploads and production analytics are not enabled/i);
  assert.match(privacyPage, /do not sell service-request information/i);
  assert.doesNotMatch(privacyPage, /Google Analytics|Meta Pixel|file upload/i);
});

test('marks sample business content as development-only before production release', () => {
  assert.match(privacyPage, /development site is sample content/i);
  assert.match(privacyPage, /replace sample values and review this notice with qualified counsel/i);
});