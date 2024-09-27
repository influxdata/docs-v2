import 'rapidoc';

function getUserPreferredUrl() {
  const urlName = window.getPreference && window.getPreference('influxdb_url');
  return getUrls()[urlName] || (window.placeholderUrls && window.placeholderUrls['oss']);
}
  
export function apiDocComponent() {
  window.addEventListener('DOMContentLoaded', (event) => {
    const rapidocEl = document.getElementById('api-doc');
    if(rapidocEl === null) return;
    const apiServer = getUserPreferredUrl();
    rapidocEl.addEventListener('spec-loaded', (e) => {
      rapidocEl.setApiServer(apiServer);
    });
    const spec = JSON.parse(rapidocEl.dataset.openapiSpec);
    rapidocEl.loadSpec(spec);
  });
}

apiDocComponent();