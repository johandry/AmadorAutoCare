import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const estimatePage = fs.readFileSync(new URL('../estimate.html', import.meta.url), 'utf8');
const mainScript = fs.readFileSync(new URL('../assets/js/main.js', import.meta.url), 'utf8');
const functionSource = fs.readFileSync(new URL('../supabase/functions/submit-service-request/index.ts', import.meta.url), 'utf8');
const duplicateMigration = fs.readFileSync(new URL('../supabase/migrations/20260907000000_prevent_duplicate_service_requests.sql', import.meta.url), 'utf8');

test('collects the useful estimate details needed for a qualified request', () => {
  for (const field of ['name', 'email', 'vehicle', 'category', 'preferredContact', 'safeToDrive', 'description']) {
    assert.match(estimatePage, new RegExp(`name="${field}"`), `estimate form must include ${field}`);
  }
  assert.match(estimatePage, /Preferred contact method/);
  assert.match(estimatePage, /Is the vehicle safe to drive\?/);
});

test('keeps safety and estimate boundaries clear without offering photo upload', () => {
  assert.match(estimatePage, /If the vehicle is unsafe to drive, call for next steps before operating it\./);
  assert.match(estimatePage, /Photo uploads are not available\./);
  assert.match(estimatePage, /does not provide a diagnosis or create a binding estimate/i);
  assert.doesNotMatch(estimatePage, /type="file"/i);
});

test('describes invalid, duplicate, and delivery-failure states in accessible text', () => {
  assert.match(estimatePage, /src="assets\/js\/main\.js\?v=20260907" defer/);
  assert.match(estimatePage, /data-request-type="estimate" novalidate/);
  assert.match(mainScript, /form\.addEventListener\('invalid', \(event\) =>/);
  assert.match(mainScript, /\}, true\);/);
  assert.match(mainScript, /const invalidField = form\.querySelector\(':invalid'\);/);
  assert.match(mainScript, /invalidField\?\.focus\(\);/);
  assert.match(mainScript, /Please complete \$\{label\?\.trim\(\) \|\| 'the required fields'\} before sending your request\./);
  assert.match(mainScript, /error\?\.message === 'duplicate'/);
  assert.match(mainScript, /This request was already received\. Please call the shop if you need to add information\./);
  assert.match(mainScript, /We could not send your request\. Please try again or call the shop for next steps\./);
  assert.match(estimatePage, /data-form-status role="status" aria-live="polite"/);
});

test('validates estimate values on the Edge Function before storage', () => {
  assert.match(functionSource, /estimate: \['name', 'email', 'vehicle', 'category', 'preferredContact', 'safeToDrive', 'description'\]/);
  assert.match(functionSource, /const estimateCategories/);
  assert.match(functionSource, /const preferredContactMethods/);
  assert.match(functionSource, /const driveSafetyResponses/);
  assert.match(functionSource, /Invalid estimate request/);
});

test('prevents duplicate estimate submissions within the defined time window', () => {
  assert.match(duplicateMigration, /fields = p_fields/);
  assert.match(duplicateMigration, /created_at > now\(\) - interval '15 minutes'/);
  assert.match(duplicateMigration, /raise exception 'duplicate request'/);
  assert.match(functionSource, /Duplicate request/);
});