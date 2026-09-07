# Supabase Service Requests

Supabase is the selected processor for estimate and appointment requests. The browser sends requests only to the `submit-service-request` Edge Function; browser code never has direct access to the request tables.

## Configure

1. Create a Supabase project and apply `supabase/migrations/20260906000000_create_service_requests.sql`.
2. Set the `ALLOWED_ORIGIN` Edge Function secret to the final GitHub Pages origin, without a trailing slash.
3. Deploy the function with `supabase functions deploy submit-service-request`.
4. Set `serviceRequestEndpoint` in [assets/js/supabase-config.js](../assets/js/supabase-config.js) to `https://<project-ref>.supabase.co/functions/v1/submit-service-request`.
5. Apply `supabase/migrations/20260906010000_add_request_retention.sql`, then schedule `select public.purge_completed_service_requests();` to run daily from Supabase Cron.
6. Mark a request `completed` and set `completed_at` when its work is finished. Completed requests are deleted after 90 days; active requests are retained until completion.
7. Review `service_requests` in the Supabase Dashboard at least every four hours. Email requests or privacy questions to `service@info.amadorautocare.com`.
8. Apply `supabase/migrations/20260907000000_prevent_duplicate_service_requests.sql` and redeploy `submit-service-request` after changing estimate request validation.

The function uses the Supabase service-role key only in its server environment. Do not place service-role credentials in the repository, browser configuration, or GitHub Pages settings.

## Protections

- The Edge Function only accepts requests from `ALLOWED_ORIGIN`.
- A hidden honeypot rejects automated submissions.
- Required fields are validated server-side and values are length-limited.
- The database function allows at most five requests per fingerprint per 15-minute window.
- Row-level security blocks browser roles from reading request data.
- The retention function only deletes requests marked `completed` more than 90 days earlier.

## Operational Check

Before launch, submit one estimate and one appointment request from the deployed site. Confirm each is stored once, staff can receive it through the agreed workflow, and appointment wording never implies booking confirmation.

**Validated September 7, 2026:** The deployed endpoint accepted synthetic estimate and appointment requests, rejected invalid, honeypot, and blocked-origin requests, enforced the five-request rate limit, and both deployed forms showed the recoverable call fallback while offline.

## Operating Policy

- New requests are reviewed at least every four hours.
- Mark a request `completed` and set `completed_at` only after the work is finished.
- The daily retention job deletes completed requests after 90 days.
- `service@info.amadorautocare.com` is the monitored contact for service-request and privacy questions.