# Amador Auto Care

Static, mobile-first website for an auto care business offering mechanical and body-work services. The project uses vanilla HTML, CSS, and JavaScript and is intended for GitHub Pages.

## Current Stage

The walking skeleton is implemented. All planned MVP routes exist and the two request forms validate locally, but they intentionally transmit no information until a form provider and privacy terms are approved.

- Product requirements: [PRD.md](PRD.md)
- Delivery slices: [docs/SLICES.md](docs/SLICES.md)
- Architecture and session context: [AGENTS.md](AGENTS.md)

## Local Preview

From the repository root:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`.

## Validation

```bash
node scripts/check-site.mjs
node --check assets/js/main.js
git diff --check
```

## Delivery Workflow

Work one slice at a time from [docs/SLICES.md](docs/SLICES.md). Before implementation, resolve that slice's dependencies and owner decisions. At handoff, update slice status and the current state in [AGENTS.md](AGENTS.md).
