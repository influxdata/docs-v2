const ANON_USER_ID = null;

const ELEMENT_ID = 'influxdata-docs-ai-widget';
const OBJECT_NAME = 'kapaSettings';

  // Set dataset attributes from the object
  const chatRequiredAttributes = {
    websiteId: 'ORG_ID',
    projectName: 'InfluxData Docs',
    projectColor: '#0058A0',
    projectLogo: 'https://docs.influxdata.com/public/img/influx-logo-cubo-dark.png',
  };

  const chatOptionalAttributes = {
    modalDisclaimer: "This is a custom LLM with access to all [documentation for InfluxDB and related tools](https://docs.influxdata.com).",
    modalExampleQuestions: "How do I use Python to write data?,How do I query using SQL?",
    modalOpenOnCommandK: "true",
    userAnalyticsFingerprintEnabled: "true"
  };

function loadAIChat(customconfig) {
  // https://www.command.ai/docs/platform/installation/installing-in-web-app/

  var script = document.createElement('script');
  script.async = true;
  script.type = 'text/javascript';
  script.src = 'https://widget.kapa.ai/kapa-widget.bundle.js';
  script.id = ELEMENT_ID;

  for (const key in chatRequiredAttributes) {
    if (chatRequiredAttributes.hasOwnProperty(key)) {
      script.dataset[key] = chatRequiredAttributes[key];
    }
  }

  for (const key in chatOptionalAttributes) {
    if (chatOptionalAttributes.hasOwnProperty(key)) {
      script.dataset[key] = chatOptionalAttributes[key];
    }
  }

  if (typeof customconfig === 'object') {
    for (const key in customconfig) {
      if (customconfig.hasOwnProperty(key)) {
        script.dataset[key] = customconfig[key];
      }
    }
  }

  script.onload = () => {
    document.head.appendChild(script);
  }
}

function setUser(userid, email) {
  // Set the user ID and email in the global object
  window[OBJECT_NAME] = {
    user: {
      uniqueClientId: userid,
      email: email, 
    }
  }
}

/* Reload the AI widget with the given user ID and new configuration */
function bootAIChat(userid, chatconfig) {
  // let script = document.getElementById(ELEMENT_ID);
  // let config = typeof chatconfig === 'object' ? Object.assign({}, defaultConfig, chatconfig) : defaultConfig;
  // // try {
  // //   (window.CommandBar) ? window.CommandBar.boot(userid) : setTimeout(() => window.CommandBar.boot(userid), 1000);
  // // } catch (error) {
  // //   console.error('Error booting AI widget', error);
  // // }
  
  // // script.src = 'https://widget.kapa.ai/kapa-widget.bundle.js';
  // // window.influxdatadocs = window.influxdatadocs || {};
  // // window.influxdatadocs.chat = window.influxdatadocs.chat || {};
  // // window.influxdatadocs.chat.config = config;
}

export default function AIChat(chatconfig) {
  if (typeof chatconfig === 'object') {
   if (window[OBJECT_NAME] && chatconfig.userid) {
      // Realistically, the user ID would likely come from a cookie.
      setUser(chatconfig.userid, chatconfig.email);
      chatconfig.userid = undefined;
      chatconfig.email = undefined;
    }
  }
  loadAIChat(chatconfig);
}
