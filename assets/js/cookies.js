/*
  This represents an API for managing cookies for the InfluxData documentation.
  It uses the Cookies.js library to store data as session cookies.
  This is done to comply with cookie privacy laws and limit the cookies used
  to manage the user experience throughout the InfluxData documentation.

  These functions manage the following InfluxDB cookies

  - influxdata_docs_preferences: Docs UI/UX-related preferences (obj)
  - influxdata_docs_urls: User-defined InfluxDB URLs for each product (obj)
  - influxdata_docs_notifications: 
    - messages_seen: Messages (data/notifications.yaml) that have been seen (array)
    - callouts_seen: Feature callouts that have been seen (array)
*/

// Prefix for all InfluxData docs cookies
const cookiePrefix = 'influxdata_docs_';

/*
  Initialize a cookie with a default value.
*/
initializeCookie = (cookieName, defaultValue) => {
  fullCookieName = cookiePrefix + cookieName;

  // Check if the cookie exists before initializing the cookie
  if (Cookies.get(fullCookieName) === undefined) {
    Cookies.set(fullCookieName, defaultValue);
  }
};

// Initialize all InfluxData docs cookies with defaults
// initializeCookie('urls', {});
// initializeCookie('notifications', {
//   messages_seen: [],
//   callouts_seen: [],
// });

/*
////////////////////////////////////////////////////////////////////////////////
////////////////////////// INFLUXDATA DOCS PREFERENCES /////////////////////////
////////////////////////////////////////////////////////////////////////////////
*/

const prefCookieName = cookiePrefix + 'preferences';

/*
  Retrieve a preference from the preference cookie.
  If the cookie doesn't exist, initialize it with default values.
*/
getPreference = prefName => {
  var defaultPref = {
    api_lib: null,
    product_url: 'oss',
    sidebar_state: 'open',
    theme: 'light',
    sample_get_started_date: '',
    v3_wayfinding_show: true,
  };

  // Initialize the preference cookie if it doesn't already exist
  if (Cookies.get(prefCookieName) === undefined) {
    initializeCookie('preferences', defaultPref);
  }

  // Retrieve and parse the cookie as JSON
  prefString = Cookies.get(prefCookieName);
  prefObj = JSON.parse(prefString);

  // Return the value of the specified preference
  return prefObj[prefName];
};

// Set a preference in the preferences cookie
setPreference = (prefID, prefValue) => {
  var prefString = Cookies.get(prefCookieName);
  let prefObj = JSON.parse(prefString);

  prefObj[prefID] = prefValue;

  Cookies.set(prefCookieName, prefObj);
};

// Helper function for debug
getPreferences = () => JSON.parse(Cookies.get(prefCookieName));

/*
////////////////////////////////////////////////////////////////////////////////
///////////////////////////// INFLUXDATA DOCS URLS /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
*/

const urlCookieName = cookiePrefix + 'urls';

/*
////////////////////////////////////////////////////////////////////////////////
///////////////////////// INFLUXDATA DOCS NOTIFICATIONS ////////////////////////
////////////////////////////////////////////////////////////////////////////////
*/

const notificationCookieName = cookiePrefix + 'notifications';

getNotifications = () => {
  var defaultNotifications = {
    messages: [],
    callouts: [],
  };

  // Initialize the notifications cookie if it doesn't already exist
  if (Cookies.get(notificationCookieName) === undefined) {
    initializeCookie('notifications', defaultNotifications);
  }

  // Retrieve and parse the cookie as JSON
  notificationString = Cookies.get(notificationCookieName);
  notificationObj = JSON.parse(notificationString);

  // Return the value of the specified preference
  return notificationObj;
};

/*
  Checks if a notification is read. Provide the notification ID and one of the
  following notification types:

  - message
  - callout

  If the notification ID exists in the array assigned to the specified type, the
  notification has been read.
*/
notificationIsRead = (notificationID, notificationType) => {
  let notificationsObj = getNotifications();
  readNotifications = notificationsObj[`${notificationType}s`];

  return readNotifications.includes(notificationID);
};

/*
  Sets a notification as read. Provide the notification ID and one of the
  following notification types:

  - message
  - callout

  The notification ID is added to the array assigned to the specified type.
*/
setNotificationAsRead = (notificationID, notificationType) => {
  let notificationsObj = getNotifications();
  let readNotifications = notificationsObj[`${notificationType}s`];

  readNotifications.push(notificationID);
  notificationsObj[notificationType + 's'] = readNotifications;

  Cookies.set(notificationCookieName, notificationsObj);
};
