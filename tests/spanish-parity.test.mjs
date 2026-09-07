import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const englishHome = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const spanishFiles = [
  'index.html', 'about.html', 'gallery.html', 'faq.html', 'contact.html',
  'estimate.html', 'appointment.html', 'privacy.html',
  'services/mechanical.html', 'services/body-collision.html'
];

function spanishPage(path) {
  return fs.readFileSync(new URL(`../es/${path}`, import.meta.url), 'utf8');
}

test('provides a Spanish entry point from English Home and reciprocal English links', () => {
  assert.match(englishHome, /lang="es" hreflang="es" href="es\/index\.html">Español/);
  for (const path of spanishFiles) {
    assert.match(spanishPage(path), /<html lang="es">/, `${path} must declare Spanish`);
    assert.match(spanishPage(path), /lang="en" hreflang="en"[^>]*>English/, `${path} must link to English`);
  }
});

test('includes Spanish equivalents for every core customer route', () => {
  for (const path of spanishFiles) {
    assert.match(spanishPage(path), /<main id="main-content">/, `${path} must retain its main landmark`);
    assert.match(spanishPage(path), /<title>[^<]+<\/title>/, `${path} must retain a title`);
  }
});

test('keeps estimate and appointment request contracts equivalent in Spanish', () => {
  const estimate = spanishPage('estimate.html');
  const appointment = spanishPage('appointment.html');
  for (const field of ['name', 'email', 'vehicle', 'category', 'preferredContact', 'safeToDrive', 'description']) {
    assert.match(estimate, new RegExp(`name="${field}"`));
  }
  for (const field of ['name', 'phone', 'vehicle', 'date', 'timeWindow', 'service', 'notes']) {
    assert.match(appointment, new RegExp(`name="${field}"`));
  }
  assert.match(appointment, /no estan reservados hasta que el personal los confirme/i);
});

test('preserves the Spanish privacy and no-booking boundaries', () => {
  assert.match(spanishPage('privacy.html'), /Supabase procesa las solicitudes/i);
  assert.match(spanishPage('privacy.html'), /se eliminan despues de 90 dias/i);
  assert.match(spanishPage('privacy.html'), /cargas de fotos y los analiticos de produccion no estan activados/i);
  assert.match(spanishPage('privacy.html'), /mailto:service@info\.amadorautocare\.com/);
  assert.doesNotMatch(spanishPage('appointment.html'), /cita confirmada|reservacion confirmada/i);
});