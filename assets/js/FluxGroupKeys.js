import { groupData } from './flux-group-keys.js';

export default function FluxGroupKeys() {
  // Group and render tables on load
  document.querySelector(tablesElement).addEventListener('load', groupData());
};