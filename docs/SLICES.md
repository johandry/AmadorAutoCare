# Product Delivery Slices

This backlog turns the PRD into small, demonstrable vertical slices. Complete slices in order unless a dependency or owner decision explicitly changes the sequence. Each slice should leave the site deployable.

Status values: `DONE`, `NEXT`, `BLOCKED`, `READY`, `LATER`.

## Delivery Order

| ID | Status | Slice | Demonstrable outcome | Depends on |
| --- | --- | --- | --- | --- |
| S00 | DONE | Walking skeleton | All MVP routes load; service paths reach safe demo forms | None |
| S01 | DONE | Business facts and content inputs | Verified contact/service data replaces launch-blocking placeholders | Owner input |
| S02 | DONE | Shared shell and navigation | Production-ready responsive header, footer, service navigation, and mobile actions | S01 |
| S03 | DONE | Home conversion journey | Home explains the offer and routes users to the right action | S01, S02 |
| S04 | DONE | Mechanical service journey | Mechanical customers can identify a relevant need and request contact | S01, S02 |
| S05 | DONE | Body and collision journey | Collision customers understand process and request an estimate | S01, S02 |
| S06 | DONE | Contact and directions | Customers can call, confirm hours, and open accurate directions | S01, S02 |
| S07 | DONE | Form platform integration | A vetted provider securely accepts test submissions | Owner/provider decision |
| S08 | DONE | Estimate request workflow | Qualified estimate requests reach staff and receive acknowledgment | S01, S07 |
| S09 | DONE | Appointment request workflow | Appointment requests reach staff without implying confirmation | S01, S07 |
| S10 | DONE | Trust and proof | About, approved reviews, and real gallery work support confidence | Approved assets/claims |
| S11 | DONE | FAQ and privacy | Accurate FAQs and provider-specific privacy terms are published | S01, S07, analytics choice |
| S12 | DONE | Local SEO and sharing | Production metadata, schema, sitemap, robots, and social cards validate | Domain and verified data |
| S13 | READY | Privacy-safe analytics | Approved conversion events record no personal information | Analytics decision |
| S14 | READY | Spanish parity | Reviewed Spanish pages provide equivalent core journeys | Translation owner |
| S15 | LATER | Launch hardening and Pages release | Accessibility, compatibility, performance, and production checks pass | S01-S13 MVP slices |
| S16 | BLOCKED | Verified content activation | Owner-provided location, profiles, and authentic assets replace pending states | Owner input |

## S00: Walking Skeleton

**Status:** DONE

**Outcome:** A customer can load Home, choose mechanical or body repair, reach the appropriate request route, validate representative fields, and receive an honest local-only acknowledgment.

**Included:**

- Eleven linked HTML routes, shared CSS, and minimal JavaScript.
- Mobile navigation, skip links, landmarks, focus styles, and reduced-motion handling.
- Demo-only estimate and appointment forms that transmit no data.
- Empty and placeholder states for unverified business content.
- Dependency-free structural and internal-link validation.

**Acceptance gate:** `node scripts/check-site.mjs` and JavaScript syntax checks pass.

## S01: Business Facts and Content Inputs

**Status:** DONE

**Goal:** Establish a dated, owner-approved source of truth before customer-facing feature work.

**Inputs required:**
- Legal/display name, address, phone, monitored email, service area, regular hours, and holiday-hours process.
- Confirmed mechanical and body/collision services plus excluded work.
- Emergency, unsafe-to-drive, after-hours, towing, estimate, appointment, and response-time policies.
- Verifiable experience, credentials, warranties, payment options, insurance relationships, and languages spoken.
- Controlled domain, Google Business Profile, review profiles, and content maintenance owner.
- Approved logo and initial authentic imagery inventory with usage permissions.

**Deliverable:** Add a structured content inventory under `docs/`, record approval date/source, and replace only globally verified skeleton placeholders.

**Acceptance gate:** Owner explicitly approves every value marked publishable; unknown values remain visibly unresolved.

**Implementation note:** The structured inventory, approval guide, validator, and automated tests are complete. Future owner-provided facts are handled in S16.

## S02: Shared Shell and Navigation

**Status:** DONE

**PRD coverage:** FR-01, FR-02, FR-04, FR-12, FR-15.

**Outcome:** Every core page has a consistent header/footer, service navigation, verified contact affordances, current-page state, and an ergonomic mobile menu.

**Acceptance gate:** Keyboard and touch navigation work at target widths; no content or controls overflow; no-JavaScript navigation remains usable.

## S03: Home Conversion Journey

**Status:** READY

**PRD coverage:** Home requirements, primary journeys 1-5.

**Outcome:** The first viewport identifies the business and location, presents authentic imagery, separates mechanical from collision needs, and prioritizes approved conversion actions.

**Acceptance gate:** Each service path is reachable within two interactions and every published claim is verified.

## S04: Mechanical Service Journey

**Status:** READY

**PRD coverage:** FR-04, mechanical page requirements.

**Outcome:** Customers can scan confirmed services in plain language, understand next steps, and call or request an appointment.

**Acceptance gate:** Only supported services appear; symptom-oriented content and action paths pass owner review and keyboard testing.

## S05: Body and Collision Journey

**Status:** DONE

**PRD coverage:** FR-04, FR-17, body/collision page requirements.

**Outcome:** Customers understand supported work, inspection expectations, insurance guidance, and why photos do not guarantee a final estimate.

**Acceptance gate:** Met. Owner-approved services are published, the estimate process explains inspection and photo limits, call and estimate actions work without JavaScript, and the page states that insurance relationships are not currently offered.

## S06: Contact and Directions

