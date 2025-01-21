function setUser(userid, email) {
  const NAMESPACE = 'kapaSettings';

  // Set the user ID and email in the global settings namespace.
  // The chat widget will use this on subsequent chats to personalize the user's experience.
  window[NAMESPACE] = {
    user: {
      uniqueClientId: userid,
      email: email, 
    }
  }
}

// Initialize the chat widget
function initializeChat({onChatLoad, chatAttributes}) {
  /* See https://docs.kapa.ai/integrations/website-widget/configuration for 
   * available configuration options.
   * All values are strings.
   */
  const requiredAttributes = {
    websiteId: 'a02bca75-1dd3-411e-95c0-79ee1139be4d',
    projectName: 'InfluxDB',
    projectColor: '#020a47',
    projectLogo: '/img/influx-logo-cubo-white.png',
  }

  const optionalAttributes = {
    modalDisclaimer: 'This custom AI can access all [documentation for InfluxDB, clients, and related tools](https://docs.influxdata.com). Information you submit is used in accordance with our [Privacy Policy](https://www.influxdata.com/legal/privacy-policy/).',
    modalExampleQuestions: 'Use Python to write data to InfluxDB 3,How do I query using SQL?,How do I use MQTT with Telegraf?',
    buttonHide: 'true',
    modalOpenOnCommandK: 'true',
    modalExampleQuestionsColSpan: '8',
    modalFullScreenOnMobile: 'true',
    modalHeaderPadding: '.5rem',
    modalInnerPositionRight: '0',
    modalInnerPositionLeft: '',
    modalLockScroll: 'false',
    modalOverrideOpenClassAskAi: 'ask-ai-open',
    modalSize: '500px',
    modalWithOverlay: 'false',
    modalInnerMaxWidth: '500px',
    modalXOffset: '1rem',
    modalYOffset: '10vh',
    userAnalyticsFingerprintEnabled: 'true',
    fontFamily: 'Proxima Nova, sans-serif',
    modalHeaderBgColor: 'linear-gradient(90deg, #d30971 0%, #9b2aff 100%)',
    modalHeaderBorderBottom: 'none',
    modalTitleColor: '#fff',
    modalTitleFontSize: '1.25rem',
  }

  const scriptUrl = 'https://widget.kapa.ai/kapa-widget.bundle.js';
  const script = document.createElement('script');
  script.async = true;
  script.src = scriptUrl;
  script.onload = function() {
    onChatLoad();
    window.influxdatadocs.AskAI = AskAI;
  };
  script.onerror = function() {
    console.error('Error loading AI chat widget script');
  };

  const dataset = {...chatAttributes, ...requiredAttributes, ...optionalAttributes};
  Object.keys(dataset).forEach(key => {
     // Assign dataset attributes from the object
    script.dataset[key] = dataset[key];
  });

  // Check for an existing script element to remove
  const oldScript= document.querySelector(`script[src="${scriptUrl}"]`);
  if (oldScript) {
    oldScript.remove();
  }
  document.head.appendChild(script);
}

export default function AskAI({ userid, email, onChatLoad, ...chatParams }) {
   initializeChat({onChatLoad, chatParams});

  // In practice, a userid would typically come from the CookieStore.
  if (userid) {
    setUser(userid, email);
  }
}
