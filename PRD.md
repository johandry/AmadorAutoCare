# Amador Auto Care Website Product Requirements Document

- **Status:** Draft for owner review
- **Version:** 1.0
- **Date:** August 31, 2026
- **Product owner:** [OWNER NAME]
- **Primary market:** [CITY, STATE AND SERVICE AREA]

> All bracketed values are placeholders requiring confirmation. This document does not assume unverified business details, certifications, warranties, prices, reviews, or response times.

## 1. Executive Summary

Amador Auto Care needs a fast, trustworthy, mobile-first website that helps local customers understand its mechanical and body-work services and take the next step with minimal effort. The primary conversions are phone calls, estimate requests, appointment requests, and requests for directions.

The MVP will be a static website built with semantic HTML, modular CSS, and minimal vanilla JavaScript, deployed through GitHub Pages. A third-party form service will securely process submissions because GitHub Pages cannot run server-side code. Appointment submissions will be presented as requests, not confirmed bookings. The site will emphasize real shop imagery, clear services, business credentials, transparent expectations, and prominent contact actions.

## 2. Problem Statement

Prospective customers often need urgent, confidence-building answers: whether the shop handles their problem, where it is, when it is open, and how quickly they can speak with someone. Mechanical-repair customers may know only a symptom; collision customers may need to share visible damage and insurance context. A generic brochure site creates friction if it obscures these paths or implies instant estimates and confirmed appointments that the business cannot provide.

The website must turn local search and referral traffic into qualified inquiries while setting accurate expectations and remaining practical for a small business to maintain.

## 3. Business Goals and Success Metrics

Baseline values must be measured during the first 30 days after launch. Targets should then be reviewed with the owner.

| Goal | Metric | Initial target | Measurement |
| --- | --- | ---: | --- |
| Generate qualified leads | Completed estimate and appointment requests | Establish baseline, then improve 15% in 90 days | Privacy-conscious analytics plus form dashboard |
| Encourage direct contact | Click-to-call conversion rate on mobile | At least 8% of mobile sessions | `click_call` event |
| Help customers find the shop | Directions clicks | Establish baseline | `click_directions` event |
| Reduce form friction | Form completion rate | At least 45% of form starts | `form_start`, `form_submit`, `form_error` |
| Build confidence | Service-to-contact conversion rate | At least 5% | Page path and conversion events |
| Deliver a quality experience | Core Web Vitals at the 75th percentile | LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 | PageSpeed Insights/Search Console |
| Support organic discovery | Indexed service pages and non-branded search impressions | All intended pages indexed; establish impression baseline | Google Search Console |

No advertising return, revenue, or lead-volume promise is made until traffic and operational capacity are known.

## 4. Target Customers and Personas

### Persona A: Urgent Mechanical-Repair Customer

- Has a warning light, unusual sound, breakdown, or maintenance need.
- Primarily uses a phone and wants a quick answer.
- Needs service coverage, hours, location, and a visible call action.

### Persona B: Collision and Body-Work Customer

- Has cosmetic or collision damage and may be navigating insurance.
- Wants to share photos and understand the estimate process.
- Needs proof of workmanship, realistic timelines, and follow-up expectations.

### Persona C: Planned-Maintenance Customer

- Is comparing local shops for routine service.
- Values reputation, credentials, convenience, and clear communication.
- Prefers requesting a future appointment without calling immediately.

### Persona D: Spanish-Preferring Customer

- Needs the same core information and conversion paths in Spanish.
- Must not receive a partial or lower-quality translated experience.
- Spanish-language support remains pending owner confirmation and qualified translation.

## 5. Primary Customer Journeys

1. **Urgent repair:** Local search -> Home or Mechanical Services -> confirm relevant service -> tap Call Now.
2. **Collision estimate:** Search/referral -> Body & Collision -> review work and process -> submit estimate request with optional photos -> receive request acknowledgment -> staff follows up.
3. **Planned appointment:** Home or Services -> Appointment Request -> provide vehicle, service, and preferred time -> receive acknowledgment that the appointment is pending confirmation.
4. **Trust validation:** Home -> About/Reviews/Gallery -> verify credentials and real work -> call or request service.
5. **Visit shop:** Any page -> Contact -> confirm hours/address -> open directions in the customer's map application.

