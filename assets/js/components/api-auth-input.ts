/**
 * API Auth Input Component (Popover)
 *
 * Provides a popover-based credential input for API operations.
 * Integrates with RapiDoc's auth system via JavaScript API.
 *
 * Features:
 * - Popover UI triggered by button click
 * - Filters auth schemes based on operation requirements
 * - Session-only credentials (not persisted to storage)
 * - Syncs with RapiDoc's "Try it" feature
 *
 * Usage:
 * <button data-component="api-auth-input"
 *         data-schemes="bearer,token"
 *         data-popover="true">
 *   Set credentials
 * </button>
 * <div class="api-auth-popover" hidden></div>
 */

interface ComponentOptions {
  component: HTMLElement;
}

interface AuthCredentials {
  bearer?: string;
  basic?: { username: string; password: string };
  querystring?: string;
}

type CleanupFn = () => void;

// In-memory credential storage (not persisted)
let currentCredentials: AuthCredentials = {};

/**
 * Get current credentials (in-memory only)
 */
function getCredentials(): AuthCredentials {
  return currentCredentials;
}

/**
 * Set credentials (in-memory only, not persisted)
 */
function setCredentials(credentials: AuthCredentials): void {
  currentCredentials = credentials;
}

/**
 * Check if any credentials are set
 */
function hasCredentials(): boolean {
  return !!(
    currentCredentials.bearer ||
    currentCredentials.basic?.password ||
    currentCredentials.querystring
  );
}

/**
 * Try to update the visible auth input in RapiDoc's shadow DOM.
 * This provides visual feedback but is not essential for authentication.
 */
function updateRapiDocAuthInput(
  rapiDoc: HTMLElement,
  token: string,
  scheme: 'bearer' | 'token'
): void {
  try {
    const shadowRoot = rapiDoc.shadowRoot;
    if (!shadowRoot) return;

    const headerValue =
      scheme === 'bearer' ? `Bearer ${token}` : `Token ${token}`;

    const authInputSelectors = [
      'input[data-pname="Authorization"]',
      'input[placeholder*="authorization" i]',
      'input[placeholder*="token" i]',
      '.request-headers input[type="text"]',
    ];

    for (const selector of authInputSelectors) {
      const input = shadowRoot.querySelector<HTMLInputElement>(selector);
      if (input && !input.value) {
        input.value = headerValue;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('[API Auth] Updated visible auth input in RapiDoc');
        return;
      }
    }
  } catch (e) {
    console.debug('[API Auth] Could not update visible input:', e);
  }
}

/**
 * Apply credentials to a RapiDoc element
 * Returns true if credentials were successfully applied
 */
function applyCredentialsToRapiDoc(
  rapiDoc: HTMLElement,
  credentials: AuthCredentials
): boolean {
  let applied = false;

  // Clear existing credentials first
  if ('removeAllSecurityKeys' in rapiDoc) {
    try {
      (rapiDoc as any).removeAllSecurityKeys();
    } catch (e) {
      console.warn('[API Auth] Failed to clear existing credentials:', e);
    }
  }

  // Apply bearer/token credentials
  if (credentials.bearer) {
    try {
      // Method 1: HTML attributes (most reliable)
      rapiDoc.setAttribute('api-key-name', 'Authorization');
      rapiDoc.setAttribute('api-key-location', 'header');
      rapiDoc.setAttribute('api-key-value', `Bearer ${credentials.bearer}`);
      console.log('[API Auth] Set auth via HTML attributes');

      // Method 2: JavaScript API for scheme-specific auth
      if ('setApiKey' in rapiDoc) {
        (rapiDoc as any).setApiKey('BearerAuthentication', credentials.bearer);
        (rapiDoc as any).setApiKey('TokenAuthentication', credentials.bearer);
        console.log('[API Auth] Applied bearer/token via setApiKey()');
      }

      applied = true;
      updateRapiDocAuthInput(rapiDoc, credentials.bearer, 'bearer');
    } catch (e) {
      console.error('[API Auth] Failed to set API key:', e);
    }
  }

  // Apply basic auth credentials
  if ('setHttpUserNameAndPassword' in rapiDoc && credentials.basic?.password) {
    try {
      (rapiDoc as any).setHttpUserNameAndPassword(
        'BasicAuthentication',
        credentials.basic.username || '',
        credentials.basic.password
      );
      applied = true;
      console.log('[API Auth] Applied basic auth credentials to RapiDoc');
    } catch (e) {
      console.error('[API Auth] Failed to set basic auth:', e);
    }
  }

  return applied;
}

