# Cloudflare Web Analytics

Cloudflare Web Analytics is the selected provider for aggregate page analytics. It is disabled until its public beacon token is set in [analytics-config.js](../assets/js/analytics-config.js).

## Configure

1. In Cloudflare Dashboard, open **Web Analytics** and add `amadorautocare.com`.
2. Copy the token from the JavaScript snippet under **Manage site**.
3. Set `cloudflareBeaconToken` in `assets/js/analytics-config.js`.
4. Deploy the site and confirm page views appear in Cloudflare Web Analytics.

The beacon token is public and is not a secret. Do not add Cloudflare API tokens or account credentials to this repository.

## Conversion Event Contract

The site emits `amadoranalytics` browser events for `click_call`, `click_directions`, `click_estimate`, `click_appointment`, `form_start`, `form_submit`, `form_error`, and `language_change`.

Each event contains only the event name and an allowlisted `page`, `form`, or `source` context. It never includes names, emails, phone numbers, vehicle data, free text, upload information, identifiers, or form values. The Cloudflare beacon records page analytics only; it does not receive these custom conversion events because Cloudflare Web Analytics has no documented custom-event interface.

Before production release, confirm the selected Cloudflare configuration and any required consent behavior with the business owner and qualified counsel.