## 6. Scope

### MVP: Must

- Responsive Home, Services, About, Gallery, FAQ, Contact, Estimate Request, Appointment Request, and Privacy pages.
- Separate, indexable Mechanical Services and Body & Collision content.
- Persistent mobile access to Call and Request Service actions without obscuring content.
- Third-party form processing with validation, spam controls, accessible status feedback, and email notifications.
- Accurate address, phone, hours, service area, emergency guidance, and owner-approved trust indicators.
- Basic local SEO, structured data, social metadata, sitemap, robots file, and analytics.
- Real, optimized business and workmanship images supplied or approved by the owner.

### Should

- Before-and-after gallery filtering by work category.
- Customer testimonials sourced with permission and linked to an authoritative review profile where permitted.
- Optional photo uploads through a vetted form provider.
- Complete Spanish-language mirror after professional or fluent-human review.

### Could

- Third-party real-time scheduling.
- Financing, insurance-partner, fleet-service, or towing information if offered.
- Lightweight content updates through repository-managed JSON.
- Additional service-area landing pages when they contain unique, useful content.

### Won't in Initial Release

- Customer accounts, repair-status tracking, online payments, or an internal CRM.
- A custom backend, database, or custom file-storage service.
- Automatic binding estimates based only on form data or photos.
- Guaranteed appointment times without real-time scheduling integration.
- Unmoderated reviews, live chat requiring continuous staffing, or unsupported claims.

## 7. Information Architecture and Navigation

```text
Home
Services
|-- Mechanical Services
|-- Body & Collision Repair
Gallery
About
FAQ
Contact
|-- Request an Estimate
|-- Request an Appointment
Privacy Policy
```

Desktop navigation should expose Services as a simple submenu. Mobile navigation must use an accessible disclosure menu. “Call” and “Request Service” are the primary global actions. Breadcrumbs should appear on child service pages and may be represented in structured data.

## 8. Page-by-Page Requirements

### Home

- Identify Amador Auto Care and its verified service category/location in the first viewport.
- Use an authentic, legible image of the shop or work as the primary visual.
- Offer Call Now, Request an Estimate, and Request an Appointment without implying guaranteed availability.
- Summarize mechanical and body-work paths separately.
- Present verified trust indicators, selected work, hours, location, and review evidence.

### Mechanical Services

- List only owner-confirmed services, grouped for scanning.
- Explain symptoms or customer needs in plain language rather than only technical terms.
- Include process expectations, relevant FAQs, and contact actions.
- Avoid fixed price or turnaround claims unless approved and maintainable.

### Body & Collision Repair

- Explain supported body, paint, collision, and insurance-related services.
- Explain inspection and estimate steps and that photos may not be sufficient for a final estimate.
- Feature relevant before-and-after work with truthful captions.
- Route users to the estimate form and phone contact.

### About

- Include the verified business story, team/shop imagery, experience, certifications, warranties, and community ties.
- Display only claims supported by owner-provided evidence.

### Gallery

- Show optimized real images with descriptive alternative text or empty alt text when decorative.
- Pair before/after items clearly and label work performed without exposing customer information.
- Provide a meaningful empty state when no approved projects exist; do not use fabricated examples.

### Reviews and Testimonials

- Show only authentic, permissioned excerpts with source attribution where allowed.
- Link to the business's authoritative review profile rather than embedding a heavy widget in the MVP.
- Do not mark self-selected on-site testimonials as aggregate review ratings in structured data.

### FAQ

- Answer verified questions about service types, estimates, appointments, insurance, parts, warranties, towing, payment, and after-hours contact.
- Avoid FAQ structured data unless current search-engine eligibility and content requirements are met.

### Contact

- Present phone, address, hours, service area, email if monitored, and accessible directions link.
- Include holiday-hours and after-hours guidance or explicitly state that customers should call during business hours.
- Use a lightweight map link or click-to-load embed to preserve performance and privacy.

### Estimate Request

- Collect contact details, preferred contact method, vehicle year/make/model, service category, description, drivability/safety context, and optional photos.
- State that submission is a request and not a diagnosis, final quote, emergency service, or guaranteed response time.
- Request only information staff will actively use.

### Appointment Request

