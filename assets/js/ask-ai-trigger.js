import AskAI from './ask-ai.js';

/**
 * Global state for Ask AI initialization
 */
const state = {
  kapaInitialized: false,
  linksListenerInitialized: false,
};

/**
 * Initialize the Kapa widget
 */
function initializeKapa() {
  if (!state.kapaInitialized) {
    AskAI();
    state.kapaInitialized = true;

    // Store in global namespace for debugging
    window.influxdatadocs = window.influxdatadocs || {};
    window.influxdatadocs.kapaInitialized = true;
  }
}

/**
 * Show the trigger button by removing inline display: none style
 * @param {HTMLElement} element - The trigger button element
 */
function showTrigger(element) {
  if (element) {
    element.removeAttribute('style');
  }
}

/**
 * Initialize Ask AI trigger button component
 * @param {Object} options - Component options
 * @param {HTMLElement} options.component - The trigger button element
 */
export default function AskAITrigger({ component }) {
  const kapaContainer = document.querySelector('#kapa-widget-container');

  if (!component && !kapaContainer) {
    return;
  }

  if (!kapaContainer) {
    // Initialize the chat widget
    AskAI({ onChatLoad: () => showTrigger(component) });
    state.kapaInitialized = true;
    window.influxdatadocs = window.influxdatadocs || {};
    window.influxdatadocs.kapaInitialized = true;
  } else {
    showTrigger(component);
  }
}

/**
 * Handle ask-ai-link clicks globally
 * This ensures ask-ai-link shortcodes work even without the trigger button
 */
function handleAskAILinks() {
  if (state.linksListenerInitialized) {
    return;
  }

  state.linksListenerInitialized = true;

  // Store in global namespace for debugging
  window.influxdatadocs = window.influxdatadocs || {};
  window.influxdatadocs.askAILinksInitialized = true;

  // Listen for clicks on ask-ai-link elements
  document.addEventListener(
    'click',
    (event) => {
      const link = event.target.closest('.ask-ai-open');
      if (!link) return;

      const query = link.getAttribute('data-query');
      const sourceGroupIds = link.getAttribute('data-source-group-ids');

      // Initialize Kapa if not already done
      if (!state.kapaInitialized) {
        initializeKapa();

        // Wait for Kapa to be ready, then open with query
        if (query && window.Kapa?.open) {
          // Give Kapa a moment to initialize
          setTimeout(() => {
            if (window.Kapa?.open) {
              const openOptions = {
                mode: 'ai',
                query: query,
              };
              // Add source group IDs if provided
              if (sourceGroupIds) {
                openOptions.sourceGroupIdsInclude = sourceGroupIds;
              }
              window.Kapa.open(openOptions);
            }
          }, 100);
        }
      } else {
        // Kapa is already initialized - open with query if provided
        if (query && window.Kapa?.open) {
          const openOptions = {
            mode: 'ai',
            query: query,
          };
          // Add source group IDs if provided
          if (sourceGroupIds) {
            openOptions.sourceGroupIdsInclude = sourceGroupIds;
          }
          window.Kapa.open(openOptions);
        }
      }
    },
    { passive: true }
  );
}

// Initialize ask-ai-link handling when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleAskAILinks);
} else {
  handleAskAILinks();
}
