import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const mainScript = fs.readFileSync(new URL('../assets/js/main.js', import.meta.url), 'utf8');
const config = fs.readFileSync(new URL('../assets/js/analytics-config.js', import.meta.url), 'utf8');
const documentation = fs.readFileSync(new URL('../docs/ANALYTICS.md', import.meta.url), 'utf8');
const privacyPage = fs.readFileSync(new URL('../privacy.html', import.meta.url), 'utf8');

test('keeps Cloudflare analytics disabled until a public beacon token is configured', () => {
  assert.match(config, /cloudflareBeaconToken: ''/);
  assert.match(mainScript, /static\.cloudflareinsights\.com\/beacon\.min\.js/);
  assert.match(mainScript, /if \(!token/);
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
});

test('documents Cloudflare page analytics and the custom-event privacy boundary', () => {
  assert.match(documentation, /Cloudflare Web Analytics is the selected provider/i);
  assert.match(documentation, /Cloudflare beacon records page analytics only/i);
  assert.match(documentation, /never includes names, emails, phone numbers, vehicle data, free text/i);
  assert.match(privacyPage, /Cloudflare Web Analytics is selected for aggregate page analytics/i);
  assert.match(privacyPage, /remains disabled until its public beacon token is configured/i);
  assert.match(privacyPage, /do not send service-request details or form values to analytics/i);
});