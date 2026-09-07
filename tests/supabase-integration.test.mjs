import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const mainScript = fs.readFileSync(new URL('../assets/js/main.js', import.meta.url), 'utf8');
const estimatePage = fs.readFileSync(new URL('../estimate.html', import.meta.url), 'utf8');
const appointmentPage = fs.readFileSync(new URL('../appointment.html', import.meta.url), 'utf8');
const functionSource = fs.readFileSync(new URL('../supabase/functions/submit-service-request/index.ts', import.meta.url), 'utf8');
const migration = fs.readFileSync(new URL('../supabase/migrations/20260906000000_create_service_requests.sql', import.meta.url), 'utf8');
const retentionMigration = fs.readFileSync(new URL('../supabase/migrations/20260906010000_add_request_retention.sql', import.meta.url), 'utf8');
const privacyPage = fs.readFileSync(new URL('../privacy.html', import.meta.url), 'utf8');

test('sends estimate and appointment forms through the configured service endpoint', () => {
  assert.match(estimatePage, /data-service-request-form data-request-type="estimate"/);
  assert.match(appointmentPage, /data-service-request-form data-request-type="appointment"/);
  assert.match(mainScript, /fetch\(serviceRequestEndpoint/);
  assert.match(mainScript, /Object\.fromEntries\(new FormData\(form\)\.entries\(\)\)/);
});

test('keeps the request flow recoverable when endpoint configuration or delivery fails', () => {
  assert.match(mainScript, /Online requests are not configured yet\. Please call the shop for next steps\./);
  assert.match(mainScript, /We could not send your request\. Please try again or call the shop for next steps\./);
  assert.match(mainScript, /submitButton\?\.setAttribute\('disabled'/);
  assert.match(mainScript, /finally \{/);
});

test('does not imply an appointment is booked after a successful request', () => {
  assert.match(mainScript, /not booked until staff confirms it/);
  assert.doesNotMatch(appointmentPage, /confirmed appointment|book now/i);
});

test('keeps request storage private and rate-limited behind the Edge Function', () => {
  assert.match(migration, /enable row level security/);
  assert.match(migration, /revoke all on table public\.service_requests from anon, authenticated/);
  assert.match(migration, /interval '15 minutes'/);
  assert.match(functionSource, /ALLOWED_ORIGIN/);
  assert.match(functionSource, /fields\.website/);
  assert.match(functionSource, /submit_service_request/);
});

test('retains active requests and deletes only completed requests after 90 days', () => {
  assert.match(retentionMigration, /status in \('new', 'in_progress', 'completed'\)/);
  assert.match(retentionMigration, /status = 'completed'/);
  assert.match(retentionMigration, /completed_at < now\(\) - interval '90 days'/);
  assert.match(retentionMigration, /revoke all on function public\.purge_completed_service_requests\(\)/);
});

test('discloses the retention policy, review cadence, and monitored privacy contact', () => {
  assert.match(privacyPage, /review new requests at least every four hours/i);
  assert.match(privacyPage, /Completed service requests are deleted after 90 days/i);
  assert.match(privacyPage, /mailto:service@info\.amadorautocare\.com/);
});