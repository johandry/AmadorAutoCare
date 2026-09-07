import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const robots = fs.readFileSync(new URL('../robots.txt', import.meta.url), 'utf8');
const sitemap = fs.readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
const manifest = JSON.parse(fs.readFileSync(new URL('../site.webmanifest', import.meta.url), 'utf8'));
const favicon = fs.readFileSync(new URL('../assets/images/favicon.svg', import.meta.url), 'utf8');
const inventory = JSON.parse(fs.readFileSync(new URL('../docs/business-facts.json', import.meta.url), 'utf8'));

const indexedPaths = [
  '/', 'services/mechanical.html', 'services/body-collision.html', 'about.html',
  'gallery.html', 'faq.html', 'contact.html', 'estimate.html', 'appointment.html', 'privacy.html'
];

test('allows search crawlers and points them to the HTTPS production sitemap', () => {
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/amadorautocare\.com\/sitemap\.xml/);
});

test('lists every public route once with HTTPS canonical URLs', () => {
  for (const route of indexedPaths) {
    const url = `https://amadorautocare.com${route === '/' ? '/' : `/${route}`}`;
    assert.equal(sitemap.split(`<loc>${url}</loc>`).length - 1, 1, `${route} must appear once in the sitemap`);
  }
  assert.doesNotMatch(sitemap, /<loc>http:\/\//);
});

test('provides a lightweight branded favicon and web manifest', () => {
  assert.match(favicon, /<svg/);
  assert.equal(manifest.name, 'Amador Auto Care');
  assert.equal(manifest.icons[0].src, 'assets/images/favicon.svg');
});

test('does not publish AutoRepair structured data while the inventory is demo sample content', () => {
  assert.equal(inventory.review.source, 'Development demo sample values');
  assert.doesNotMatch(sitemap, /AutoRepair|aggregateRating|openingHours/i);
});