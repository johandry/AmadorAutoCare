import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const aboutPage = fs.readFileSync(new URL('../about.html', import.meta.url), 'utf8');
const galleryPage = fs.readFileSync(new URL('../gallery.html', import.meta.url), 'utf8');
const businessFacts = JSON.parse(fs.readFileSync(new URL('../docs/business-facts.json', import.meta.url), 'utf8'));

test('publishes owner-approved experience, warranties, and language support only', () => {
  assert.equal(businessFacts.trust.credentials.status, 'pending');
  assert.equal(businessFacts.trust.insuranceRelationships.status, 'pending');
  assert.match(aboutPage, /hands-on experience serving local drivers/i);
  assert.match(aboutPage, /Parts warranty/);
  assert.match(aboutPage, /Labor warranty/);
  assert.match(aboutPage, /Service in English and Spanish/);
  assert.match(aboutPage, /Credential and insurance relationship information is being prepared\./);
  assert.doesNotMatch(aboutPage, /ASE certified|Manufacturer training/i);
});

test('provides a contact path from the trust journey without unsupported claims', () => {
  assert.match(aboutPage, /href="contact\.html">Contact Amador Auto Care/);
  assert.doesNotMatch(aboutPage, /[0-9]+ years|award-winning|best in|five-star|guaranteed/i);
});

test('uses a meaningful gallery empty state while approved project assets are unavailable', () => {
  assert.match(galleryPage, /There are no approved project photographs to show yet/i);
  assert.match(galleryPage, /authentic repair images only after confirming usage rights/i);
  assert.match(galleryPage, /license plates/i);
  assert.match(galleryPage, /href="contact\.html">Contact the shop/);
});

test('does not fabricate gallery images, before-and-after projects, or reviews', () => {
  assert.doesNotMatch(galleryPage, /<img\b/i);
  assert.doesNotMatch(galleryPage, /testimonial|review from|★★★★★|5\/5/i);
  assert.doesNotMatch(aboutPage, /testimonial|review from|★★★★★|5\/5/i);
});

test('keeps the gallery accessible without JavaScript', () => {
  assert.match(galleryPage, /<main id="main-content">/);
  assert.match(galleryPage, /aria-labelledby="gallery-empty-title"/);
  assert.match(galleryPage, /href="contact\.html"/);
});