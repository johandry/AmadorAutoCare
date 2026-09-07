const navigationToggle = document.querySelector('.nav-toggle');
const primaryNavigation = document.querySelector('#primary-navigation');
const analyticsEvents = new Set([
  'click_call',
  'click_directions',
  'click_estimate',
  'click_appointment',
  'form_start',
  'form_submit',
  'form_error',
  'language_change'
]);

function trackAnalyticsEvent(name, details = {}) {
  if (!analyticsEvents.has(name)) {
    return;
  }

  const context = { page: globalThis.location?.pathname ?? '' };
  if (typeof details.form === 'string') {
    context.form = details.form;
  }
  if (typeof details.source === 'string') {
    context.source = details.source;
  }

  document.dispatchEvent(new CustomEvent('amadoranalytics', {
    detail: { name, context }
  }));

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, context);
  }
}

function loadGoogleAnalytics() {
  const configScript = [...document.querySelectorAll('script')]
    .find((script) => script.src.endsWith('/assets/js/main.js') || script.src.includes('/assets/js/main.js?'));

  if (!configScript || document.querySelector('[data-amador-analytics-config]')) {
    return;
  }

  const script = document.createElement('script');
  script.src = new URL('analytics-config.js', configScript.src).href;
  script.dataset.amadorAnalyticsConfig = '';
  script.onload = () => {
    const measurementId = window.AMADOR_ANALYTICS_CONFIG?.googleMeasurementId;
    if (!measurementId || document.querySelector('[data-google-analytics]')) {
      return;
    }

    if (localStorage.getItem('amador-analytics-consent') !== 'granted') {
      showAnalyticsConsent();
      return;
    }

    const analytics = document.createElement('script');
    analytics.async = true;
    analytics.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    analytics.dataset.googleAnalytics = '';
    document.head.append(analytics);
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args) => window.dataLayer.push(args);
    window.gtag('consent', 'default', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
  };
  document.head.append(script);
}

function showAnalyticsConsent() {
  if (document.querySelector('[data-analytics-consent]')) {
    return;
  }

  const notice = document.createElement('aside');
  notice.className = 'analytics-consent';
  notice.dataset.analyticsConsent = '';
  notice.innerHTML = '<p>We use Google Analytics for aggregate site measurement. It does not receive service-request details or form values.</p><button type="button" data-analytics-accept>Allow analytics</button><button type="button" data-analytics-decline>Decline</button>';
  notice.querySelector('[data-analytics-accept]').addEventListener('click', () => {
    localStorage.setItem('amador-analytics-consent', 'granted');
    notice.remove();
    loadGoogleAnalytics();
  });
  notice.querySelector('[data-analytics-decline]').addEventListener('click', () => {
    localStorage.setItem('amador-analytics-consent', 'denied');
    notice.remove();
  });
  document.body.append(notice);
}

loadGoogleAnalytics();

function trackAnalyticsLinkClick(event) {
  const link = event.target.closest?.('a[href]');
  if (!link) {
    return;
  }

  const href = link.getAttribute('href') ?? '';
  const eventName = href.startsWith('tel:') ? 'click_call'
    : href.includes('directions') || href.includes('maps') ? 'click_directions'
      : href.includes('estimate.html') ? 'click_estimate'
        : href.includes('appointment.html') ? 'click_appointment'
          : link.hreflang === 'es' || link.hreflang === 'en' ? 'language_change'
            : null;

  if (eventName) {
    trackAnalyticsEvent(eventName, { source: globalThis.location?.pathname ?? '' });
  }
}

if (navigationToggle && primaryNavigation) {
  const closeNavigation = () => {
    navigationToggle.setAttribute('aria-expanded', 'false');
    primaryNavigation.classList.remove('is-open');
  };

  navigationToggle.addEventListener('click', () => {
    const isOpen = navigationToggle.getAttribute('aria-expanded') === 'true';
    const shouldOpen = !isOpen;
    navigationToggle.setAttribute('aria-expanded', String(shouldOpen));
    primaryNavigation.classList.toggle('is-open', shouldOpen);
  });

  primaryNavigation.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeNavigation();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && primaryNavigation.classList.contains('is-open')) {
      closeNavigation();
    }
  });

  document.addEventListener('click', (event) => {
    if (!primaryNavigation.classList.contains('is-open')) {
      return;
    }

    const target = event.target;
    const clickedToggle = navigationToggle.contains(target);
    const clickedNav = primaryNavigation.contains(target);

    if (!clickedToggle && !clickedNav) {
      closeNavigation();
    }
  });
}

