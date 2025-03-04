import { getPreference } from '../cookies.js';
import { getUrls } from '../influxdb-url.js';

function getUserPreferredUrl() {
  const urlName = getPreference('influxdb_url');
  return getUrls()[urlName];
}

export function setServerUrl(el) {
  const baseUrl = getUserPreferredUrl();
  el.setAttribute('server-url', baseUrl);
  el.setApiServer(baseUrl);
}