- Collect contact details, vehicle details, requested service, preferred date/time windows, and notes.
- Clearly state before submission and in confirmation that requested times are not booked until staff confirms them.

### Privacy Policy

- Explain collected data, purpose, third-party processors, retention, contact method, analytics, photo handling, and customer choices.
- Be reviewed by the owner and qualified counsel if legal assurance is required.

## 9. Functional Requirements

Priorities use Must, Should, Could, and Won't for the initial release.

| ID | Priority | Requirement | Acceptance criteria |
| --- | --- | --- | --- |
| FR-01 | Must | Global responsive navigation | **Given** any supported viewport, **when** a user opens navigation, **then** all primary destinations and contact actions are keyboard- and touch-accessible without overflow. |
| FR-02 | Must | Click-to-call | **Given** a device capable of calling, **when** the user activates a displayed phone number, **then** a `tel:` action opens with the verified number. |
| FR-03 | Must | Directions | **Given** a user viewing location details, **when** they activate Directions, **then** an external mapping service opens the verified destination without an API key in client code. |
| FR-04 | Must | Service discovery | **Given** a customer with a mechanical or body-work need, **when** they visit Home or Services, **then** they can reach the relevant detail page in no more than two interactions. |
| FR-05 | Must | Estimate request | **Given** valid required fields, **when** the customer submits the estimate form, **then** the processor accepts it once, staff receives it, and the customer sees an acknowledgment with next-step expectations. |
| FR-06 | Must | Appointment request | **Given** valid required fields, **when** the customer submits an appointment request, **then** the processor accepts it and both form and acknowledgment state that staff confirmation is required. |
| FR-07 | Must | Form validation | **Given** missing or invalid input, **when** submission is attempted, **then** submission is blocked and each error is described in text, associated with its field, and summarized accessibly. |
| FR-08 | Must | Form states | **Given** a form submission, **when** it is pending, succeeds, or fails, **then** the submit control prevents duplicates and an announced loading, success, or recoverable error state is shown. |
| FR-09 | Must | Spam protection | **Given** automated or suspicious form activity, **when** the processor evaluates it, **then** honeypot, rate-limit, or challenge controls reduce spam without an inaccessible mandatory puzzle. |
| FR-10 | Should | Photo upload | **Given** an estimate form with uploads enabled, **when** a user selects unsupported, excessive, or oversized files, **then** accepted types, count, size limits, privacy notice, and corrective errors are clear before submission. |
| FR-11 | Should | Gallery interaction | **Given** approved gallery items, **when** a user filters or opens an item, **then** focus remains managed, controls have accessible names, and images do not trigger layout shifts. |
| FR-12 | Must | Business information | **Given** any page, **when** a user reaches the footer or Contact page, **then** the same verified name, address, phone, and current hours are displayed consistently. |
| FR-13 | Must | Analytics consent behavior | **Given** the selected analytics configuration, **when** a conversion occurs, **then** no form-entered personal or vehicle data is sent to analytics and consent rules are honored. |
| FR-14 | Should | Spanish version | **Given** an approved Spanish translation, **when** a user switches language, **then** they reach the equivalent page, language metadata is correct, and core journeys are fully translated. |
| FR-15 | Must | No-JavaScript resilience | **Given** JavaScript is unavailable, **when** a user browses the site, **then** core content, links, phone, directions, and processor-compatible form submission remain usable where supported. |
| FR-16 | Could | Real-time scheduling | **Given** an approved scheduling provider, **when** a customer selects an available slot and completes booking, **then** the provider returns an explicit confirmed appointment and cancellation instructions. |
| FR-17 | Won't | Automated estimate | **Given** submitted vehicle information or photos, **when** processing completes, **then** the website does not generate or promise a binding price. |

## 10. Non-Functional Requirements

- **Performance:** Meet Core Web Vitals targets in Section 15 on representative mobile hardware and production hosting.
- **Availability:** Rely on GitHub Pages availability; forms must show alternate phone contact when the processor fails.
- **Security:** Use HTTPS, no secrets in source code, minimal third-party scripts, dependency-free code where practical, and restrictive browser policies supported by static hosting.
- **Maintainability:** Use semantic multi-page HTML, shared CSS/JS assets, documented content locations, consistent naming, and no build requirement for routine text updates.
- **Compatibility:** Support current and previous major versions of Chrome, Safari, Firefox, and Edge, plus current iOS Safari and Android Chrome.
- **Progressive enhancement:** Core information and contact links work without JavaScript.
- **Content integrity:** Business facts have one documented source of truth and an owner review date.

