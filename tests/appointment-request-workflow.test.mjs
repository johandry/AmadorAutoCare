import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const appointmentPage = fs.readFileSync(new URL('../appointment.html', import.meta.url), 'utf8');
const mainScript = fs.readFileSync(new URL('../assets/js/main.js', import.meta.url), 'utf8');
const functionSource = fs.readFileSync(new URL('../supabase/functions/submit-service-request/index.ts', import.meta.url), 'utf8');

test('collects the contact, vehicle, service, and preferred schedule details for an appointment request', () => {
  for (const field of ['name', 'phone', 'vehicle', 'date', 'timeWindow', 'service', 'notes']) {
    assert.match(appointmentPage, new RegExp(`name="${field}"`), `appointment form must include ${field}`);
  }
  assert.match(appointmentPage, /Preferred time window/);
  assert.match(appointmentPage, /Notes for the shop/);
});

test('keeps the requested date and time as a staff-confirmed request, never a booking', () => {
  assert.match(appointmentPage, /not booked until staff confirms/i);
  assert.match(mainScript, /Your appointment request was sent\. It is not booked until staff confirms it\./);
  assert.doesNotMatch(appointmentPage, /book now|confirmed appointment|guaranteed availability/i);
});

test('announces missing appointment fields and restores controls after delivery failures', () => {
  assert.match(appointmentPage, /data-request-type="appointment" novalidate/);
  assert.match(appointmentPage, /data-form-status role="status" aria-live="polite"/);
  assert.match(mainScript, /Please complete \$\{label\?\.trim\(\) \|\| 'the required fields'\} before sending your request\./);
  assert.match(mainScript, /We could not send your request\. Please try again or call the shop for next steps\./);
  assert.match(mainScript, /submitButton\?\.removeAttribute\('disabled'\)/);
});

test('prevents choosing a past appointment date in the browser', () => {
  assert.match(mainScript, /input\[type="date"\]\[name="date"\]/);
  assert.match(mainScript, /input\.min = today/);
});

test('rejects malformed, past, or unsupported appointment scheduling values server-side', () => {
  assert.match(functionSource, /appointment: \['name', 'phone', 'vehicle', 'date', 'timeWindow', 'service'\]/);
  assert.match(functionSource, /const appointmentTimeWindows/);
  assert.match(functionSource, /!appointmentTimeWindows\.has\(cleanFields\.timeWindow\)/);
  assert.match(functionSource, /cleanFields\.date < new Date\(\)\.toISOString\(\)\.slice\(0, 10\)/);
  assert.match(functionSource, /Invalid appointment request/);
});