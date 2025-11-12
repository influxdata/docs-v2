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

// Preinitialize Kapa widget to queue commands before script loads
(function () {
  const k = window.Kapa;
  if (!k) {
    /* eslint-disable no-unused-vars */
    interface KapaQueue {
      (...args: unknown[]): void;
      q?: unknown[][];
      c?: (args: unknown[]) => void;
    }
    /* eslint-enable no-unused-vars */
    const i = function (...args: unknown[]) {
      if (i.c) {
        i.c(args);
      }
    } as KapaQueue;
    i.q = [];
    i.c = function (args: unknown[]) {
      if (i.q) {
        i.q.push(args);
      }
    };
    window.Kapa = i as unknown as KapaFunction;
  }
})();

interface ChatAttributes extends Record<string, string | undefined> {
  modalExampleQuestions?: string;
  modalAskAiInputPlaceholder?: string;
  modalDisclaimer?: string;
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
      chatAttributes.modalDisclaimer ||
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

  return questions.join(',');
}

function getProductSourceGroupIds(): string {
  const sourceGroupIds = getVersionSpecificConfig('ai_source_group_ids') as
    | string
    | undefined;
  return sourceGroupIds || '';
}

function getProductInputPlaceholder(): string {
  const placeholder = getVersionSpecificConfig('ai_input_placeholder') as
    | string
    | undefined;

  // Return product-specific placeholder or default
  return (
    placeholder ||
    'Ask questions about InfluxDB. Specify your product and version ' +
      'for better results'
  );
}

function getProductDisclaimer(): string {
  // Build version-specific note if version is available
  const versionNote =
    version && version !== 'n/a' && productData?.product?.name
      ? `**Viewing documentation for ${productData.product.name}**\n\n`
      : '';

  // Check for product-specific custom disclaimer note
  const customNote = getVersionSpecificConfig('ai_disclaimer_note') as
    | string
    | undefined;
  const noteContent = customNote ? `${customNote}\n\n` : '';

  // Base disclaimer with privacy policy link
  const baseDisclaimer =
    'This AI can access [documentation for InfluxDB, clients, and related tools](https://docs.influxdata.com). Information you submit is used in accordance with our [Privacy Policy](https://www.influxdata.com/legal/privacy-policy/).';

  return `${versionNote}${noteContent}${baseDisclaimer}`;
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
  const modalAskAiInputPlaceholder = getProductInputPlaceholder();
  const modalDisclaimer = getProductDisclaimer();
  const sourceGroupIds = getProductSourceGroupIds();
  const chatAttributes: ChatAttributes = {
    ...(modalExampleQuestions && { modalExampleQuestions }),
    ...(modalAskAiInputPlaceholder && { modalAskAiInputPlaceholder }),
    ...(modalDisclaimer && { modalDisclaimer }),
    ...(sourceGroupIds && { sourceGroupIdsInclude: sourceGroupIds }),
    ...(chatParams as Record<string, string>),
  };

  const wrappedOnChatLoad = (): void => {
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
