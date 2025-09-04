import { productData } from './page-context.js';

function setUser(userid, email) {
  const NAMESPACE = 'kapaSettings';

  // Set the user ID and email in the global settings namespace.
  // The chat widget will use this on subsequent chats to personalize the user's experience.
  window[NAMESPACE] = {
    user: {
      uniqueClientId: userid,
      email: email,
    },
  };
}

// Initialize the chat widget
function initializeChat({ onChatLoad, chatAttributes }) {
  /* See https://docs.kapa.ai/integrations/website-widget/configuration for
   * available configuration options.
   * All values are strings.
   */
  // If you make changes to data attributes here, you also need to
  // port the changes to the api-docs/template.hbs API reference template.
  const requiredAttributes = {
    websiteId: 'a02bca75-1dd3-411e-95c0-79ee1139be4d',
    projectName: 'InfluxDB',
    projectColor: '#020a47',
    projectLogo: '/img/influx-logo-cubo-white.png',
  };

  const optionalAttributes = {
    modalDisclaimer:
      'This AI can access [documentation for InfluxDB, clients, and related tools](https://docs.influxdata.com). Information you submit is used in accordance with our [Privacy Policy](https://www.influxdata.com/legal/privacy-policy/).',
    modalExampleQuestions:
      'Use Python to write data to InfluxDB 3,How do I query using SQL?,How do I use MQTT with Telegraf?',
    buttonHide: 'true',
    exampleQuestionButtonWidth: 'auto',
    modalOpenOnCommandK: 'true',
    modalExampleQuestionsColSpan: '8',
    modalFullScreenOnMobile: 'true',
    modalHeaderPadding: '.5rem',
    modalInnerPositionRight: '0',
    modalInnerPositionLeft: '',
    modalLockScroll: 'false',
    modalOverrideOpenClassAskAi: 'ask-ai-open',
    modalSize: '640px',
    modalWithOverlay: 'false',
    modalYOffset: '10vh',
    userAnalyticsFingerprintEnabled: 'true',
    fontFamily: 'Proxima Nova, sans-serif',
    modalHeaderBgColor: 'linear-gradient(90deg, #d30971 0%, #9b2aff 100%)',
    modalHeaderBorderBottom: 'none',
    modalTitleColor: '#fff',
    modalTitleFontSize: '1.25rem',
  };

  const scriptUrl = 'https://widget.kapa.ai/kapa-widget.bundle.js';
  const script = document.createElement('script');
  script.async = true;
  script.src = scriptUrl;
  script.onload = function () {
    onChatLoad();
    window.influxdatadocs.AskAI = AskAI;
  };
  script.onerror = function () {
    console.error('Error loading AI chat widget script');
  };

  const dataset = {
    ...requiredAttributes,
    ...optionalAttributes,
    ...chatAttributes,
  };
  Object.keys(dataset).forEach((key) => {
    // Assign dataset attributes from the object
    script.dataset[key] = dataset[key];
  });

  // Check for an existing script element to remove
  const oldScript = document.querySelector(`script[src="${scriptUrl}"]`);
  if (oldScript) {
    oldScript.remove();
  }
  document.head.appendChild(script);
}

function getProductExampleQuestions() {
  const questions = productData?.product?.ai_sample_questions;
  return questions?.join(',') || '';
}

/**
 * chatParams: specify custom (for example, page-specific) attribute values for the chat, pass the dataset key-values (collected in ...chatParams). See https://docs.kapa.ai/integrations/website-widget/configuration for available configuration options.
 * onChatLoad: function to call when the chat widget has loaded
 * userid: optional, a unique user ID for the user (not currently used for public docs)
 */
export default function AskAI({ userid, email, onChatLoad, ...chatParams }) {
  const modalExampleQuestions = getProductExampleQuestions();
  const chatAttributes = {
    ...(modalExampleQuestions && { modalExampleQuestions }),
    ...chatParams,
  };
  initializeChat({ onChatLoad, chatAttributes });

  if (userid) {
    setUser(userid, email);
  }
}
