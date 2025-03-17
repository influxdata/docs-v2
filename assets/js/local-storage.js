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
import * as pageParams from '@params';

// Prefix for all InfluxData docs local storage
const storagePrefix = 'influxdata_docs_';

/*
  Initialize data in local storage with a default value.
*/
function initializeStorageItem(storageKey, defaultValue) {
  const fullStorageKey = storagePrefix + storageKey;

  // Check if the data exists before initializing the data
  if (localStorage.getItem(fullStorageKey) === null) {
    localStorage.setItem(fullStorageKey, defaultValue);
  }
}

/*
////////////////////////////////////////////////////////////////////////////////
////////////////////////// INFLUXDATA DOCS PREFERENCES /////////////////////////
////////////////////////////////////////////////////////////////////////////////
*/

const prefStorageKey = storagePrefix + 'preferences';

// Default preferences
const defaultPrefObj = {
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
function getPreference(prefName) {
  // Initialize preference data if it doesn't already exist
  if (localStorage.getItem(prefStorageKey) === null) {
    initializeStorageItem('preferences', JSON.stringify(defaultPrefObj));
  }

  // Retrieve and parse preferences as JSON
  const prefString = localStorage.getItem(prefStorageKey);
  const prefObj = JSON.parse(prefString);

  // Return the value of the specified preference
  return prefObj[prefName];
}

// Set a preference in the preferences key
function setPreference(prefID, prefValue) {
  const prefString = localStorage.getItem(prefStorageKey);
  const prefObj = JSON.parse(prefString);

  prefObj[prefID] = prefValue;

  localStorage.setItem(prefStorageKey, JSON.stringify(prefObj));
}

// Return an object containing all preferences
function getPreferences() {
  return JSON.parse(localStorage.getItem(prefStorageKey));
}

////////////////////////////////////////////////////////////////////////////////
//////////// MANAGE INFLUXDATA DOCS URLS IN LOCAL STORAGE //////////////////////
////////////////////////////////////////////////////////////////////////////////


const defaultUrls = {};
// Guard against pageParams being null/undefined and safely access nested properties
if (pageParams && pageParams.influxdb_urls) {
  Object.entries(pageParams.influxdb_urls).forEach(([product, {providers}]) => {
  defaultUrls[product] = providers.filter(provider => provider.name === 'Default')[0]?.regions[0]?.url;
  });
}

export const DEFAULT_STORAGE_URLS = {
  oss: defaultUrls.oss,
  cloud: defaultUrls.cloud,
  serverless: defaultUrls.serverless,
  core: defaultUrls.core,
  enterprise: defaultUrls.enterprise,
  dedicated: defaultUrls.cloud_dedicated,
  clustered: defaultUrls.clustered,
  prev_oss: defaultUrls.oss,
  prev_cloud: defaultUrls.cloud,
  prev_core: defaultUrls.core,
  prev_enterprise: defaultUrls.enterprise,
  prev_serverless: defaultUrls.serverless,
  prev_dedicated: defaultUrls.cloud_dedicated,
  prev_clustered: defaultUrls.clustered,
  custom: '',
};

const urlStorageKey = storagePrefix + 'urls';

// Return an object that contains all InfluxDB urls stored in the urls key
function getInfluxDBUrls() {
  // Initialize urls data if it doesn't already exist
  if (localStorage.getItem(urlStorageKey) === null) {
    initializeStorageItem('urls', JSON.stringify(DEFAULT_STORAGE_URLS));
  }

  return JSON.parse(localStorage.getItem(urlStorageKey));
}

// Get the current or previous URL for a specific product or a custom url
function getInfluxDBUrl(product) {
  // Initialize urls data if it doesn't already exist
  if (localStorage.getItem(urlStorageKey) === null) {
    initializeStorageItem('urls', JSON.stringify(DEFAULT_STORAGE_URLS));
  }

  // Retrieve and parse the URLs as JSON
  const urlsString = localStorage.getItem(urlStorageKey);
  const urlsObj = JSON.parse(urlsString);

  // Return the URL of the specified product
  return urlsObj[product];
}

/*
  Set multiple product URLs in the urls key.
  Input should be an object where the key is the product and the value is the
  URL to set for that product.
*/
function setInfluxDBUrls(updatedUrlsObj) {
  const urlsString = localStorage.getItem(urlStorageKey);
  const urlsObj = JSON.parse(urlsString);

  const newUrlsObj = { ...urlsObj, ...updatedUrlsObj };

  localStorage.setItem(urlStorageKey, JSON.stringify(newUrlsObj));
}

// Set an InfluxDB URL to an empty string in the urls key
function removeInfluxDBUrl(product) {
  const urlsString = localStorage.getItem(urlStorageKey);
  const urlsObj = JSON.parse(urlsString);

  urlsObj[product] = '';

  localStorage.setItem(urlStorageKey, JSON.stringify(urlsObj));
}

/*
////////////////////////////////////////////////////////////////////////////////
///////////////////////// INFLUXDATA DOCS NOTIFICATIONS ////////////////////////
////////////////////////////////////////////////////////////////////////////////
*/

const notificationStorageKey = storagePrefix + 'notifications';

// Default notifications
const defaultNotificationsObj = {
  messages: [],
  callouts: [],
};

function getNotifications() {
  // Initialize notifications data if it doesn't already exist
  if (localStorage.getItem(notificationStorageKey) === null) {
    initializeStorageItem('notifications', JSON.stringify(defaultNotificationsObj));
  }

  // Retrieve and parse the notifications data as JSON
  const notificationString = localStorage.getItem(notificationStorageKey);
  const notificationObj = JSON.parse(notificationString);

  // Return the notifications object
  return notificationObj;
}

/*
  Checks if a notification is read. Provide the notification ID and one of the
  following notification types:

  - message
  - callout

  If the notification ID exists in the array assigned to the specified type, the
  notification has been read.
*/
function notificationIsRead(notificationID, notificationType) {
  const notificationsObj = getNotifications();
  const readNotifications = notificationsObj[`${notificationType}s`];

  return readNotifications.includes(notificationID);
}

/*
  Sets a notification as read. Provide the notification ID and one of the
  following notification types:

  - message
  - callout

  The notification ID is added to the array assigned to the specified type.
*/
function setNotificationAsRead(notificationID, notificationType) {
  const notificationsObj = getNotifications();
  const readNotifications = notificationsObj[`${notificationType}s`];

  readNotifications.push(notificationID);
  notificationsObj[notificationType + 's'] = readNotifications;

  localStorage.setItem(notificationStorageKey, JSON.stringify(notificationsObj));
}

// Export functions as a module and make the file backwards compatible for non-module environments until all remaining dependent scripts are ported to modules
export {
  defaultUrls,
  initializeStorageItem,
  getPreference,
  setPreference,
  getPreferences,
  getInfluxDBUrls,
  getInfluxDBUrl,
  setInfluxDBUrls,
  removeInfluxDBUrl,
  getNotifications,
  notificationIsRead,
  setNotificationAsRead,
};
