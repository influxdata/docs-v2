
const ANON_USER_ID = null;

function showAIChat() {
    loadCommandAIChat();
    bootCommandAIChat(ANON_USER_ID);
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