/**
 * Create auth field HTML for a specific scheme
 */
function createAuthField(scheme: string): string {
  switch (scheme) {
    case 'bearer':
      return `
        <div class="auth-field" data-scheme="bearer">
          <label for="auth-bearer">
            <span class="auth-label-text">API Token</span>
            <span class="auth-label-hint">(Bearer auth)</span>
          </label>
          <div class="auth-input-group">
            <input type="password"
                   id="auth-bearer"
                   placeholder="Enter your API token"
                   autocomplete="off" />
            <button type="button" class="auth-show-toggle" data-target="auth-bearer" aria-label="Show token">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 3C4.5 3 1.5 5.5 0 8c1.5 2.5 4.5 5 8 5s6.5-2.5 8-5c-1.5-2.5-4.5-5-8-5zm0 8c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
              </svg>
            </button>
          </div>
        </div>`;

    case 'token':
      return `
        <div class="auth-field" data-scheme="token">
          <label for="auth-token">
            <span class="auth-label-text">API Token</span>
            <span class="auth-label-hint">(v2 Token scheme)</span>
          </label>
          <div class="auth-input-group">
            <input type="password"
                   id="auth-token"
                   placeholder="Enter your API token"
                   autocomplete="off" />
            <button type="button" class="auth-show-toggle" data-target="auth-token" aria-label="Show token">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 3C4.5 3 1.5 5.5 0 8c1.5 2.5 4.5 5 8 5s6.5-2.5 8-5c-1.5-2.5-4.5-5-8-5zm0 8c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
              </svg>
            </button>
          </div>
        </div>`;

    case 'basic':
      return `
        <div class="auth-field-group" data-scheme="basic">
          <p class="auth-group-label">Basic Authentication <span class="auth-label-hint">(v1 compatibility)</span></p>
          <div class="auth-field">
            <label for="auth-username">Username</label>
            <input type="text"
                   id="auth-username"
                   placeholder="Optional"
                   autocomplete="username" />
          </div>
          <div class="auth-field">
            <label for="auth-password">Password / Token</label>
            <div class="auth-input-group">
              <input type="password"
                     id="auth-password"
                     placeholder="Enter token"
                     autocomplete="current-password" />
              <button type="button" class="auth-show-toggle" data-target="auth-password" aria-label="Show password">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 3C4.5 3 1.5 5.5 0 8c1.5 2.5 4.5 5 8 5s6.5-2.5 8-5c-1.5-2.5-4.5-5-8-5zm0 8c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>`;

    case 'querystring':
      return `
        <div class="auth-field" data-scheme="querystring">
          <label for="auth-querystring">
            <span class="auth-label-text">Query Parameter Token</span>
            <span class="auth-label-hint">(v1 ?p=TOKEN)</span>
          </label>
          <div class="auth-input-group">
            <input type="password"
                   id="auth-querystring"
                   placeholder="Enter token for ?p= parameter"
                   autocomplete="off" />
            <button type="button" class="auth-show-toggle" data-target="auth-querystring" aria-label="Show token">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 3C4.5 3 1.5 5.5 0 8c1.5 2.5 4.5 5 8 5s6.5-2.5 8-5c-1.5-2.5-4.5-5-8-5zm0 8c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
              </svg>
            </button>
          </div>
        </div>`;

    default:
      return '';
  }
}

/**
 * Create the popover content HTML
 */