**Status:** DONE

**PRD coverage:** FR-02, FR-03, FR-12.

**Outcome:** Customers see consistent phone, address, hours, service area, emergency guidance, and an external directions action.

**Acceptance gate:** Implemented for owner-confirmed phone, regular hours, service area, and policies. The future address and mapping action are handled in S16.

## S07: Form Platform Integration

**Status:** DONE

**PRD coverage:** FR-05 through FR-10, privacy/security requirements.

**Decision:** Supabase is the selected form processor. Its Edge Function, retention policy, review workflow, and consent copy are configured as documented in [SUPABASE.md](SUPABASE.md).

**Outcome:** A minimal non-production test form reaches a monitored staff channel with spam controls and a phone fallback.

**Acceptance gate:** Met. Live success, invalid, honeypot, rate-limit, blocked-origin, and offline failure paths pass. New requests are reviewed at least every four hours; completed requests are retained for 90 days.

## S08: Estimate Request Workflow

**Status:** DONE

**PRD coverage:** FR-05, FR-07 through FR-10, FR-17.

**Outcome:** A customer submits only useful contact, vehicle, category, damage/symptom, safety, and preferred-contact details; staff receives one request; the customer receives accurate next steps.

**Acceptance gate:** Met. The deployed workflow accepts qualified estimates once, announces invalid fields and focuses the first invalid field, rejects duplicates, and shows recoverable offline, rate-limit, and provider-failure states. No analytics event contains field values. Photo uploads are not enabled.

## S09: Appointment Request Workflow

**Status:** DONE

**PRD coverage:** FR-06 through FR-09.

**Outcome:** A customer requests a service window and receives repeated notice that no appointment exists until staff confirms it.

**Acceptance gate:** Met. The deployed workflow accepts a valid appointment request, announces missing fields and focuses the first invalid field, blocks past dates, rejects duplicates, and shows a recoverable offline failure state. No UI state calls the request “booked” or “confirmed.”

## S10: Trust and Proof

**Status:** DONE

**PRD coverage:** FR-11, About, Gallery, Reviews.

**Outcome:** Authentic shop/team content, substantiated credentials, permissioned reviews, and approved before/after work provide evidence without exposing customers.

**Acceptance gate:** Rights and claims are documented; responsive images have dimensions and suitable alternative text; gallery empty state remains if assets are insufficient.

**Implementation note:** Temporary stock service illustrations are labeled and documented in [TEMPORARY_ASSETS.md](TEMPORARY_ASSETS.md); they must be replaced before production release. Authentic projects, images, reviews, and rights are activated in S16.

## S11: FAQ and Privacy

**Status:** DONE

**PRD coverage:** FAQ, Privacy Policy, Sections 16 and 18.

**Outcome:** FAQs reflect real customer calls and the privacy page accurately names actual processors, purposes, retention, photo handling, analytics, choices, and contact method.

**Acceptance gate:** Met for the development demo. FAQs and privacy disclosures match the configured Supabase processor, 90-day completed-request retention, no-upload/no-analytics state, and monitored privacy contact. Sample business content and final legal review remain required before production release.

## S12: Local SEO and Sharing

**Status:** DONE

**PRD coverage:** Section 14 and SEO items in Section 17.

**Outcome:** Unique metadata, canonical production URLs, verified `AutoRepair` JSON-LD, sitemap, robots file, favicon, and social previews validate.

**Acceptance gate:** Crawl controls, sitemap, favicon, and Home sharing metadata validate. Production schema and social previews are activated in S16 after owner assets and profiles are supplied.

## S13: Privacy-Safe Analytics

**Status:** READY

**PRD coverage:** FR-13, Section 18.

**Outcome:** Approved aggregate events capture call, directions, request entry, form state, and optional gallery/language engagement without personal data.

**Acceptance gate:** Cloudflare Web Analytics is selected. The beacon is disabled until configured, and the local conversion-event contract contains no personal or vehicle data. Configure the beacon token and verify page analytics plus consent behavior before marking this slice DONE.

## S14: Spanish Parity

**Status:** READY

**PRD coverage:** FR-14.

**Outcome:** A qualified reviewer approves equivalent Spanish core pages and request journeys, with correct language and alternate metadata.

**Acceptance gate:** A complete Spanish development-demo route set is implemented and approved by the developer as reviewer. Deploy and live-test the language switch and request paths before marking this slice DONE. Before production release, obtain qualified human translation review and maintenance ownership.

## S15: Launch Hardening and Pages Release

**Status:** LATER

**PRD coverage:** Sections 13, 15, 19, and 21.

**Outcome:** The production GitHub Pages site passes accessibility, responsive, browser, performance, link, metadata, form, HTTPS, 404, and no-JavaScript checks.

**Acceptance gate:** PRD launch checklist is complete, form delivery is monitored, owner signs off, and rollback/maintenance ownership is documented.

## S16: Verified Content Activation

**Status:** BLOCKED on owner input

**Goal:** Replace pending placeholders with owner-approved location, profile, and authentic proof assets across the existing contact, trust, and SEO foundations.

**Inputs required:**

- Public address and map destination.
- Google Business Profile URL and approved review-profile URLs or permissioned review excerpts.
- Authentic shop, team, and completed-work images with usage rights, captions, dimensions, and alternative text.

**Deliverable:** Update [business-facts.json](business-facts.json), Contact, About, Gallery, Privacy, and metadata; replace temporary illustrations; add validated `AutoRepair` JSON-LD and production social previews.

**Acceptance gate:** Published facts match owner approval and public profiles; images are optimized and permissioned; location, directions, schema, sharing previews, and relevant accessibility checks pass.
