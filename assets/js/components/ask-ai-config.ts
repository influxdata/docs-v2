import { productData, version } from '../page-context.js';

function setting(key: string): unknown {
  const product = productData.product;
  if (typeof product !== 'object' || product === null) return undefined;
  return product[`${key}__v${version}`] || product[key];
}

export function pageSourceGroups(): string[] {
  const value = setting('ai_source_group_ids');
  return typeof value === 'string'
    ? value
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
    : [];
}

export function widgetAttributes(): Record<string, string> {
  const questions = setting('ai_sample_questions');
  const placeholder = setting('ai_input_placeholder');
  const note = setting('ai_disclaimer_note');
  const disclaimer =
    'This AI can access [documentation for InfluxDB, clients, and related tools](https://docs.influxdata.com). Information you submit is used in accordance with our [Privacy Policy](https://www.influxdata.com/legal/privacy-policy/).';
  return {
    websiteId: 'a02bca75-1dd3-411e-95c0-79ee1139be4d',
    projectName: 'InfluxDB',
    projectColor: '#020a47',
    projectLogo: '/img/influx-logo-cubo-white.png',
    renderOnLoad: 'false',
    viewMode: 'sidebar',
    buttonHide: 'true',
    modalLockScroll: 'false',
    modalFullScreenOnMobile: 'true',
    modalInnerPointerEvents: 'none',
    modalContentPointerEvents: 'auto',
    colorSchemeSelector: 'body[data-theme="dark"]',
    userAnalyticsFingerprintEnabled: 'true',
    fontFamily: 'Proxima Nova, sans-serif',
    modalHeaderPadding: '.5rem',
    modalHeaderBgColor: 'linear-gradient(90deg, #d30971 0%, #9b2aff 100%)',
    modalHeaderBorderBottom: 'none',
    modalTitleColor: '#fff',
    modalTitleFontSize: '1.25rem',
    modalDisclaimer:
      typeof note === 'string' ? `${note}\n\n${disclaimer}` : disclaimer,
    modalExampleQuestions:
      Array.isArray(questions) && questions.every((q) => typeof q === 'string')
        ? questions.join(',')
        : 'Use Python to write data to InfluxDB 3,How do I query using SQL?,How do I use MQTT with Telegraf?',
    exampleQuestionButtonWidth: 'auto',
    modalAskAiInputPlaceholder:
      typeof placeholder === 'string'
        ? placeholder
        : 'Ask questions about InfluxDB. Specify your product and version for better results',
    mcpEnabled: 'true',
    mcpServerUrl: 'https://influxdb-docs.mcp.kapa.ai',
  };
}
