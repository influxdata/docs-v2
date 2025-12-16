/**
 * API Auth Input Component
 *
 * Provides credential input fields for API operations.
 * Stores credentials in sessionStorage for "Try it" requests.
 */

interface ComponentOptions {
  component: HTMLElement;
}

interface AuthCredentials {
  bearer?: string;
  basic?: { username: string; password: string };
  apiKey?: string;
}

const STORAGE_KEY = 'influxdb_api_credentials';

/**
 * Get stored credentials from sessionStorage
 */
function getCredentials(): AuthCredentials {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Store credentials in sessionStorage
 */
function setCredentials(credentials: AuthCredentials): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
}

/**
 * Create the auth input form
 */
function createAuthForm(schemes: string[]): HTMLElement {
  const form = document.createElement('div');
  form.className = 'api-auth-form';
  form.innerHTML = `
    <h4>Authentication</h4>
    <p class="auth-form-description">Enter credentials to use with "Try it" requests.</p>
    ${
      schemes.includes('bearer')
        ? `
    <div class="auth-field">
      <label for="auth-bearer">Bearer Token</label>
      <input type="password" id="auth-bearer" placeholder="Enter your API token" />
    </div>
    `
        : ''
    }
    ${
      schemes.includes('basic')
        ? `
    <div class="auth-field">
      <label for="auth-username">Username</label>
      <input type="text" id="auth-username" placeholder="Username (optional)" />
    </div>
    <div class="auth-field">
      <label for="auth-password">Password / Token</label>
      <input type="password" id="auth-password" placeholder="Enter token" />
    </div>
    `
        : ''
    }
    <button type="button" class="btn btn-primary auth-save">Save Credentials</button>
  `;
  return form;
}

/**
 * Initialize the auth input component
 */
export default function ApiAuthInput({ component }: ComponentOptions): void {
  const schemesAttr = component.dataset.schemes || 'bearer';
  const schemes = schemesAttr.split(',').map((s) => s.trim().toLowerCase());

  const form = createAuthForm(schemes);
  component.appendChild(form);

  // Load existing credentials
  const credentials = getCredentials();
  const bearerInput = form.querySelector<HTMLInputElement>('#auth-bearer');
  const usernameInput = form.querySelector<HTMLInputElement>('#auth-username');
  const passwordInput = form.querySelector<HTMLInputElement>('#auth-password');

  if (bearerInput && credentials.bearer) {
    bearerInput.value = credentials.bearer;
  }
  if (usernameInput && credentials.basic?.username) {
    usernameInput.value = credentials.basic.username;
  }
  if (passwordInput && credentials.basic?.password) {
    passwordInput.value = credentials.basic.password;
  }

  // Save button handler
  const saveBtn = form.querySelector('.auth-save');
  saveBtn?.addEventListener('click', () => {
    const newCredentials: AuthCredentials = {};

    if (bearerInput?.value) {
      newCredentials.bearer = bearerInput.value;
    }
    if (usernameInput?.value || passwordInput?.value) {
      newCredentials.basic = {
        username: usernameInput?.value || '',
        password: passwordInput?.value || '',
      };
    }

    setCredentials(newCredentials);

    // Notify RapiDoc of new credentials
    const rapiDoc = document.querySelector('rapi-doc');
    if (rapiDoc && 'setApiKey' in rapiDoc) {
      (rapiDoc as any).setApiKey(newCredentials.bearer || '');
    }

    alert('Credentials saved for this session');
  });
}