## 11. Content Requirements

The business must provide or approve:

- Legal/display business name, address, phone, monitored email, service area, regular and holiday hours.
- Logo and brand assets, or approval to create a simple text-led identity.
- Complete mechanical and body-work service lists and excluded work.
- Business story, years operating, staff names/roles, languages spoken, and accessibility accommodations.
- Evidence and usage permission for certifications, affiliations, warranties, financing, insurance relationships, and awards.
- Real exterior, interior, team, equipment, and before-and-after photos with customer/license-plate privacy addressed.
- Approved testimonials or authoritative review-profile URLs and reuse permissions.
- Estimate, appointment, cancellation, emergency, after-hours, towing, insurance, payment, and response-time policies.
- Privacy-contact details, retention practices, and approved legal copy.
- English source copy and qualified Spanish translation if bilingual launch is approved.

## 12. UX/UI Direction

- **Character:** Skilled, direct, clean, and locally trustworthy; operational rather than promotional.
- **Visual hierarchy:** Make the business, two service categories, location, and contact actions immediately recognizable.
- **Imagery:** Use bright, authentic photos that reveal the actual shop, staff, and workmanship. Avoid generic stock imagery where users need proof.
- **Typography:** Use a distinctive, readable web-safe or self-hosted type pairing; body text at least 16px with comfortable line height. Do not scale type directly with viewport width.
- **Color:** Use a restrained neutral base, high-contrast text, and one warm action color informed by the approved brand. Do not rely on color alone.
- **Components:** Use familiar icons with text where clarity requires it, compact service lists, unframed page sections, and cards only for repeated projects or testimonials.
- **Mobile:** Keep tap targets at least 44 by 44 CSS pixels and prioritize calling, estimates, appointments, hours, and directions.
- **Motion:** Limit animation to brief purposeful transitions and honor `prefers-reduced-motion`.

## 13. Accessibility Requirements

Target WCAG 2.2 Level AA:

- Semantic landmarks, logical heading hierarchy, skip link, descriptive page titles, and meaningful link text.
- Complete keyboard operation with visible focus and no keyboard traps.
- Minimum 4.5:1 contrast for normal text and 3:1 for large text and meaningful UI graphics.
- Labels and instructions available before input; errors identified in text and programmatically associated.
- Status messages announced without forcing focus; focus moved deliberately after navigation or modal actions.
- Touch targets meeting WCAG 2.2 target-size requirements, with adequate spacing.
- Images with contextual alternative text; decorative images ignored; captions not duplicated unnecessarily.
- No autoplaying media, flashing content, or motion that disregards reduced-motion preferences.
- Zoom and reflow remain usable at 200% zoom and 320 CSS-pixel width.
- Language declared per page and language changes identified.
- Automated axe/Lighthouse checks plus manual keyboard, screen-reader, zoom, and contrast testing before launch.

## 14. Local SEO and Structured Data

- Use unique titles, meta descriptions, canonical URLs, one descriptive H1 per page, and crawlable text for each service category.
- Keep the verified business name, address, and phone consistent with the Google Business Profile and other citations.
- Create `sitemap.xml`, `robots.txt`, Open Graph metadata, favicon assets, and descriptive image filenames.
- Add JSON-LD using the most specific valid Schema.org subtype, likely `AutoRepair`, after all fields are verified.
- Structured data may include name, URL, telephone, address, geo coordinates, opening hours, image, service area, and `sameAs` profiles.
- Do not include unverified ratings, prices, certifications, or services in structured data.
- Connect Google Search Console and submit the sitemap after the production URL is final.
- Avoid thin, duplicated city pages; each indexed page must serve a distinct customer need.

## 15. Performance Targets

At the 75th percentile of mobile visits:

