const navigationToggle = document.querySelector('.nav-toggle');
const primaryNavigation = document.querySelector('#primary-navigation');

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

const serviceRequestEndpoint = window.AMADOR_AUTO_CARE_CONFIG?.serviceRequestEndpoint;
const today = new Date().toISOString().slice(0, 10);

document.querySelectorAll('input[type="date"][name="date"]').forEach((input) => {
  input.min = today;
});

document.querySelectorAll('[data-service-request-form]').forEach((form) => {
  const showValidationError = (invalidField) => {
    const status = form.querySelector('[data-form-status]');
    const label = invalidField?.id
      ? form.querySelector(`label[for="${invalidField.id}"]`)?.textContent
      : invalidField?.closest('fieldset')?.querySelector('legend')?.textContent;

    if (status) {
      status.textContent = `Please complete ${label?.trim() || 'the required fields'} before sending your request.`;
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
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (!serviceRequestEndpoint) {
      if (status) {
        status.textContent = 'Online requests are not configured yet. Please call the shop for next steps.';
      }
      return;
    }

    submitButton?.setAttribute('disabled', '');
    if (status) {
      status.textContent = 'Sending your request...';
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
          ? 'Your appointment request was sent. It is not booked until staff confirms it.'
          : 'Your estimate request was sent. Staff will review it and follow up.';
        status.scrollIntoView({ block: 'nearest' });
      }
      form.reset();
    } catch (error) {
      if (status) {
        status.textContent = error?.message === 'duplicate'
          ? 'This request was already received. Please call the shop if you need to add information.'
          : 'We could not send your request. Please try again or call the shop for next steps.';
        status.scrollIntoView({ block: 'nearest' });
      }
    } finally {
      submitButton?.removeAttribute('disabled');
    }
  });
});