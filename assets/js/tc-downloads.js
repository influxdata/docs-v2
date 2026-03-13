////////////////////////////////////////////////////////////////////////////////
///////////////// Telegraf Controller gated downloads module ////////////////////
////////////////////////////////////////////////////////////////////////////////

import { toggleModal } from './modals.js';

const STORAGE_KEY = 'influxdata_docs_tc_dl';
const QUERY_PARAM = 'ref';
const QUERY_VALUE = 'tc';

// ─── localStorage helpers ───────────────────────────────────────────────────

function setDownloadKey() {
  localStorage.setItem(STORAGE_KEY, 'true');
}

function hasDownloadKey() {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

// ─── Query param helpers ────────────────────────────────────────────────────

function hasRefParam() {
  // Check query string first (?ref=tc before the hash)
  const params = new URLSearchParams(window.location.search);
  if (params.get(QUERY_PARAM) === QUERY_VALUE) return true;

  // Also check inside the fragment (#heading?ref=tc)
  const hash = window.location.hash;
  const qIndex = hash.indexOf('?');
  if (qIndex !== -1) {
    const hashParams = new URLSearchParams(hash.substring(qIndex));
    if (hashParams.get(QUERY_PARAM) === QUERY_VALUE) return true;
  }
  return false;
}

function stripRefParam() {
  const url = new URL(window.location.href);

  // Remove from query string
  url.searchParams.delete(QUERY_PARAM);

  // Remove from fragment if present (#heading?ref=tc → #heading)
  let hash = url.hash;
  const qIndex = hash.indexOf('?');
  if (qIndex !== -1) {
    const hashBase = hash.substring(0, qIndex);
    const hashParams = new URLSearchParams(hash.substring(qIndex));
    hashParams.delete(QUERY_PARAM);
    const remaining = hashParams.toString();
    hash = remaining ? `${hashBase}?${remaining}` : hashBase;
  }

  window.history.replaceState({}, '', url.pathname + url.search + hash);
}

// ─── Download link rendering ────────────────────────────────────────────────

function renderDownloadLinks(container, data) {
  const version = data.version;
  const platforms = data.platforms;

  let html = '<div class="tc-downloads-container">';

  platforms.forEach((platform) => {
    html += `<h3>${platform.name}</h3>`;
    html +=
      '<p class="tc-version">' +
      `<em>Telegraf Controller v${version}</em>` +
      '</p>';
    html += '<div class="tc-build-table">';

    platform.builds.forEach((build) => {
      const link =
        `<a href="${build.url}"` +
        ' class="btn tc-download-link download"' +
        ` download>${platform.name}` +
        ` (${build.arch})</a>`;
      const sha =
        `<code>sha256:${build.sha256}</code>` +
        '<button class="tc-copy-sha"' +
        ` data-sha="${build.sha256}">` +
        '&#59693;</button>';
      html +=
        '<div class="tc-build-row">' +
        `<div class="tc-build-download">${link}</div>` +
        `<div class="tc-build-sha">${sha}</div>` +
        '</div>';
    });

    html += '</div>';
  });

  container.innerHTML = html;
}

// ─── Clipboard copy ─────────────────────────────────────────────────────────

function copyToClipboard(sha, button) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(sha).then(() => {
      showCopiedFeedback(button);
    });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = sha;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showCopiedFeedback(button);
  }
}

function showCopiedFeedback(button) {
  const original = button.innerHTML;
  button.innerHTML = '&#59671;';
  setTimeout(() => {
    button.innerHTML = original;
  }, 2000);
}

// ─── Marketo form ───────────────────────────────────────────────────────────

function initMarketoForm() {
  /* global MktoForms2 */
  if (typeof MktoForms2 === 'undefined') {
    console.error('tc-downloads: MktoForms2 not loaded');
    return;
  }

  MktoForms2.setOptions({
    formXDPath: '/rs/972-GDU-533/images/marketo-xdframe-relative.html',
  });

  MktoForms2.loadForm(
    'https://get.influxdata.com',
    '972-GDU-533',
    3195,
    function (form) {
      form.addHiddenFields({ mkto_content_name: 'Telegraf Enterprise Alpha' });

      form.onSuccess(function () {
        setDownloadKey();
        toggleModal();

        // Redirect to self with ?ref=tc to trigger downloads on reload
        const url = new URL(window.location.href);
        url.searchParams.set(QUERY_PARAM, QUERY_VALUE);
        window.location.href = url.toString();

        // Prevent Marketo's default redirect
        return false;
      });
    }
  );
}

// ─── View state management ──────────────────────────────────────────────────

function showDownloads(area) {
  const btn = area.querySelector('#tc-download-btn');
  const linksContainer = area.querySelector('#tc-downloads-links');

  if (!linksContainer) return;

  // Parse download data from the JSON data attribute
  const rawData = linksContainer.getAttribute('data-downloads');
  if (!rawData) return;

  let data;
  try {
    data = JSON.parse(atob(rawData));
  } catch (e) {
    console.error('tc-downloads: failed to parse download data', e);
    return;
  }

  // Hide the download button
  if (btn) btn.style.display = 'none';

  // Render download links and show the container
  renderDownloadLinks(linksContainer, data);
  linksContainer.style.display = 'block';
}

// ─── Initialize ─────────────────────────────────────────────────────────────

function initialize() {
  // 1. Handle ?ref=tc query param on any page
  if (hasRefParam()) {
    setDownloadKey();
    stripRefParam();
  }

  const area = document.getElementById('tc-downloads-area');
  if (!area) return; // No shortcode on this page — no-op

  // 2. Check localStorage and show appropriate view
  if (hasDownloadKey()) {
    showDownloads(area);
  }

  // 3. Initialize Marketo form
  initMarketoForm();

  // 4. Delegated click handler for SHA copy buttons
  area.addEventListener('click', function (e) {
    const copyBtn = e.target.closest('.tc-copy-sha');
    if (copyBtn) {
      const sha = copyBtn.getAttribute('data-sha');
      if (sha) copyToClipboard(sha, copyBtn);
    }
  });
}

export { initialize };
