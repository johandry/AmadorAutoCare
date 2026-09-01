const navigationToggle = document.querySelector('.nav-toggle');
const primaryNavigation = document.querySelector('#primary-navigation');

if (navigationToggle && primaryNavigation) {
  navigationToggle.addEventListener('click', () => {
    const isOpen = navigationToggle.getAttribute('aria-expanded') === 'true';
    navigationToggle.setAttribute('aria-expanded', String(!isOpen));
    primaryNavigation.classList.toggle('is-open', !isOpen);
  });

  primaryNavigation.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navigationToggle.setAttribute('aria-expanded', 'false');
      primaryNavigation.classList.remove('is-open');
    }
  });
}

document.querySelectorAll('[data-demo-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!(form instanceof HTMLFormElement) || !form.reportValidity()) {
      return;
    }

    const status = form.querySelector('[data-form-status]');
    if (status) {
      status.textContent = 'Walking skeleton complete: the form is valid, but no information was sent. A form provider must be selected before launch.';
      status.scrollIntoView({ block: 'nearest' });
    }
  });
});