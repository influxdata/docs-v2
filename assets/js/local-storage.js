/*
  This represents an API for managing user and client-side settings for the
  InfluxData documentation. It uses the local browser storage.
  
  These functions manage the following InfluxDB settings:

  - influxdata_docs_preferences: Docs UI/UX-related preferences (obj)
  - influxdata_docs_urls: User-defined InfluxDB URLs for each product (obj)
  - influxdata_docs_notifications: 
    - messages: Messages (data/notifications.yaml) that have been seen (array)
    - callouts: Feature callouts that have been seen (array)
*/

// Prefix for all InfluxData docs local storage
const storagePrefix = 'influxdata_docs_';

/*
  Initialize data in local storage with a default value.
*/
initializeLocalStorage = (storageKey, defaultValue) => {
  fullStorageKey = storagePrefix + storageKey;

  // Check if the data exists before initializing the data
  if (localStorage.getItem(fullStorageKey) === null) {
    localStorage.setItem(fullStorageKey, defaultValue);
  }
};

/*
////////////////////////////////////////////////////////////////////////////////
////////////////////////// INFLUXDATA DOCS PREFERENCES /////////////////////////
////////////////////////////////////////////////////////////////////////////////
*/

const prefStorageKey = storagePrefix + 'preferences';

// Default preferences
var defaultPrefObj = {
  api_lib: null,
  influxdb_url: 'cloud',
  sidebar_state: 'open',
  theme: 'light',
  sample_get_started_date: null,
  v3_wayfinding_show: true,
};

/*
  Retrieve a preference from the preference key.
  If the key doesn't exist, initialize it with default values.
*/
getPreference = prefName => {
  // Initialize preference data if it doesn't already exist
  if (localStorage.getItem(prefStorageKey) === null) {
    initializeLocalStorage('preferences', JSON.stringify(defaultPrefObj));
  }

  // Retrieve and parse preferences as JSON
  prefString = localStorage.getItem(prefStorageKey);
  prefObj = JSON.parse(prefString);

  // Return the value of the specified preference
  return prefObj[prefName];
};

// Set a preference in the preferences key
setPreference = (prefID, prefValue) => {
  var prefString = localStorage.getItem(prefStorageKey);
  let prefObj = JSON.parse(prefString);

  prefObj[prefID] = prefValue;

  localStorage.setItem(prefStorageKey, JSON.stringify(prefObj));
};

// Return an object containing all preferences
getPreferences = () => JSON.parse(localStorage.getItem(prefStorageKey));

/*
////////////////////////////////////////////////////////////////////////////////
///////////////////////////// INFLUXDATA DOCS URLS /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
*/

const urlStorageKey = storagePrefix + 'urls';

// Default URLs per product
var defaultUrls = {
  oss: 'http://localhost:8086',
  cloud: 'https://us-west-2-1.aws.cloud2.influxdata.com',
  core: 'http://localhost:8181',
  enterprise: 'http://localhost:8181',
  serverless: 'https://us-east-1-1.aws.cloud2.influxdata.com',
  dedicated: 'cluster-id.a.influxdb.io',
  clustered: 'cluster-host.com',
};

// Defines the default urls value
var defaultUrlsObj = {
  oss: defaultUrls.oss,
  cloud: defaultUrls.cloud,
  serverless: defaultUrls.serverless,
  core: defaultUrls.core,
  enterprise: defaultUrls.enterprise,
  dedicated: defaultUrls.dedicated,
  clustered: defaultUrls.clustered,
  prev_oss: defaultUrls.oss,
  prev_cloud: defaultUrls.cloud,
  prev_core: defaultUrls.core,
  prev_enterprise: defaultUrls.enterprise,
  prev_serverless: defaultUrls.serverless,
  prev_dedicated: defaultUrls.dedicated,
  prev_clustered: defaultUrls.clustered,
  custom: '',
};

// Return an object that contains all InfluxDB urls stored in the urls key
getInfluxDBUrls = () => {
  // Initialize urls data if it doesn't already exist
  if (localStorage.getItem(urlStorageKey) === null) {
    initializeLocalStorage('urls', JSON.stringify(defaultUrlsObj));
  }

  return JSON.parse(localStorage.getItem(urlStorageKey));
};

// Get the current or previous URL for a specific product or a custom url
getInfluxDBUrl = product => {
  // Initialize urls data if it doesn't already exist
  if (localStorage.getItem(urlStorageKey) === null) {
    initializeLocalStorage('urls', JSON.stringify(defaultUrlsObj));
  }

  // Retrieve and parse the URLs as JSON
  urlsString = localStorage.getItem(urlStorageKey);
  urlsObj = JSON.parse(urlsString);

  // Return the URL of the specified product
  return urlsObj[product];
};

/*
  Set multiple product URLs in the urls key.
  Input should be an object where the key is the product and the value is the
  URL to set for that product.
*/
setInfluxDBUrls = updatedUrlsObj => {
  var urlsString = localStorage.getItem(urlStorageKey);
  let urlsObj = JSON.parse(urlsString);

  newUrlsObj = { ...urlsObj, ...updatedUrlsObj };

  localStorage.setItem(urlStorageKey, JSON.stringify(newUrlsObj));
};

// Set an InfluxDB URL to an empty string in the urls key
removeInfluxDBUrl = product => {
  var urlsString = localStorage.getItem(urlStorageKey);
  let urlsObj = JSON.parse(urlsString);

  urlsObj[product] = '';

  localStorage.setItem(urlStorageKey, JSON.stringify(urlsObj));
};

/*
////////////////////////////////////////////////////////////////////////////////
///////////////////////// INFLUXDATA DOCS NOTIFICATIONS ////////////////////////
////////////////////////////////////////////////////////////////////////////////
*/

const notificationStorageKey = storagePrefix + 'notifications';

// Default notifications
var defaultNotificationsObj = {
  messages: [],
  callouts: [],
};

getNotifications = () => {
  // Initialize notifications data if it doesn't already exist
  if (localStorage.getItem(notificationStorageKey) === null) {
    initializeLocalStorage('notifications', JSON.stringify(defaultNotificationsObj));
  }

  // Retrieve and parse the notifications data as JSON
  notificationString = localStorage.getItem(notificationStorageKey);
  notificationObj = JSON.parse(notificationString);

  // Return the notifications object
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

  localStorage.setItem(notificationStorageKey, JSON.stringify(notificationsObj));
};
