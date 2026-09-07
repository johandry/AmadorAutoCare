# Google Analytics

Google Analytics 4 is the selected provider for aggregate page analytics. It is disabled until a public Measurement ID is set in [analytics-config.js](../assets/js/analytics-config.js) and a visitor explicitly allows analytics.

## Configure

1. Create or select a Google Analytics 4 property for `amadorautocare.com`.
2. Copy the web data stream's Measurement ID, in the form `G-XXXXXXXXXX`.
3. Set `googleMeasurementId` in `assets/js/analytics-config.js`.
4. Deploy the site. The analytics consent prompt appears until a visitor chooses Allow or Decline.
5. In Google Analytics **Reports** or **Realtime**, confirm page views and only the allowed conversion event names.

The Measurement ID is public and is not a secret. Do not add Google API keys, OAuth credentials, or account credentials to this repository.

## Conversion Event Contract

The site emits `amadoranalytics` browser events for `click_call`, `click_directions`, `click_estimate`, `click_appointment`, `form_start`, `form_submit`, `form_error`, and `language_change`.

Each event contains only the event name and an allowlisted `page`, `form`, or `source` context. It never includes names, emails, phone numbers, vehicle data, free text, upload information, identifiers, or form values. Events are sent to Google Analytics only after explicit consent.

Before production release, confirm the selected Google Analytics configuration and consent behavior with the business owner and qualified counsel.