/**
 * Selector helper
 * @param {string} selector 
 * @param {Element|Document} context 
 * @returns {Element|null}
 */
export function $(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Multiple selector helper
 * @param {string} selector 
 * @param {Element|Document} context 
 * @returns {Array<Element>}
 */
export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/**
 * Event listener helper
 * @param {Element|Window|Document} element 
 * @param {string} event 
 * @param {Function} handler 
 * @param {object|boolean} options 
 * @returns {Function} cleanup function
 */
export function on(element, event, handler, options = false) {
  if (!element) return () => {};
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
}

/**
 * Trap focus inside a modal/drawer for accessibility
 * @param {Element} element 
 * @returns {Function} cleanup
 */
export function trapFocus(element) {
  const focusableEls = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (!focusableEls.length) return () => {};

  const firstEl = focusableEls[0];
  const lastEl = focusableEls[focusableEls.length - 1];

  firstEl.focus();

  const handleKeyDown = (e) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        lastEl.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastEl) {
        firstEl.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener("keydown", handleKeyDown);
  return () => element.removeEventListener("keydown", handleKeyDown);
}
