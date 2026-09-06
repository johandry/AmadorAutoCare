import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';

const scriptSource = fs.readFileSync(new URL('../assets/js/main.js', import.meta.url), 'utf8');

class FakeClassList {
  constructor() {
    this.classes = new Set();
  }

  add(...names) {
    names.forEach((name) => this.classes.add(name));
  }

  remove(...names) {
    names.forEach((name) => this.classes.delete(name));
  }

  toggle(name, force) {
    if (force === undefined) {
      if (this.classes.has(name)) {
        this.classes.delete(name);
        return false;
      }

      this.classes.add(name);
      return true;
    }

    if (force) {
      this.classes.add(name);
      return true;
    }

    this.classes.delete(name);
    return false;
  }

  contains(name) {
    return this.classes.has(name);
  }
}

class FakeAnchorElement {}
class FakeNode {}

function createElement({ id = '', className = '', type = 'button' } = {}) {
  const attributes = new Map();
  const listeners = {};
  const element = {
    id,
    type,
    tagName: type.toUpperCase(),
    className,
    classList: new FakeClassList(),
    attributes: {
      get(name) {
        return attributes.get(name) ?? null;
      },
      set(name, value) {
        attributes.set(name, value);
      }
    },
    listenerMap: listeners,
    addEventListener(eventName, callback) {
      listeners[eventName] = listeners[eventName] || [];
      listeners[eventName].push(callback);
    },
    setAttribute(name, value) {
      attributes.set(name, String(value));
    },
    getAttribute(name) {
      return attributes.get(name) ?? null;
    },
    contains(target) {
      return target === element;
    },
    querySelector(selector) {
      if (selector === '[data-form-status]') {
        return this.formStatus || null;
      }
      return null;
    },
    reportValidity() {
      return true;
    }
  };

  Object.setPrototypeOf(element, FakeNode.prototype);

  if (className) {
    className.split(/\s+/).filter(Boolean).forEach((value) => element.classList.add(value));
  }

  return element;
}

function createDocument({ toggle = null, nav = null, forms = [] } = {}) {
  const listeners = {};
  const document = {
    listeners,
    addEventListener(eventName, callback) {
      listeners[eventName] = listeners[eventName] || [];
      listeners[eventName].push(callback);
    },
    querySelector(selector) {
      if (selector === '.nav-toggle') return toggle;
      if (selector === '#primary-navigation') return nav;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === '[data-demo-form]') return forms;
      return [];
    }
  };

  return document;
}

function loadScript({ toggle = null, nav = null, forms = [] } = {}) {
  const formElements = forms.map((form) => ({
    ...form,
    reportValidity() { return true; },
    querySelector(selector) {
      if (selector === '[data-form-status]') return this.statusElement || null;
      return null;
    },
    addEventListener(eventName, callback) {
      this.listeners = this.listeners || {};
      this.listeners[eventName] = this.listeners[eventName] || [];
      this.listeners[eventName].push(callback);
    }
  }));

  const document = createDocument({ toggle, nav, forms: formElements });
  const context = {
    console,
    document,
    HTMLFormElement: class HTMLFormElement {},
    HTMLAnchorElement: FakeAnchorElement,
    Node: FakeNode,
    window: { document }
  };

  vm.createContext(context);
  vm.runInContext(scriptSource, context);

  return { document, toggle, nav, forms: formElements };
}

test('opens and closes the mobile navigation with the expected accessibility state', () => {
  const toggle = createElement({ id: 'nav-toggle', className: 'nav-toggle' });
  const nav = createElement({ id: 'primary-navigation', className: 'site-nav' });
  nav.contains = (target) => target === nav || target === toggle;
  toggle.setAttribute('aria-expanded', 'false');

  const { document } = loadScript({ toggle, nav });
  const clickHandler = toggle.listenerMap.click[0];

  clickHandler();
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(nav.classList.contains('is-open'), true);

  clickHandler();
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(nav.classList.contains('is-open'), false);

  const keyHandler = document.listeners.keydown?.[0];
  if (keyHandler) {
    keyHandler({ key: 'Escape' });
    assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  }
});

test('does not throw when the nav shell is missing from the page', () => {
  assert.doesNotThrow(() => {
    loadScript({ toggle: null, nav: null, forms: [] });
  });
});

test('closes the navigation when the user presses Escape or clicks outside the menu', () => {
  const toggle = createElement({ className: 'nav-toggle' });
  const nav = createElement({ className: 'site-nav' });
  const outside = createElement({ className: 'content' });
  toggle.setAttribute('aria-expanded', 'false');
  nav.contains = (target) => target === nav;

  const { document } = loadScript({ toggle, nav });
  const toggleHandler = toggle.listenerMap.click[0];
  const escapeHandler = document.listeners.keydown[0];
  const outsideClickHandler = document.listeners.click[0];

  toggleHandler();
  assert.equal(nav.classList.contains('is-open'), true);

  escapeHandler({ key: 'Escape' });
  assert.equal(nav.classList.contains('is-open'), false);

  toggleHandler();
  outsideClickHandler({ target: outside });
  assert.equal(nav.classList.contains('is-open'), false);
});

test('closes the mobile menu when a navigation link is activated', () => {
  const toggle = createElement({ className: 'nav-toggle' });
  const nav = createElement({ className: 'site-nav' });
  const link = new FakeAnchorElement();
  link.closest = () => link;
  nav.contains = (target) => target === nav || target === link;
  toggle.setAttribute('aria-expanded', 'true');

  const { document } = loadScript({ toggle, nav });
  const clickHandler = nav.listenerMap.click[0];

  clickHandler({ target: link });
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(nav.classList.contains('is-open'), false);

  const keyHandler = document.listeners.keydown?.[0];
  if (keyHandler) {
    keyHandler({ key: 'Escape' });
    assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  }
});
