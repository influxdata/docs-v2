// Fake the external widget boundary, including its rendered panel and callbacks.
export function installKapaWidget() {
  const listeners = new Map();
  const panel = document.createElement('aside');
  panel.id = 'kapa-modal-content';
  panel.setAttribute('aria-label', 'Docs agent');
  panel.hidden = true;
  panel.style.cssText =
    'position:fixed;right:0;top:0;height:100vh;width:var(--ask-ai-rail-width);background:#fff;z-index:200;box-sizing:border-box;padding:16px';
  const close = document.createElement('button');
  close.textContent = 'Close chat';
  const history = document.createElement('div');
  const input = document.createElement('textarea');
  input.setAttribute('aria-label', 'Ask the docs agent');
  panel.append(close, history, input);
  document.body.append(panel);
  const emit = (event, detail) =>
    listeners.get(event)?.forEach((handler) => handler(detail));
  const harness = { requests: [], groups: [], finishRender: null };
  const kapa = (event, handler, action) => {
    const handlers = listeners.get(event) || new Set();
    if (action === 'remove') handlers.delete(handler);
    else handlers.add(handler);
    listeners.set(event, handlers);
  };
  kapa.render = ({ onRender }) => {
    harness.finishRender = onRender;
  };
  kapa.setSourceGroupIDs = (groups) => {
    harness.groups = groups;
  };
  kapa.open = (options) => {
    harness.requests.push({ ...options, groups: [...harness.groups] });
    panel.hidden = false;
    input.value = options.query || '';
    emit('onModalOpen');
    input.focus();
    if (options.submit) {
      const message = document.createElement('p');
      message.textContent = options.query;
      history.append(message);
      emit('onAskAIQuerySubmit', { question: options.query });
    }
  };
  kapa.close = () => {
    panel.hidden = true;
    emit('onModalClose');
  };
  close.addEventListener('click', kapa.close);
  window.Kapa = kapa;
  window.kapaHarness = harness;
}

export function mockKapaWidget() {
  cy.intercept('https://widget.kapa.ai/kapa-widget.bundle.js', {
    headers: { 'content-type': 'application/javascript' },
    body: `(${installKapaWidget.toString()})();`,
  });
}
