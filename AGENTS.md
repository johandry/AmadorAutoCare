# Amador Auto Care Project Context

Read this file, [PRD.md](PRD.md), and [docs/SLICES.md](docs/SLICES.md) before making changes. Update this file when architecture, conventions, dependencies, or implementation state changes.

## Product

Amador Auto Care is a mobile-first website for an auto repair and body-work business. Its primary customer actions are calling, requesting an estimate, requesting an appointment, and getting directions.

Business facts are not yet verified. Never invent a phone number, address, hours, service, credential, warranty, price, review, response time, or image. Keep an explicit placeholder until the owner approves the value.

## Architecture Decisions

- Use semantic, multi-page HTML with shared CSS and minimal vanilla JavaScript.
- Do not introduce a frontend framework, build step, package manager, or runtime dependency without an accepted slice requiring it.
- Host on GitHub Pages. Keep links relative so the repository subpath works before a custom domain exists.
- Preserve useful content and navigation when JavaScript is unavailable.
- GitHub Pages provides no backend. Production forms require an approved third-party processor.
- Until that processor is selected, forms use `data-demo-form`: they validate in the browser, transmit nothing, and state this clearly.
- Do not place secrets, private keys, personal form values, or sensitive customer data in Git, URLs, analytics, or client code.
- Use authentic owner-approved visual assets. A clear placeholder is preferable to fabricated or generic proof-of-work imagery.

## Repository Map

```text
/
|-- index.html                 Home
|-- services/                  Service detail pages
|-- assets/css/styles.css      Shared visual system
|-- assets/js/main.js          Progressive enhancements
|-- assets/images/             Approved production imagery
|-- docs/business-facts.json   Approved-content source of truth
|-- docs/SLICES.md             Ordered implementation backlog
|-- scripts/check-site.mjs     Dependency-free static checks
|-- PRD.md                     Product source of truth
`-- AGENTS.md                  Session context and current state
```

## Conventions

- Use lowercase kebab-case file names and relative `.html` links.
- Every page needs a unique title, meta description, one main landmark, and a descriptive H1.
- Full-navigation pages include a skip link and expose the current page with `aria-current="page"`.
- Keep tap targets at least 44 by 44 CSS pixels and maintain visible keyboard focus.
- Use CSS custom properties from `:root`; extend the existing visual language before adding variants.
- Keep JavaScript optional, small, and defensive. Check that elements exist before enhancing them.
- Form errors and status changes must be textual and programmatically announced.
- Do not add inline comments unless behavior is genuinely non-obvious.
- Mark unfinished behavior honestly in both UI copy and slice status.

## Validation

Run from the repository root after relevant changes:

```bash
node scripts/check-site.mjs
node scripts/validate-business-facts.mjs
node --test tests/business-facts.test.mjs
node --check assets/js/main.js
git diff --check
```

For visual work, serve the repository locally and test at 320px, 375px, 768px, 1024px, and a wide desktop viewport. Perform keyboard testing and confirm the site remains understandable without JavaScript.

## Current State

- Walking skeleton is implemented across 11 HTML routes.
- Home connects both service paths to representative request journeys.
- Responsive shared styling and accessible mobile navigation are present.
- Estimate and appointment forms validate locally but intentionally send no data.
- The S01 business-facts inventory, approval workflow, validator, and tests are implemented.
- The S02 shared shell and navigation is implemented and validated.
- The S03 home conversion journey is implemented and validated with clear routes to estimate and appointment requests.
- Every business fact remains pending owner approval, so S01 is blocked and no customer-facing placeholders were replaced.
- Form provider, analytics provider, production URL, and Spanish scope also remain unresolved.
- Next action: complete **S01 Business Facts and Content Inputs** with the owner using [docs/BUSINESS_FACTS.md](docs/BUSINESS_FACTS.md).

## Session Handoff Rule

At the end of each implementation slice:

1. Run the slice's validation and the baseline checks above.
2. Update status and notes in [docs/SLICES.md](docs/SLICES.md).
3. Update **Current State** here if capabilities, decisions, blockers, or the next slice changed.
4. Keep unrelated future-slice work out of the change.
