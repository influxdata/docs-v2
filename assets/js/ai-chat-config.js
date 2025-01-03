
/** The Kapa widget requires the following attributes:
  data-website-id
  data-project-name
  data-project-color
  data-project-logo
*/

/** Set optional dataset attributes and reload the chat.
* Specify camelCase dataset attributes in a chatAttributes object.
* See https://docs.kapa.ai/integrations/website-widget/configuration for 
* available configuration options.
*/

function reload(element, chatAttributes) {
  // Clone the existing script element
  if (!element) {
    return;
  }
  const newElement = element.cloneNode(true);

  if (typeof chatAttributes == 'object') {
    for (const key in chatAttributes) {
      if (chatAttributes.hasOwnProperty(key)) {
        newElement.dataset[key] = chatAttributes[key];
      }
    }
  }

  // Remove the existing script element
  element.remove();
  // Append the new script element to the body
  document.body.appendChild(newElement);
}

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

export default function AIChatConfig({ userid, email, ...chatParams }) {
  // In practice, the userid would typically come from the CookieStore.
  if (userid) {
    setUser(userid, email);
  }

  if (chatParams) {
    const scriptElement = document.querySelector('script[src="https://widget.kapa.ai/kapa-widget.bundle.js"]');
    reload(scriptElement, chatParams);
  }
}
