import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const requiredSections = {
  business: ['legalName', 'displayName', 'address', 'phone', 'monitoredEmail', 'serviceArea', 'regularHours', 'holidayHoursProcess'],
  services: ['mechanical', 'bodyCollision', 'excludedWork'],
  policies: ['emergency', 'unsafeToDrive', 'afterHours', 'towing', 'estimate', 'appointment', 'responseTime'],
  trust: ['experience', 'credentials', 'warranties', 'paymentOptions', 'insuranceRelationships', 'languagesSpoken'],
  onlinePresence: ['controlledDomain', 'googleBusinessProfile', 'reviewProfiles', 'contentMaintenanceOwner'],
  brandAssets: ['logo', 'imagery']
};

const validStatuses = new Set(['pending', 'approved', 'not-offered']);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function hasContent(value) {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== null && value !== undefined;
}

function validateApproval(approval, path, errors) {
  if (!approval || typeof approval !== 'object') {
    errors.push(`${path}.approval must identify who approved the fact, when, and from which source`);
    return;
  }

  for (const field of ['approvedBy', 'approvedOn', 'source']) {
    if (typeof approval[field] !== 'string' || approval[field].trim() === '') {
      errors.push(`${path}.approval.${field} must be a non-empty string`);
    }
  }

  if (typeof approval.approvedOn === 'string' && !datePattern.test(approval.approvedOn)) {
    errors.push(`${path}.approval.approvedOn must use YYYY-MM-DD`);
  }
}

export function validateBusinessFacts(data) {
  const errors = [];
  const pendingFacts = [];

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return ['inventory must be a JSON object'];
  }

  if (data.schemaVersion !== 1) {
    errors.push('schemaVersion must be 1');
  }

  for (const [sectionName, fields] of Object.entries(requiredSections)) {
    const section = data[sectionName];
    if (!section || typeof section !== 'object' || Array.isArray(section)) {
      errors.push(`${sectionName} must be an object`);
      continue;
    }

    for (const fieldName of fields) {
      const path = `${sectionName}.${fieldName}`;
      const fact = section[fieldName];

      if (!fact || typeof fact !== 'object' || Array.isArray(fact)) {
        errors.push(`${path} must be a fact object`);
        continue;
      }

      if (!validStatuses.has(fact.status)) {
        errors.push(`${path}.status must be pending, approved, or not-offered`);
        continue;
      }

      if (fact.status === 'pending') {
        pendingFacts.push(path);
        if (hasContent(fact.value) || fact.approval !== null) {
          errors.push(`${path} cannot contain publishable content or approval while pending`);
        }
        continue;
      }

      if (fact.status === 'approved' && !hasContent(fact.value)) {
        errors.push(`${path}.value must contain approved publishable content`);
      }

      if (fact.status === 'not-offered' && fact.value !== null) {
        errors.push(`${path}.value must be null when status is not-offered`);
      }

      validateApproval(fact.approval, path, errors);
    }
  }

  const review = data.review;
  if (!review || typeof review !== 'object') {
    errors.push('review must be an object');
  } else if (!['pending', 'approved'].includes(review.status)) {
    errors.push('review.status must be pending or approved');
  } else if (review.status === 'approved') {
    validateApproval(review, 'review', errors);
    if (pendingFacts.length > 0) {
      errors.push(`review cannot be approved while facts remain pending: ${pendingFacts.join(', ')}`);
    }
  } else if (review.approvedBy !== null || review.approvedOn !== null || review.source !== null) {
    errors.push('pending review cannot contain approval metadata');
  }

  return errors;
}

export function readAndValidateBusinessFacts(filePath) {
  let data;
  try {
    data = JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    return [`could not read valid JSON: ${error.message}`];
  }

  return validateBusinessFacts(data);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const filePath = process.argv[2] ?? 'docs/business-facts.json';
  const errors = readAndValidateBusinessFacts(filePath);

  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`Business facts validation passed: ${filePath}`);
  }
}