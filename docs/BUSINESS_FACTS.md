# Business Facts Approval Guide

[business-facts.json](business-facts.json) is the source of truth for owner-supplied content. It starts with every fact marked `pending` because no business value should be inferred from the product name, common industry practice, or third-party search results.

## Status Rules

- `pending`: The fact is unknown or awaiting approval. Keep scalar values `null`, list values empty, and `approval` set to `null`.
- `approved`: The owner has approved the exact publishable value. Include approval metadata.
- `not-offered`: The owner has explicitly confirmed that a service, policy, credential, warranty, payment option, insurance relationship, or asset does not apply. Keep `value` set to `null` and include approval metadata.

The top-level review remains `pending` until every fact is either `approved` or `not-offered`. The validator rejects a completed review while any fact remains pending.

## Approval Metadata

Every approved decision records:

```json
{
  "approvedBy": "Name of approving owner or delegate",
  "approvedOn": "YYYY-MM-DD",
  "source": "Owner interview, signed asset release, or controlled profile"
}
```

The source should identify evidence clearly enough to find it again. Do not place private documents, credentials, personal customer information, or secrets in this repository.

## Value Guidance

- Use strings for names, phone, email, policies, experience, URLs, ownership, and the logo path.
- Use arrays for service areas, service lists, exclusions, credentials, warranties, payments, insurance relationships, languages, review profiles, and imagery.
- Store regular hours as a day-by-day object so closed days and split hours are unambiguous.
- Store the address as structured lines, locality, region, postal code, and country once approved.
- For each image, record its repository path, purpose, descriptive alternative text, permission source, permission owner, and permission date.
- For the logo, record its repository path and the source confirming ownership or publication rights.
- Record only services the owner confirms. Common auto-care offerings are not evidence.
- Write response-time and estimate policies as expectations, not guarantees, unless the owner explicitly approves a guarantee.

## Owner Review Workflow

1. Interview the owner using every field in [business-facts.json](business-facts.json).
2. Leave unknown answers pending; never use guessed filler.
3. Add the exact publishable value and its approval metadata.
4. Mark confirmed non-applicable items `not-offered` rather than deleting required fields.
5. Run the focused checks:

```bash
node scripts/validate-business-facts.mjs
node --test tests/business-facts.test.mjs
```

1. When no facts remain pending, set the top-level review to `approved` with the final reviewer, date, and source.
2. Replace website placeholders only from approved inventory values in the relevant later slice.

## Asset Inventory Checklist

For each logo or image proposed for publication, confirm:

- The file is authentic and useful for the page where it will appear.
- The business owns it or has written permission to publish it.
- Customers, staff, property, and license plates have appropriate permission or redaction.
- Sensitive metadata is removed where appropriate.
- The original is retained outside the web derivatives if required.
- A descriptive filename and intended alternative text are recorded.

## Boundary Examples

- An owner gives a phone number but has not approved publication: keep it out of the repository and leave the fact pending.
- A service is believed to be typical for repair shops: leave it pending until confirmed.
- The business does not offer towing: mark towing `not-offered` with approval metadata.
- A review profile is found online but ownership is uncertain: leave it pending.
- An image is authentic but publication rights are unclear: do not add it to `assets/images/`; leave the asset pending.