- Largest Contentful Paint (LCP): <= 2.5 seconds.
- Interaction to Next Paint (INP): <= 200 milliseconds.
- Cumulative Layout Shift (CLS): <= 0.1.
- Initial compressed HTML/CSS/JS target: <= 150 KB, excluding images and necessary form-provider assets.
- Hero image target: <= 200 KB where visual quality permits; responsive AVIF/WebP with explicit dimensions.
- Lighthouse performance target: >= 90 in a production mobile run, treated as diagnostic rather than a business KPI.

Implementation should use system or self-hosted subset fonts, deferred noncritical scripts, lazy-loaded below-fold media, no autoplay video, and a click-to-load map or plain directions link.

## 16. Privacy, Security, Spam Prevention, and Form Data

- GitHub Pages cannot securely receive, validate, store, or email form data by itself. Use a form processor such as Formspree, Basin, Getform, or an owner-approved equivalent after comparing current pricing, upload support, retention, spam controls, accessibility, and data location.
- Photo upload requires multipart handling and storage by the provider. Client-only email, repository storage, public cloud-upload credentials, and exposing API secrets are unacceptable.
- Recommended MVP: use hosted upload support with strict JPEG/PNG/HEIC policy where supported, maximum count and size, retention controls, and staff-only access. If cost or privacy is unsuitable, omit uploads and ask staff to request photos during follow-up.
- Collect the minimum necessary personal information. Never collect payment, driver's-license, insurance-policy, or other sensitive data unless an approved operational need and compliant processor exist.
- Display consent language and links to the Privacy Policy near submission. Photo consent must explain review and retention.
- Configure honeypot and provider-side spam/rate controls. CAPTCHA should be a last resort and must have an accessible alternative.
- Keep API keys and secrets out of Git. Public analytics IDs and form endpoint identifiers are not secrets but should still be documented.
- Provide a fallback phone number on submission failures. Do not expose detailed provider errors or submitted data in URLs, logs, or analytics.

## 17. GitHub Pages Deployment and Technical Architecture