function createPopoverContent(schemes: string[]): string {
  // If both bearer and token are supported, show combined field
  const hasBearerAndToken =
    schemes.includes('bearer') && schemes.includes('token');
  const displaySchemes = hasBearerAndToken
    ? schemes.filter((s) => s !== 'token')
    : schemes;

  const fields = displaySchemes.map((s) => createAuthField(s)).join('');

  // Adjust label if both bearer and token are supported
  const bearerLabel = hasBearerAndToken
    ? '(Bearer / Token auth)'
    : '(Bearer auth)';

  return `
    <div class="api-auth-popover-content">
      <div class="popover-header">
        <h4>API Credentials</h4>
        <button type="button" class="popover-close" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
      <p class="auth-description">
        Enter credentials for "Try it" requests.
      </p>
      ${fields.replace('(Bearer auth)', bearerLabel)}
      <div class="auth-actions">
        <button type="button" class="btn btn-sm auth-apply">Apply</button>
        <button type="button" class="btn btn-sm btn-secondary auth-clear">Clear</button>
      </div>
      <p class="auth-feedback" hidden></p>
    </div>
  `;
}

/**
 * Show feedback message
 */
function showFeedback(
  container: HTMLElement,
  message: string,
  type: 'success' | 'error'
): void {
  const feedback = container.querySelector<HTMLElement>('.auth-feedback');
  if (feedback) {
    feedback.textContent = message;
    feedback.className = `auth-feedback auth-feedback--${type}`;
    feedback.hidden = false;

    setTimeout(() => {
      feedback.hidden = true;
    }, 3000);
  }
}

/**
 * Update the status indicator on the trigger button
 */
function updateStatusIndicator(trigger: HTMLElement): void {
  const indicator = trigger.querySelector<HTMLElement>(
    '.auth-status-indicator'
  );
  const hasCreds = hasCredentials();

  if (indicator) {
    indicator.hidden = !hasCreds;
  }

  trigger.classList.toggle('has-credentials', hasCreds);
}

/**
 * Initialize the auth input popover component
 */
