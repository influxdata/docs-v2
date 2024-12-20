
/** Delay execution of a function `fn` for a number of milliseconds `ms`
 * e.g., delay a validation handler to avoid annoying the user.
 */
function delay(fn, ms) {
  let timer = 0;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(this, ...args), ms || 0);
  };
}

export { delay };