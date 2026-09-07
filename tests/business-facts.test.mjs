import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  readAndValidateBusinessFacts,
  validateBusinessFacts
} from '../scripts/validate-business-facts.mjs';
import inventory from '../docs/business-facts.json' with { type: 'json' };

const approval = {
  approvedBy: 'Test Owner',
  approvedOn: '2026-08-31',
  source: 'Owner interview test fixture'
};

function cloneInventory() {
  return structuredClone(inventory);
}

function approveAllFacts(data) {
  for (const [sectionName, section] of Object.entries(data)) {
    if (sectionName === 'schemaVersion' || sectionName === 'review') {
      continue;
    }

    for (const fact of Object.values(section)) {
      fact.status = 'approved';
      fact.value = Array.isArray(fact.value) ? ['Approved test value'] : 'Approved test value';
      fact.approval = { ...approval };
    }
  }

  data.review = { status: 'approved', ...approval };
  return data;
}

test('accepts the development inventory when every approved fact has provenance', () => {
  assert.deepEqual(validateBusinessFacts(cloneInventory()), []);
});

test('accepts a complete inventory when every publishable fact has approval provenance', () => {
  assert.deepEqual(validateBusinessFacts(approveAllFacts(cloneInventory())), []);
});

test('accepts an explicitly not-offered item when the decision has approval provenance', () => {
  const data = cloneInventory();
  data.policies.towing = {
    status: 'not-offered',
    value: null,
    approval: { ...approval }
  };

  assert.deepEqual(validateBusinessFacts(data), []);
});

test('rejects an approved fact without an approver, date, and source', () => {
  const data = cloneInventory();
  data.business.phone = {
    status: 'approved',
    value: 'Test phone',
    approval: null
  };

  assert.match(validateBusinessFacts(data).join('\n'), /business\.phone\.approval must identify/);
});

test('rejects publishable content placed in a pending fact', () => {
  const data = cloneInventory();
  data.business.address = {
    status: 'pending',
    value: 'Unapproved test address',
    approval: null
  };

  assert.match(validateBusinessFacts(data).join('\n'), /business\.address cannot contain publishable content/);
});

test('rejects an approved fact with an empty value', () => {
  const data = cloneInventory();
  data.services.mechanical = {
    status: 'approved',
    value: [],
    approval: { ...approval }
  };

  assert.match(validateBusinessFacts(data).join('\n'), /services\.mechanical\.value must contain/);
});

test('rejects approval dates outside the YYYY-MM-DD boundary', () => {
  const data = cloneInventory();
  data.business.displayName = {
    status: 'approved',
    value: 'Test display name',
    approval: { ...approval, approvedOn: '08/31/2026' }
  };

  assert.match(validateBusinessFacts(data).join('\n'), /approvedOn must use YYYY-MM-DD/);
});

test('rejects an inventory that omits a required S01 fact', () => {
  const data = cloneInventory();
  delete data.policies.responseTime;

  assert.match(validateBusinessFacts(data).join('\n'), /policies\.responseTime must be a fact object/);
});

test('rejects whole-inventory approval while any facts remain pending', () => {
  const data = cloneInventory();
  data.business.address = {
    status: 'pending',
    value: null,
    approval: null
  };
  data.review = { status: 'approved', ...approval };

  assert.match(validateBusinessFacts(data).join('\n'), /review cannot be approved while facts remain pending/);
});

test('rejects approval metadata attached to a pending review', () => {
  const data = cloneInventory();
  data.review = {
    status: 'pending',
    approvedBy: 'Test Owner',
    approvedOn: null,
    source: null
  };

  assert.match(validateBusinessFacts(data).join('\n'), /pending review cannot contain approval metadata/);
});

test('reports malformed JSON without throwing or contacting an external dependency', () => {
  const directory = mkdtempSync(join(tmpdir(), 'amador-facts-'));
  const filePath = join(directory, 'invalid.json');
  writeFileSync(filePath, '{ invalid json', 'utf8');

  assert.match(readAndValidateBusinessFacts(filePath).join('\n'), /could not read valid JSON/);
});