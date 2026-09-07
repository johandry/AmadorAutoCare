# Amador Auto Care

Static, mobile-first website for an auto care business offering mechanical and body-work services. The project uses vanilla HTML, CSS, and JavaScript and is intended for GitHub Pages.

## Current Stage

The walking skeleton is implemented. Estimate and appointment forms submit through a configured Supabase Edge Function; until its endpoint is configured, they show a clear call fallback and transmit nothing.

- Product requirements: [PRD.md](PRD.md)
- Delivery slices: [docs/SLICES.md](docs/SLICES.md)
- Architecture and session context: [AGENTS.md](AGENTS.md)
- Supabase setup: [docs/SUPABASE.md](docs/SUPABASE.md)

## Local Preview

From the repository root:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`.

## Validation

```bash
node scripts/check-site.mjs
node scripts/validate-business-facts.mjs
node --test tests/business-facts.test.mjs
node --check assets/js/main.js
git diff --check
```

## Delivery Workflow

Work one slice at a time from [docs/SLICES.md](docs/SLICES.md). Before implementation, resolve that slice's dependencies and owner decisions. At handoff, update slice status and the current state in [AGENTS.md](AGENTS.md).
