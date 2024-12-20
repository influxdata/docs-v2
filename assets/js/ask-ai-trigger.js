import AskAI from './ask-ai.js';

function showTrigger(element) {
  // Remove the inline display: none style
  element.removeAttribute('style');
}

export default function AskAITrigger({ component }) {
  const kapaContainer = document.querySelector('#kapa-widget-container');
  if (!component && !kapaContainer) {
    return;
  }
  if (!kapaContainer) {
    // Initialize the chat widget
    AskAI({ onChatLoad: () => showTrigger(component) });
  } else {
    showTrigger(component);
  }
}