import { productData, version } from './page-context.js';

// Type definitions for Kapa.ai widget
declare global {
  interface Window {
    Kapa: KapaFunction;
    influxdatadocs: {
      AskAI: typeof AskAI;
    };
    kapaSettings?: {
      user: {
        uniqueClientId: string;
        email?: string;
      };
    };
  }
}

// eslint-disable-next-line no-unused-vars
type KapaFunction = (command: string, options?: unknown) => void;

interface ChatAttributes extends Record<string, string | undefined> {
  modalExampleQuestions?: string;
  sourceGroupIdsInclude?: string;
}

interface InitializeChatParams {
  onChatLoad: () => void;
  chatAttributes: ChatAttributes;
}

interface AskAIParams {
  userid?: string;
  email?: string;
  onChatLoad?: () => void;
  [key: string]: unknown;
}

function setUser(userid: string, email?: string): void {
  const NAMESPACE = 'kapaSettings';

  // Set the user ID and email in the global settings namespace.
  // The chat widget will use this on subsequent chats to personalize
  // the user's experience.
  window[NAMESPACE] = {
    user: {
      uniqueClientId: userid,
      ...(email && { email }),
    },
  };
}

// Initialize the chat widget
function initializeChat({
  onChatLoad,
  chatAttributes,
}: InitializeChatParams): void {
  /* See https://docs.kapa.ai/integrations/website-widget/configuration for
   * available configuration options.
   * All values are strings.
   */
  // If you make changes to data attributes here, you also need to
  // port the changes to the api-docs/template.hbs API reference template.
  const requiredAttributes = {
    websiteId: 'a02bca75-1dd3-411e-95c0-79ee1139be4d',
    projectName: 'InfluxDB',
    projectColor: '#020a47',
    projectLogo: '/img/influx-logo-cubo-white.png',
  };

  const optionalAttributes = {
    modalDisclaimer:
      'This AI can access [documentation for InfluxDB, clients, and related tools](https://docs.influxdata.com). Information you submit is used in accordance with our [Privacy Policy](https://www.influxdata.com/legal/privacy-policy/).',
    modalExampleQuestions:
      'Use Python to write data to InfluxDB 3,How do I query using SQL?,How do I use MQTT with Telegraf?',
    buttonHide: 'true',
    exampleQuestionButtonWidth: 'auto',
    modalOpenOnCommandK: 'true',
    modalExampleQuestionsColSpan: '8',
    modalFullScreenOnMobile: 'true',
    modalHeaderPadding: '.5rem',
    modalInnerPositionRight: '0',
    modalInnerPositionLeft: '',
    modalLockScroll: 'false',
    modalOverrideOpenClassAskAi: 'ask-ai-open',
    modalSize: '640px',
    modalWithOverlay: 'false',
    modalYOffset: '10vh',
    userAnalyticsFingerprintEnabled: 'true',
    fontFamily: 'Proxima Nova, sans-serif',
    modalHeaderBgColor: 'linear-gradient(90deg, #d30971 0%, #9b2aff 100%)',
    modalHeaderBorderBottom: 'none',
    modalTitleColor: '#fff',
    modalTitleFontSize: '1.25rem',
  };

  const scriptUrl = 'https://widget.kapa.ai/kapa-widget.bundle.js';
  const script = document.createElement('script');
  script.async = true;
  script.src = scriptUrl;
  script.onload = function () {
    onChatLoad();
    window.influxdatadocs.AskAI = AskAI;
  };
  script.onerror = function () {
    console.error('Error loading AI chat widget script');
  };

  const dataset = {
    ...requiredAttributes,
    ...optionalAttributes,
    ...chatAttributes,
  };
  Object.keys(dataset).forEach((key) => {
    // Assign dataset attributes from the object
    const value = dataset[key as keyof typeof dataset];
    if (value !== undefined) {
      script.dataset[key] = value;
    }
  });

  // Check for an existing script element to remove
  const oldScript = document.querySelector(`script[src="${scriptUrl}"]`);
  if (oldScript) {
    oldScript.remove();
  }
  document.head.appendChild(script);
}

function getVersionSpecificConfig(configKey: string): unknown {
  // Try version-specific config first (e.g., ai_sample_questions__v1)
  if (version && version !== 'n/a') {
    const versionKey = `${configKey}__v${version}`;
    const versionConfig = productData?.product?.[versionKey];
    if (versionConfig) {
      return versionConfig;
    }
  }

  // Fall back to default config
  return productData?.product?.[configKey];
}