document.addEventListener('click', trackAnalyticsLinkClick);

const serviceRequestEndpoint = window.AMADOR_AUTO_CARE_CONFIG?.serviceRequestEndpoint;
const today = new Date().toISOString().slice(0, 10);
const isSpanish = document.documentElement?.lang === 'es';

document.querySelectorAll('input[type="date"][name="date"]').forEach((input) => {
  input.min = today;
});

document.querySelectorAll('[data-service-request-form]').forEach((form) => {
  let hasStarted = false;

  form.addEventListener('focusin', () => {
    if (!hasStarted) {
      hasStarted = true;
      trackAnalyticsEvent('form_start', { form: form.dataset.requestType });
    }
  });

  const showValidationError = (invalidField) => {
    const status = form.querySelector('[data-form-status]');
    const label = invalidField?.id
      ? form.querySelector(`label[for="${invalidField.id}"]`)?.textContent
      : invalidField?.closest('fieldset')?.querySelector('legend')?.textContent;

    if (status) {
      status.textContent = isSpanish
        ? `Complete ${label?.trim() || 'los campos requeridos'} antes de enviar su solicitud.`
        : `Please complete ${label?.trim() || 'the required fields'} before sending your request.`;
    }
  };

  form.addEventListener('invalid', (event) => {
    showValidationError(event.target);
  }, true);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const status = form.querySelector('[data-form-status]');
    if (!form.checkValidity()) {
      const invalidField = form.querySelector(':invalid');
      showValidationError(invalidField);
      invalidField?.focus();
      trackAnalyticsEvent('form_error', { form: form.dataset.requestType });
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (!serviceRequestEndpoint) {
      if (status) {
        status.textContent = isSpanish
          ? 'Las solicitudes en linea aun no estan configuradas. Llame al taller para conocer los proximos pasos.'
          : 'Online requests are not configured yet. Please call the shop for next steps.';
      }
      return;
    }

    submitButton?.setAttribute('disabled', '');
    if (status) {
      status.textContent = isSpanish ? 'Enviando su solicitud...' : 'Sending your request...';
    }

    try {
      const response = await fetch(serviceRequestEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: form.dataset.requestType,
          fields: Object.fromEntries(new FormData(form).entries())
        })
      });

      if (response.status === 409) {
        throw new Error('duplicate');
      }

      if (!response.ok) {
        throw new Error('Request failed');
      }

      if (status) {
        status.textContent = form.dataset.requestType === 'appointment'
          ? (isSpanish ? 'Su solicitud de cita fue enviada. No esta reservada hasta que el personal la confirme.' : 'Your appointment request was sent. It is not booked until staff confirms it.')
          : (isSpanish ? 'Su solicitud de presupuesto fue enviada. El personal la revisara y se comunicara con usted.' : 'Your estimate request was sent. Staff will review it and follow up.');
        status.scrollIntoView({ block: 'nearest' });
      }
      form.reset();
      trackAnalyticsEvent('form_submit', { form: form.dataset.requestType });
    } catch (error) {
      if (status) {
        status.textContent = error?.message === 'duplicate'
          ? (isSpanish ? 'Esta solicitud ya fue recibida. Llame al taller si necesita agregar informacion.' : 'This request was already received. Please call the shop if you need to add information.')
          : (isSpanish ? 'No pudimos enviar su solicitud. Intentelo de nuevo o llame al taller para conocer los proximos pasos.' : 'We could not send your request. Please try again or call the shop for next steps.');
        status.scrollIntoView({ block: 'nearest' });
      }
      trackAnalyticsEvent('form_error', { form: form.dataset.requestType });
    } finally {
      submitButton?.removeAttribute('disabled');
    }
  });
});