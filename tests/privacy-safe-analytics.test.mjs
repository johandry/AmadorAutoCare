import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const mainScript = fs.readFileSync(new URL('../assets/js/main.js', import.meta.url), 'utf8');
const config = fs.readFileSync(new URL('../assets/js/analytics-config.js', import.meta.url), 'utf8');
const documentation = fs.readFileSync(new URL('../docs/ANALYTICS.md', import.meta.url), 'utf8');
const privacyPage = fs.readFileSync(new URL('../privacy.html', import.meta.url), 'utf8');

test('loads Google Analytics only after visitor consent when a valid Measurement ID is configured', () => {
  assert.match(config, /googleMeasurementId: 'G-[A-Z0-9]+'/);
  assert.match(mainScript, /www\.googletagmanager\.com\/gtag\/js\?id=/);
  assert.match(mainScript, /amador-analytics-consent/);
  assert.match(mainScript, /localStorage\.getItem\('amador-analytics-consent'\) !== 'granted'/);
});

test('emits only the approved aggregate conversion event names', () => {
  for (const eventName of ['click_call', 'click_directions', 'click_estimate', 'click_appointment', 'form_start', 'form_submit', 'form_error', 'language_change']) {
    assert.match(mainScript, new RegExp(`'${eventName}'`));
  }
  assert.match(mainScript, /document\.dispatchEvent\(new CustomEvent\('amadoranalytics'/);
});

test('limits conversion event context to page, form, and source without form values', () => {
  assert.match(mainScript, /const context = \{ page: globalThis\.location\?\.pathname \?\? '' \}/);
  assert.match(mainScript, /context\.form = details\.form/);
  assert.match(mainScript, /context\.source = details\.source/);
  assert.match(mainScript, /detail: \{ name, context \}/);
  assert.doesNotMatch(mainScript, /detail: \{[^}]+(email|phone|vehicle|description|FormData)/i);
  assert.match(mainScript, /window\.gtag\('event', name, context\)/);
});

test('documents Google Analytics consent and the custom-event privacy boundary', () => {
  assert.match(documentation, /Google Analytics 4 is the selected provider/i);
  assert.match(documentation, /explicitly allows analytics/i);
  assert.match(documentation, /Events are sent to Google Analytics only after explicit consent/i);
  assert.match(documentation, /never includes names, emails, phone numbers, vehicle data, free text/i);
  assert.doesNotMatch(documentation, /Cloudflare/i);
});