const ANON_USER_ID = null;

const COMPONENT = 'influxdata-docs-ai-widget';
const NAMESPACE = 'kapaSettings';

/** Set dataset attributes from the object.
* Keys are camelCase to be added to the script dataset, and represented as 
* data-attr-key in the script HTML tag.
* See https://docs.kapa.ai/integrations/website-widget/configuration for 
* available configuration options.
*/
const REQUIRED_ATTRIBUTES = {
  websiteId: 'a02bca75-1dd3-411e-95c0-79ee1139be4d',
  projectName: 'InfluxDB',
  projectColor: '#020a47',
  projectLogo: 'https://docs.influxdata.com/img/influx-logo-cubo-dark.png',
};

const OPTIONAL_ATTRIBUTES = {
  modalDisclaimer: "This is a custom AI with access to all [documentation for InfluxDB, clients, and related tools](https://docs.influxdata.com). Information you submit is used in accordance with our [Privacy Policy](https://www.influxdata.com/legal/privacy-policy/).",
  modalExampleQuestions: "Use Python to write data to InfluxDB v3,How do I query using SQL?,How do I use MQTT with Telegraf?",
  modalOpenOnCommandK: "true",
  userAnalyticsFingerprintEnabled: "true"
};

function loadAIChat(dataAttributes) {
  const script = document.getElementById(COMPONENT);
  script.async = true;
  script.type = 'text/javascript';
  script.src = 'https://widget.kapa.ai/kapa-widget.bundle.js';

  // All Kapa widget attributes are set as data-* attributes.
  const chatAttributes = Object.assign({}, REQUIRED_ATTRIBUTES, OPTIONAL_ATTRIBUTES);

  for (const key in chatAttributes) {
    if (chatAttributes.hasOwnProperty(key)) {
      script.dataset[key] = chatAttributes[key];
    }
  }

  if (typeof dataAttributes == 'object') {
    for (const key in dataAttributes) {
      if (dataAttributes.hasOwnProperty(key)) {
        script.dataset[key] = chatAttributes[key];
      }
    }
  }
  return script;
}

function setUser(userid, email) {
  // Set the user ID and email in the global settings namespace.
  // The chat widget will use this on subsequent chats to personalize the user's experience.
  window[NAMESPACE] = {
    user: {
      uniqueClientId: userid,
      email: email, 
    }
  }
}

export default function AIChat({ userid, email, ...chatParams }) {
  // For demonstration, set the userid if provided (in practice, it will likely come from a cookie).
  userid && setUser(userid, email);
  const chatEl = loadAIChat(chatParams);
}
