/*
  This represents an API for managing cookies for the InfluxData documentation.
  It uses the Cookies.js library to store data as session cookies.
  This is done to comply with cookie privacy laws and limit the cookies used
  to manage the user experience throughout the InfluxData documentation.

  These functions manage the following InfluxDB cookies

  - influxdata_docs_preferences: Docs UI/UX-related preferences (obj)
  - influxdata_docs_urls: User-defined InfluxDB URLs for each product (obj)
  - influxdata_docs_notifications: 
    - messages: Messages (data/notifications.yaml) that have been seen (array)
    - callouts: Feature callouts that have been seen (array)
  - influxdata_docs_ported: Temporary cookie to help port old cookies to new structure
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

/*
////////////////////////////////////////////////////////////////////////////////
////////////////////////// INFLUXDATA DOCS PREFERENCES /////////////////////////
////////////////////////////////////////////////////////////////////////////////
*/

const prefCookieName = cookiePrefix + 'preferences';

// Default preferences
var defaultPref = {
  api_lib: null,
  influxdb_url: 'cloud',
  sidebar_state: 'open',
  theme: 'light',
  sample_get_started_date: null,
  v3_wayfinding_show: true,
};

/*
  Retrieve a preference from the preference cookie.
  If the cookie doesn't exist, initialize it with default values.
*/
getPreference = prefName => {
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

// Return an object containing all preferences
getPreferences = () => JSON.parse(Cookies.get(prefCookieName));

/*
////////////////////////////////////////////////////////////////////////////////
///////////////////////////// INFLUXDATA DOCS URLS /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
*/

const urlCookieName = cookiePrefix + 'urls';

// Default URLs per product
var defaultUrls = {
  oss: 'http://localhost:8086',
  cloud: 'https://us-west-2-1.aws.cloud2.influxdata.com',
  serverless: 'https://us-east-1-1.aws.cloud2.influxdata.com',
  dedicated: 'cluster-id.influxdb.io',
  clustered: 'cluster-host.com',
};

// Defines the default urls cookie value
var defaultUrlsCookie = {
  oss: defaultUrls.oss,
  cloud: defaultUrls.cloud,
  serverless: defaultUrls.serverless,
  dedicated: defaultUrls.dedicated,
  clustered: defaultUrls.clustered,
  prev_oss: defaultUrls.oss,
  prev_cloud: defaultUrls.cloud,
  prev_serverless: defaultUrls.serverless,
  prev_dedicated: defaultUrls.dedicated,
  prev_clustered: defaultUrls.clustered,
  custom: '',
};

// Return an object that contains all InfluxDB urls stored in the urls cookie
getInfluxDBUrls = () => {
  // Initialize the urls cookie if it doesn't already exist
  if (Cookies.get(urlCookieName) === undefined) {
    initializeCookie('urls', defaultUrlsCookie);
  }

  return JSON.parse(Cookies.get(urlCookieName));
};

// Get the current or previous URL for a specific product or a custom url
getInfluxDBUrl = product => {
  // Initialize the urls cookie if it doesn't already exist
  if (Cookies.get(urlCookieName) === undefined) {
    initializeCookie('urls', defaultUrlsCookie);
  }

  // Retrieve and parse the cookie as JSON
  urlsString = Cookies.get(urlCookieName);
  urlsObj = JSON.parse(urlsString);

  // Return the URL of the specified product
  return urlsObj[product];
};

/*
  Set multiple product URLs in the urls cookie.
  Input should be an object where the key is the product and the value is the
  URL to set for that product.
*/
setInfluxDBUrls = updatedUrlsObj => {
  var urlsString = Cookies.get(urlCookieName);
  let urlsObj = JSON.parse(urlsString);

  newUrlsObj = { ...urlsObj, ...updatedUrlsObj };

  Cookies.set(urlCookieName, newUrlsObj);
};

// Set an InfluxDB URL to an empty string in the urls cookie
removeInfluxDBUrl = product => {
  var urlsString = Cookies.get(urlCookieName);
  let urlsObj = JSON.parse(urlsString);

  urlsObj[product] = '';

  Cookies.set(urlCookieName, urlsObj);
};

/*
////////////////////////////////////////////////////////////////////////////////
///////////////////////// INFLUXDATA DOCS NOTIFICATIONS ////////////////////////
////////////////////////////////////////////////////////////////////////////////
*/

const notificationCookieName = cookiePrefix + 'notifications';

// Default notifications
var defaultNotifications = {
  messages: [],
  callouts: [],
};

getNotifications = () => {
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