export default function ApiAuthInput({
  component,
}: ComponentOptions): CleanupFn | void {
  // Component is the trigger button
  const trigger = component;
  const popoverEl = trigger.nextElementSibling as HTMLElement | null;

  if (!popoverEl || !popoverEl.classList.contains('api-auth-popover')) {
    console.error('[API Auth] Popover container not found');
    return;
  }

  // Now TypeScript knows popover is not null
  const popover = popoverEl;

  const schemesAttr = trigger.dataset.schemes || 'bearer';
  const schemes = schemesAttr.split(',').map((s) => s.trim().toLowerCase());

  // Render popover content
  popover.innerHTML = createPopoverContent(schemes);

  // Element references
  const bearerInput = popover.querySelector<HTMLInputElement>('#auth-bearer');
  const tokenInput = popover.querySelector<HTMLInputElement>('#auth-token');
  const usernameInput =
    popover.querySelector<HTMLInputElement>('#auth-username');
  const passwordInput =
    popover.querySelector<HTMLInputElement>('#auth-password');
  const querystringInput =
    popover.querySelector<HTMLInputElement>('#auth-querystring');
  const applyBtn = popover.querySelector<HTMLButtonElement>('.auth-apply');
  const clearBtn = popover.querySelector<HTMLButtonElement>('.auth-clear');
  const closeBtn = popover.querySelector<HTMLButtonElement>('.popover-close');

  /**
   * Toggle popover visibility
   */
  function togglePopover(show?: boolean): void {
    const shouldShow = show ?? popover.hidden;
    popover.hidden = !shouldShow;
    trigger.setAttribute('aria-expanded', String(shouldShow));

    if (shouldShow) {
      // Focus first input when opening
      const firstInput = popover.querySelector<HTMLInputElement>(
        'input:not([type="hidden"])'
      );
      firstInput?.focus();
    }
  }

  /**
   * Close popover
   */
  function closePopover(): void {
    togglePopover(false);
    trigger.focus();
  }

  // Trigger button click
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePopover();
  });

  // Close button
  closeBtn?.addEventListener('click', closePopover);

  // Close on outside click
  function handleOutsideClick(e: MouseEvent): void {
    if (
      !popover.hidden &&
      !popover.contains(e.target as Node) &&
      !trigger.contains(e.target as Node)
    ) {
      closePopover();
    }
  }
  document.addEventListener('click', handleOutsideClick);

  // Close on Escape
  function handleEscape(e: KeyboardEvent): void {
    if (e.key === 'Escape' && !popover.hidden) {
      closePopover();
    }
  }
  document.addEventListener('keydown', handleEscape);

  // Show/hide toggle for password fields
  const showToggles =
    popover.querySelectorAll<HTMLButtonElement>('.auth-show-toggle');
  showToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = popover.querySelector<HTMLInputElement>(`#${targetId}`);
      if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.classList.toggle('showing', !isPassword);
      }
    });
  });

  /**
   * Apply credentials
   */
  function applyCredentials(): void {
    const newCredentials: AuthCredentials = {};

    // Get token from bearer or token input (they're combined for UX)
    const tokenValue = bearerInput?.value || tokenInput?.value;
    if (tokenValue) {
      newCredentials.bearer = tokenValue;
    }

    if (usernameInput?.value || passwordInput?.value) {
      newCredentials.basic = {
        username: usernameInput?.value || '',
        password: passwordInput?.value || '',
      };
    }

    if (querystringInput?.value) {
      newCredentials.querystring = querystringInput.value;
    }

    setCredentials(newCredentials);
    updateStatusIndicator(trigger);

    // Apply to RapiDoc
    const rapiDoc = document.querySelector('rapi-doc') as HTMLElement | null;
    if (rapiDoc && 'setApiKey' in rapiDoc) {
      const applied = applyCredentialsToRapiDoc(rapiDoc, newCredentials);
      if (applied) {
        showFeedback(popover, 'Credentials applied', 'success');
      } else {
        showFeedback(popover, 'No credentials to apply', 'error');
      }
    } else {
      showFeedback(popover, 'Saved (API viewer loading...)', 'success');
    }
  }

  /**
   * Clear credentials
   */
  function clearCredentials(): void {
    if (bearerInput) bearerInput.value = '';
    if (tokenInput) tokenInput.value = '';
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
    if (querystringInput) querystringInput.value = '';

    setCredentials({});
    updateStatusIndicator(trigger);

    // Clear from RapiDoc
    const rapiDoc = document.querySelector('rapi-doc') as HTMLElement | null;
    if (rapiDoc) {
      rapiDoc.removeAttribute('api-key-name');
      rapiDoc.removeAttribute('api-key-location');
      rapiDoc.removeAttribute('api-key-value');

      if ('removeAllSecurityKeys' in rapiDoc) {
        try {
          (rapiDoc as any).removeAllSecurityKeys();
        } catch (e) {
          console.debug('[API Auth] Failed to clear RapiDoc credentials:', e);
        }
      }
    }

    showFeedback(popover, 'Credentials cleared', 'success');
  }

  // Button handlers
  applyBtn?.addEventListener('click', applyCredentials);
  clearBtn?.addEventListener('click', clearCredentials);

  // Listen for RapiDoc spec-loaded event to apply stored credentials
  function handleSpecLoaded(event: Event): void {
    const rapiDoc = event.target as HTMLElement;
    const storedCredentials = getCredentials();
    if (
      storedCredentials.bearer ||
      storedCredentials.basic?.password ||
      storedCredentials.querystring
    ) {
      setTimeout(() => {
        applyCredentialsToRapiDoc(rapiDoc, storedCredentials);
      }, 100);
    }
  }

  // Watch for RapiDoc elements
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLElement && node.tagName === 'RAPI-DOC') {
          node.addEventListener('spec-loaded', handleSpecLoaded);
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Check if RapiDoc already exists
  const existingRapiDoc = document.querySelector('rapi-doc');
  if (existingRapiDoc) {
    existingRapiDoc.addEventListener('spec-loaded', handleSpecLoaded);
  }

  // Initialize status indicator
  updateStatusIndicator(trigger);

  // Cleanup function
  return (): void => {
    observer.disconnect();
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('keydown', handleEscape);
    existingRapiDoc?.removeEventListener('spec-loaded', handleSpecLoaded);
  };
}
