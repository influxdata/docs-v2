import AskAI from './ask-ai.js';

function showTrigger(element) {
  // Remove the inline display: none style
  element.removeAttribute('style');
}

export default function AskAITrigger({ element }) {
  const kapaContainer = document.querySelector('#kapa-widget-container');
  if (!element && !kapaContainer) {
    return;
  }
  if (!kapaContainer) {
    // Initialize the chat widget
    AskAI({ onChatLoad: () => showTrigger(element) });
  } else {
    showTrigger(element);
  }
}