function getProductExampleQuestions(): string {
  const questions = getVersionSpecificConfig('ai_sample_questions') as
    | string[]
    | undefined;
  if (!questions || questions.length === 0) {
    return '';
  }

  // Only add version hints for InfluxDB database products
  // Other tools like Explorer, Telegraf, Chronograf, Kapacitor,
  // Flux don't need version hints
  const productNamespace = productData?.product?.namespace;
  const shouldAddVersionHint =
    productNamespace === 'influxdb' ||
    productNamespace === 'influxdb3' ||
    productNamespace === 'enterprise_influxdb';

  if (!shouldAddVersionHint) {
    return questions.join(',');
  }

  const productName = productData?.product?.name || 'InfluxDB';

  // Append version hint to each question
  const questionsWithHint = questions.map((question) => {
    return `${question} (My version: ${productName})`;
  });

  return questionsWithHint.join(',');
}

function getProductSourceGroupIds(): string {
  const sourceGroupIds = getVersionSpecificConfig('ai_source_group_ids') as
    | string
    | undefined;
  return sourceGroupIds || '';
}

function getVersionContext(): string {
  // Only add version context for InfluxDB database products
  const productNamespace = productData?.product?.namespace;
  const shouldAddVersionContext =
    productNamespace === 'influxdb' ||
    productNamespace === 'influxdb3' ||
    productNamespace === 'enterprise_influxdb';

  if (!shouldAddVersionContext) {
    return '';
  }

  const productName = productData?.product?.name || 'InfluxDB';

  return `My version: ${productName}`;
}

function setupVersionPrefill(): void {
  const versionContext = getVersionContext();
  if (!versionContext) {
    console.log('[AskAI] No version context needed');
    return;
  }

  console.log('[AskAI] Version context:', versionContext);

  // Wait for Kapa to be available
  const checkKapa = (): void => {
    if (!window.Kapa || typeof window.Kapa !== 'function') {
      console.log('[AskAI] Waiting for Kapa...');
      setTimeout(checkKapa, 100);
      return;
    }

    console.log('[AskAI] Kapa found (preinitialized)');

    // Use Kapa event system to intercept modal opens
    window.Kapa('onModalOpen', () => {
      console.log('[AskAI] Modal opened');

      // Try multiple times with different delays to find the textarea
      const trySetValue = (attempt = 0): void => {
        console.log(`[AskAI] Attempt ${attempt + 1} to find textarea`);

        // Try multiple selectors
        const selectors = [
          'textarea[placeholder*="Ask"]',
          'textarea[placeholder*="ask"]',
          'textarea',
          '#kapa-widget-container textarea',
          '[data-kapa-widget] textarea',
        ];

        let textarea: HTMLTextAreaElement | null = null;
        for (const selector of selectors) {
          textarea = document.querySelector<HTMLTextAreaElement>(selector);
          if (textarea) {
            console.log(`[AskAI] Found textarea with selector: ${selector}`);
            break;
          }
        }

        if (textarea) {
          // Check if it already has a value
          if (!textarea.value || textarea.value.trim() === '') {
            console.log('[AskAI] Setting textarea value to:', versionContext);
            textarea.value = versionContext;

            // Dispatch multiple events to ensure React picks it up
            const inputEvent = new Event('input', { bubbles: true });
            const changeEvent = new Event('change', { bubbles: true });
            textarea.dispatchEvent(inputEvent);
            textarea.dispatchEvent(changeEvent);

            // Focus at the beginning so user can start typing
            textarea.setSelectionRange(0, 0);
            textarea.focus();

            console.log('[AskAI] Version context added to input');
          } else {
            console.log('[AskAI] Textarea already has value:', textarea.value);
          }
        } else if (attempt < 5) {
          // Try again with increasing delays
          const delay = (attempt + 1) * 100;
          console.log(`[AskAI] Textarea not found, retrying in ${delay}ms`);
          setTimeout(() => trySetValue(attempt + 1), delay);
        } else {
          console.log('[AskAI] Failed to find textarea after 5 attempts');
        }
      };

      trySetValue();
    });

    console.log('[AskAI] Version pre-fill setup complete');
  };

  checkKapa();
}

/**
 * Initialize the Ask AI chat widget with version-aware source filtering
 *
 * @param params - Configuration parameters
 * @param params.userid - Optional unique user ID
 * @param params.email - Optional user email
 * @param params.onChatLoad - Optional callback when chat widget loads
 * @param params.chatParams - Additional Kapa widget configuration attributes
 */
export default function AskAI({
  userid,
  email,
  onChatLoad,
  ...chatParams
}: AskAIParams): void {
  const modalExampleQuestions = getProductExampleQuestions();
  const sourceGroupIds = getProductSourceGroupIds();
  const chatAttributes: ChatAttributes = {
    ...(modalExampleQuestions && { modalExampleQuestions }),
    ...(sourceGroupIds && { sourceGroupIdsInclude: sourceGroupIds }),
    ...(chatParams as Record<string, string>),
  };

  const wrappedOnChatLoad = (): void => {
    // Setup version pre-fill after widget loads
    setupVersionPrefill();
    // Call original onChatLoad if provided
    if (onChatLoad) {
      onChatLoad();
    }
  };

  initializeChat({ onChatLoad: wrappedOnChatLoad, chatAttributes });

  if (userid) {
    setUser(userid, email);
  }
}