```text
Customer browser
|-- GitHub Pages: HTML, CSS, JS, images, metadata
|-- Form provider: estimate and appointment processing/uploads
|-- Map provider: external directions or click-to-load map
`-- Analytics provider: privacy-conscious aggregate events
```

- Deploy from the protected `main` branch through GitHub Pages or a minimal GitHub Actions Pages workflow.
- Use relative paths that work at the repository subpath until a custom domain is configured.
- Configure a custom domain and `CNAME` only after DNS ownership is confirmed; enforce HTTPS.
- Add pull-request checks for HTML validity, broken internal links, formatting, and accessibility smoke tests where practical.
- Keep source assets organized by type and document local preview/deployment in the README.
- Recommended forms: evaluate Formspree/Basin against requirements before selection.
- Recommended maps: normal Google Maps or Apple Maps directions links; avoid a heavy embed by default.
- Selected analytics: Google Analytics 4 with explicit visitor consent and an allowlisted, no-PII event contract.

## 18. Analytics and Conversion Tracking

Track aggregate, purpose-limited events:

- `click_call` with page context.
- `click_directions` with page context.
- `click_estimate` and `click_appointment` with source page.
- `form_start`, `form_submit`, and non-sensitive `form_error` with form type only.
- Optional `language_change` and gallery engagement.

Never capture names, email addresses, phone numbers, vehicle identifiers, free-text descriptions, uploaded filenames, or exact form values. Document event definitions and test them without polluting production metrics. Review monthly for the first quarter and quarterly thereafter.

## 19. Testing and Compatibility

- Validate HTML and test CSS/JS for console and syntax errors.
- Test responsive layouts at 320px, 375px, 768px, 1024px, and wide desktop widths.
- Test current and previous Chrome, Safari, Firefox, and Edge; current iOS Safari and Android Chrome.
- Test every link, phone action, directions action, navigation state, and form path.
- Test forms with valid, invalid, duplicate, offline, slow, rejected, spam-flagged, and provider-unavailable scenarios.
- Test supported and unsupported photo types, file counts, and size limits if uploads ship.
- Run Lighthouse and axe, then manually test keyboard-only use, VoiceOver, 200% zoom, reduced motion, and high contrast.
- Validate JSON-LD with Schema Markup Validator and relevant search-engine tools.
- Test the production GitHub Pages subpath, custom domain, HTTPS, 404 behavior, sitemap, robots rules, and social previews.

## 20. Risks, Dependencies, Assumptions, and Mitigations

| Risk or dependency | Impact | Mitigation |
| --- | --- | --- |
| Business details remain unverified | Misleading customers and weak local SEO | Owner sign-off checklist and dated source-of-truth content file |
| Third-party form outage or plan change | Lost inquiries or unexpected cost | Visible call fallback, provider monitoring, export capability, documented replacement procedure |
| Photo upload privacy/storage | Sensitive images retained or exposed | Strict limits, processor review, retention policy, consent, or defer uploads |
| Appointment wording implies confirmation | Customer arrives without a booking | Repeat “request pending confirmation” before and after submission |
| Generic or poor imagery | Reduced trust | Schedule authentic photo collection; launch gallery only with approved work |
| Analytics creates privacy burden | Compliance and trust risk | Minimal events, no PII, privacy-first provider, documented consent decision |
| Stale hours/services | Customer frustration | Named content owner and quarterly/holiday review reminders |
| Spanish content is incomplete or inaccurate | Unequal or confusing experience | Launch only complete, reviewed journeys; maintain translation parity |
| GitHub Pages static limitations | No native forms, private storage, or dynamic booking | Use narrowly scoped hosted services and disclose dependencies |
| Repository subpath breaks links | Production 404s | Use relative/base-aware URLs and production-path checks |

Assumptions: staff can receive and respond to form notifications; the business owns or can obtain rights to supplied content; a GitHub account administers deployment; and exact service, legal, and operational details will be provided before launch.

## 21. Launch Checklist

- [ ] Owner approves all business facts, services, claims, policies, and calls to action.
- [ ] Phone, address, hours, email, service area, and map destination are tested.
- [ ] Authentic images are licensed, optimized, correctly oriented, and stripped of sensitive metadata where appropriate.
- [ ] Testimonials and trust marks have usage permission.
- [ ] Estimate and appointment forms deliver to monitored staff channels.
- [ ] Form acknowledgment and failure paths set accurate expectations.
- [ ] Privacy Policy names actual processors and retention practices.
- [ ] Accessibility checks and manual assistive-technology tests pass.
- [ ] Core Web Vitals lab targets and production smoke tests pass.
- [ ] Metadata, canonical URLs, structured data, sitemap, robots, favicon, and social previews validate.
- [ ] Analytics events work and contain no personal information.
- [ ] Custom domain, DNS, HTTPS, repository settings, and 404 page work.
- [ ] Google Business Profile URL and business details match the site.
- [ ] Spanish pages, if included, are complete and reviewed.
- [ ] A staff owner and schedule for content/form monitoring are documented.

## 22. Post-Launch Roadmap

1. **Weeks 1-4:** Monitor form delivery, broken paths, search indexing, site speed, and customer/staff feedback. Correct factual or usability issues immediately.
2. **Months 2-3:** Establish conversion baselines, improve low-performing service paths, expand approved gallery content, and refine FAQs from actual calls.
3. **Quarter 2:** Launch complete Spanish parity if approved; evaluate photo uploads, real-time scheduling, and additional service content using measured demand.
4. **Later:** Consider CRM integration, fleet workflows, financing, repair-status tools, or payments only with a clear operational owner, security review, and business case.

## 23. Open Questions for the Business Owner

See the prioritized discovery questions in the conclusion. Any unresolved answer affecting factual accuracy, privacy, form routing, or appointment expectations blocks launch of that feature.

## Requirements Traceability

| Business goal | User need | Feature/requirement | Metric | Acceptance criteria |
| --- | --- | --- | --- | --- |
| Generate qualified leads | Explain vehicle need efficiently | FR-05 Estimate request | Completed estimate requests; completion rate | Valid submissions are delivered once and acknowledged |
| Generate qualified leads | Request a convenient visit | FR-06 Appointment request | Completed requests; completion rate | Submission states confirmation is still required |
| Make contact simple | Speak with staff quickly | FR-02 Click-to-call | `click_call` rate | Verified phone opens via `tel:` |
| Communicate services | Find the right repair path | FR-04 Service discovery | Service-to-contact conversion | Relevant service page reached within two interactions |
| Communicate location/hours | Know when and where to visit | FR-03, FR-12 | Directions clicks; contact-page engagement | Verified details are consistent and map opens correctly |
| Build trust | Validate workmanship and claims | FR-11 plus About/Reviews content | Gallery engagement; conversion after trust pages | Approved content is accessible and causes no layout shift |
| Serve more customers | Use the site in Spanish | FR-14 | Language use and conversion parity | Equivalent, reviewed pages and journeys are available |
| Maintain usability | Recover from input or provider errors | FR-07, FR-08 | Form error and abandonment rates | Errors are associated, announced, and recoverable |
| Protect customers | Avoid unnecessary collection and tracking | FR-13 | Privacy audit; zero PII analytics incidents | Analytics contains no submitted personal data |

## Recommended MVP

Launch a focused multi-page static site with Home, Mechanical Services, Body & Collision Repair, About, a modest approved Gallery/Reviews section, FAQ, Contact, Estimate Request, Appointment Request, and Privacy Policy. Use a vetted hosted form processor, map links, privacy-conscious analytics, authentic imagery, and verified local-business data. Keep photo uploads optional pending provider/privacy approval, and defer Spanish publication until the full core journey is professionally or fluently reviewed.

## Product Decisions Requiring Owner Approval

- Final business identity, service area, contact details, hours, services, and after-hours policy.
- Primary conversion hierarchy: phone, estimate request, or appointment request.
- Form provider, notification recipients, expected response time, retention, and upload policy.
- Whether appointments remain requests or use a paid real-time scheduling provider.
- Which credentials, warranties, insurance relationships, prices, reviews, and images may be published.
- Analytics provider and consent approach.
- Custom domain and ongoing content owner.
- Spanish launch timing and translation reviewer.

## 15 Prioritized Discovery Questions

1. What exact business name, address, primary phone, monitored email, regular hours, holiday-hours process, and service area should be published?
2. Which mechanical and body/collision services are currently offered, and which requests should the site discourage or redirect?
3. Which action should receive strongest emphasis: calling, requesting an estimate, or requesting an appointment?
4. Who receives each form, how quickly can staff normally respond, and what happens when that person is unavailable?
5. What information does staff actually need to qualify mechanical versus collision inquiries?
6. Should customers upload photos at launch, and what file limits, retention period, and deletion process can the business support?
7. Are appointment submissions always requests, or is there an existing scheduling system with authoritative availability?
8. What emergency, unsafe-to-drive, towing, and after-hours guidance is accurate and approved?
9. Which credentials, years of experience, warranties, insurance relationships, financing options, and payment methods can be substantiated?
10. Which real shop, staff, equipment, and before-and-after images are available, and are customer/property permissions documented?
11. Which review profiles and testimonials may be linked or quoted, and who has approved reuse?
12. What custom domain and Google Business Profile are controlled by the business, and do their details match?
13. Is full Spanish support required for launch, who will translate/review it, and who will keep both languages synchronized?
14. Which analytics questions are genuinely useful, and is the owner prepared for any consent/privacy obligations of the chosen provider?
15. Who owns quarterly updates for hours, services, photos, policies, form delivery, and third-party subscriptions?

## Phased Implementation Plan

### Phase 0: Discovery and Content Approval

- Resolve launch-blocking questions, inventory assets, verify business data, select providers, and approve sitemap/wireframes.
- Define form routing, response expectations, privacy terms, and measurable baseline events.

### Phase 1: Foundation

- Create semantic page templates, shared responsive styles, accessible navigation/footer, metadata conventions, and local preview instructions.
- Add verified global business data and automated checks available without introducing a heavy framework.

### Phase 2: Core Content and Conversion

- Implement Home, service pages, About, FAQ, Contact, forms, confirmations, and Privacy Policy.
- Integrate and test form processing, fallback contact paths, validation, spam controls, and analytics events.

### Phase 3: Trust, SEO, and Quality

- Add approved gallery/reviews, responsive images, structured data, sitemap, robots file, social metadata, and 404 page.
- Complete accessibility, browser, performance, form-failure, and production-subpath testing.

### Phase 4: Launch and Learn

- Configure domain/HTTPS and GitHub Pages, run launch checklist, submit sitemap, and monitor delivery and metrics.
- Prioritize improvements from real search queries, customer behavior, and staff feedback rather than adding speculative features.
