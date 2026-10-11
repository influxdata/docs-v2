// Fake the external widget boundary, including its rendered panel and callbacks.
export function installKapaWidget(settings) {
  const listeners = new Map();
  const panel = document.createElement('aside');
  panel.id = 'kapa-modal-content';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
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
  const host = document.createElement('div');
  host.id = 'kapa-widget-container';
  host.append(panel);
  document.body.append(host);
  const emit = (event, detail) =>
    listeners.get(event)?.forEach((handler) => handler(detail));
  const harness = Object.assign(
    {
      requests: [],
      groups: [],
      finishRender: null,
      renderFailures: 0,
      openFailures: 0,
      acknowledge: true,
    },
    settings
  );
  const kapa = (event, handler, action) => {
    const handlers = listeners.get(event) || new Set();
    if (action === 'remove') handlers.delete(handler);
    else handlers.add(handler);
    listeners.set(event, handlers);
  };
  kapa.render = ({ onRender }) => {
    if (harness.renderFailures-- > 0) throw new Error('Render failed');
    harness.finishRender = () => {
      Object.assign(kapa, commands);
      onRender();
    };
  };
  kapa.setSourceGroupIDs = (groups) => {
    harness.groups = groups;
  };
  kapa.updateConfig = () => {};
  kapa.open = (options) => {
    if (harness.openFailures-- > 0) throw new Error('Open failed');
    harness.requests.push(
      Object.assign({}, options, { groups: Array.from(harness.groups) })
    );
    panel.hidden = false;
    input.value = options.query || '';
    emit('onModalOpen');
    input.focus();
    if (options.submit) {
      const message = document.createElement('p');
      message.textContent = options.query;
      history.append(message);
      if (harness.acknowledge)
        emit('onAskAIQuerySubmit', { question: options.query });
    }
  };
  kapa.close = () => {
    panel.hidden = true;
    emit('onModalClose');
  };
  close.addEventListener('click', () => kapa.close());
  const commands = {
    open: kapa.open,
    close: kapa.close,
    setSourceGroupIDs: kapa.setSourceGroupIDs,
    updateConfig: kapa.updateConfig,
  };
  delete kapa.open;
  delete kapa.close;
  delete kapa.setSourceGroupIDs;
  delete kapa.updateConfig;
  window.Kapa = kapa;
  window.kapaHarness = harness;
}

export function mockKapaWidget(settings) {
  cy.intercept('https://widget.kapa.ai/kapa-widget.bundle.js', {
    headers: { 'content-type': 'application/javascript' },
    body: `(${installKapaWidget.toString()})(${JSON.stringify(settings || {})});`,
  });
}
