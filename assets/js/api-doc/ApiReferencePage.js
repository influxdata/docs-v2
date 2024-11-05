import { setStyles, setServerUrl, onPreferenceChanged } from './index.js';

export default function ApiReferencePage() {
  const rapidocEl = document.getElementById('api-doc');
  if(rapidocEl === null) return;
  setStyles(rapidocEl);
  setServerUrl(rapidocEl);
  rapidocEl.loadSpec(JSON.parse(rapidocEl.dataset.openapiSpec));
  rapidocEl.addEventListener('spec-loaded', (e) => {});
  cookieStore.addEventListener('change', (e) => {
    if(e.changed) {
      onPreferenceChanged(e, rapidocEl);
    }
  });
}