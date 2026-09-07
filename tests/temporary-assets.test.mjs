import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const homePage = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const mechanicalPage = fs.readFileSync(new URL('../services/mechanical.html', import.meta.url), 'utf8');
const bodyCollisionPage = fs.readFileSync(new URL('../services/body-collision.html', import.meta.url), 'utf8');
const galleryPage = fs.readFileSync(new URL('../gallery.html', import.meta.url), 'utf8');
const assetPolicy = fs.readFileSync(new URL('../docs/TEMPORARY_ASSETS.md', import.meta.url), 'utf8');

test('uses generic service illustrations only where they are explicitly labeled as temporary', () => {
  assert.match(homePage, /Temporary stock illustration\. Owner-approved shop imagery will replace it before production release\./);
  assert.match(mechanicalPage, /Temporary stock illustration, not work performed by Amador Auto Care\./);
  assert.match(bodyCollisionPage, /Temporary stock illustration, not work performed by Amador Auto Care\./);
  assert.match(homePage, /images\.unsplash\.com/);
  assert.match(mechanicalPage, /images\.unsplash\.com/);
  assert.match(bodyCollisionPage, /images\.unsplash\.com/);
});

test('provides descriptive alternative text and fixed dimensions for temporary illustrations', () => {
  for (const page of [homePage, mechanicalPage, bodyCollisionPage]) {
    assert.match(page, /<img[^>]+width="[0-9]+"[^>]+height="[0-9]+"[^>]+alt="[^"]+"/);
  }
});

test('does not use temporary stock imagery as gallery proof or reviews', () => {
  assert.doesNotMatch(galleryPage, /images\.unsplash\.com|<img\b|Temporary stock illustration/i);
  assert.doesNotMatch(galleryPage, /testimonial|review from|★★★★★|5\/5/i);
});

test('documents a mandatory replacement and rights review before production release', () => {
  assert.match(assetPolicy, /The values in .*business-facts\.json.* are development-demo samples\./);
  assert.match(assetPolicy, /Before production release, replace them with owner-confirmed values for:/);
  assert.match(assetPolicy, /Do not release the demo values as production business claims\./);
  assert.match(assetPolicy, /Before a production release, replace every temporary illustration with owner-approved Amador Auto Care imagery\./);
  assert.match(assetPolicy, /owner or license source, usage permission, descriptive caption, dimensions, alternative text/i);
  assert.match(assetPolicy, /customer names, faces, VINs, or license plates/i);
});