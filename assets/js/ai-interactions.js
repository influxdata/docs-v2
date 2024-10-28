
const ANON_USER_ID = null;

function showAIChat() {
    // Show CommandAI chat
    // loadCommandAIChat();
    // bootCommandAIChat(ANON_USER_ID);
    
    // Show YextAI chat
    loadYextAIChat();
    bootCommandAIChat();
}

function loadCommandAIChat() {
  // https://www.command.ai/docs/platform/installation/installing-in-web-app/

  const ORG_ID='4df4efda';

  var o=ORG_ID,n="https://api.commandbar.com",a=void 0,t=window;
  function r(o,n){void 0===n&&(n=!1),"complete"!==document.readyState&&window.addEventListener("load",r.bind(null,o,n),{capture:!1,once:!0});var a=document.createElement("script");a.type="text/javascript",a.async=n,a.src=o,document.head.appendChild(a)}function e(){var e;if(void 0===t.CommandBar){delete t.__CommandBarBootstrap__;var c=Symbol.for("CommandBar::configuration"),d=Symbol.for("CommandBar::disposed"),i=Symbol.for("CommandBar::isProxy"),m=Symbol.for("CommandBar::queue"),u=Symbol.for("CommandBar::unwrap"),s=Symbol.for("CommandBar::eventSubscriptions"),l=[],p=localStorage.getItem("commandbar.lc");p&&p.includes("local")&&(n="http://localhost:8000",a=void 0);var f=Object.assign(((e={})[c]={uuid:o,api:n,cdn:a},e[d]=!1,e[i]=!0,e[m]=new Array,e[u]=function(){return f},e[s]=void 0,e),t.CommandBar),v=["addCommand","boot","addEventSubscriber","addRecordAction","setFormFactor"],b=f;Object.assign(f,{shareCallbacks:function(){return{}},shareContext:function(){return{}}}),t.CommandBar=new Proxy(f,{get:function(o,n){return n in b?f[n]:"then"!==n?v.includes(n)?function(){var o=Array.prototype.slice.call(arguments);return new Promise((function(a,t){o.unshift(n,a,t),f[m].push(o)}))}:function(){var o=Array.prototype.slice.call(arguments);o.unshift(n),f[m].push(o)}:void 0}}),null!==p&&l.push("lc=".concat(p)),l.push("version=2"),a&&l.push("cdn=".concat(encodeURIComponent(a))),r("".concat(n,"/latest/").concat(o,"?").concat(l.join("&")),!0)}}e();
}

function bootCommandAIChat(userid) {
  // https://www.command.ai/docs/platform/installation/installing-in-web-app/#booting-the-command-bar 
  try {
    (window.CommandBar) ? window.CommandBar.boot(userid) : setTimeout(() => window.CommandBar.boot(userid), 1000);
  } catch (error) {
    console.error('Error booting CommandBar', error);
  }

}

function bootYextAIChat() {
  window.ChatApp.mount({
    apiKey: "c8486ab4b244e31cdba220ce07c3853d",
    botId: "docs-bot",
    title: "AI Chat (experimental)",
    // showRestartButton: true,
    // onClose: () => { /* Your logic here */ },
    showFeedbackButtons: true,
    showTimestamp: true,
    // footer: "",
    // placeholder: "Type a message...",
    // stream: true,
    // inputAutoFocus: true,
    // handleError: (e) => { /* Your error handling logic here */ },
    // onSend: () => { /* Your logic here */ },
    messageSuggestions: ["What is InfluxDB v3?", "How do I write data to InfluxDB?", "How do I use SQL with InfluxDB?"],
    // openOnLoad: true,
    // showHeartBeatAnimation: true,
    // showUnreadNotification: true,
    // showInitialMessagePopUp: true,
    // saveToSessionStorage: true,
    ctaLabel: "AI Chat (experimental)",
  });
}

function loadYextAIChat() {

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://assets.sitescdn.net/chat/v0/chat.css';
  document.head.appendChild(link);

  var style = document.createElement('style');
  style.innerHTML = `
  /* You can override styles by targeting the various yext-chat classes */
  #chat-app .yext-chat-panel__container {
    background-color: #fff;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
  }
  #chat-app .yext-chat-header__container {
    background: linear-gradient(to right, #066FC5, #00A3FF);
    background-color: #00A3FF;
    color: #fff;
    padding: 10px;
  }
  #chat-app .yext-chat-message-bubble__message__bot,
  #chat-app .yext-chat-message-bubble__bubble,
  #chat-app .yext-chat-message-bubble__user,
  #chat-app .yext-chat-pop-up__button {
    background-color: #066FC5;
    color: #1d2129;
  }
  #chat-app .yext-chat-message-bubble__message__user {
    background-color: #0084ff;
    color: #fff;
  }
  #
  `;
  document.head.appendChild(style);

  // https://www.yext.com/docs/ai-assistant/quick
  var script = document.createElement('script');
  script.src = 'https://assets.sitescdn.net/chat/v0/chat.umd.js';
  script.onload = bootYextAIChat;
  document.head.appendChild(script);
}