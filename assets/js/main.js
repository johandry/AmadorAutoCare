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