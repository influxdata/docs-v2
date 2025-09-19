/**
 * InfluxDB Version Detector Component
 *
 * Helps users identify which InfluxDB product they're using through a
 * guided questionnaire with URL detection and scoring-based recommendations.
 *
 * DECISION TREE LOGIC (from .context/drafts/influxdb-version-detector/influxdb-decision-tree.md):
 *
 * ## Primary Detection Flow
 *
 * START: User enters URL
 *     |
 *     ├─→ URL matches known cloud patterns?
 *     │   │
 *     │   ├─→ YES: Contains "influxdb.io" → **InfluxDB Cloud Dedicated** ✓
 *     │   ├─→ YES: Contains "cloud2.influxdata.com" regions → **InfluxDB Cloud Serverless** ✓
 *     │   ├─→ YES: Contains "influxcloud.net" → **InfluxDB Cloud 1** ✓
 *     │   └─→ YES: Contains other cloud2 regions → **InfluxDB Cloud (TSM)** ✓
 *     │
 *     └─→ NO: Check port and try /ping endpoint
 *         │
 *         ├─→ Port 8181 detected? → Strong indicator of v3 (Core/Enterprise)
 *         |   |   Returns 200 (auth successful or disabled)?
 *         |   │   │--> `x-influxdb-build: Enterprise` -> **InfluxDB 3 Enterprise** ✓ (definitive)
 *         |   │   │--> `x-influxdb-build: Core` -> **InfluxDB 3 Core** ✓ (definitive)
 *         │   │
 *         │   ├─→ Returns 401 Unauthorized (default - auth required)?
 *         │       │
 *         │       └─→ Ask "Paid or Free?"
 *         │           ├─→ Paid → **InfluxDB 3 Enterprise** ✓ (definitive)
 *         │           └─→ Free → **InfluxDB 3 Core** ✓ (definitive)
 *         |
 *         ├─→ Port 8086 detected? → Strong indicator of legacy (OSS/Enterprise)
 *         │   │   ⚠️  NOTE: v1.x ping auth optional (ping-auth-enabled), v2.x always open
 *         │   │
 *         │   ├─→ Returns 401 Unauthorized?
 *         │   │   │   Could be v1.x with ping-auth-enabled=true OR Enterprise
 *         │   │   │
 *         │   │   └─→ Ask "Paid or Free?" → Show ranked results
 *         │   │
 *         │   ├─→ Returns 200/204 (accessible)?
 *         │   │   │   Likely v2.x OSS (always open) or v1.x with ping-auth-enabled=false
 *         │   │   │
 *         │   │   └─→ Continue to questionnaire
 *         │
 *         └─→ Blocked/Can't detect?
 *             │
 *             └─→ Start questionnaire
 *
 * ## Questionnaire Flow (No URL or after detection)
 *
 * Q1: Which type of license do you have?
 *     ├─→ Paid/Commercial License
 *     ├─→ Free/Open Source (including free cloud tiers)
 *     └─→ I'm not sure
 *
 * Q2: Is your InfluxDB hosted by InfluxData (cloud) or self-hosted?
 *     ├─→ Cloud service (hosted by InfluxData)
 *     ├─→ Self-hosted (on your own servers)
 *     └─→ I'm not sure
 *
 * Q3: How long has your server been in place?
 *     ├─→ Recently installed (less than 1 year)
 *     ├─→ 1-5 years
 *     ├─→ More than 5 years
 *     └─→ I'm not sure
 *
 * Q4: Which query language(s) do you use?
 *     ├─→ SQL
 *     ├─→ InfluxQL
 *     ├─→ Flux
 *     ├─→ Multiple languages
 *     └─→ I'm not sure
 *
 * ## Definitive Determinations (Stop immediately, no more questions)
 *
 * 1. **401 + Port 8181 + Paid** → InfluxDB 3 Enterprise ✓
 * 2. **401 + Port 8181 + Free** → InfluxDB 3 Core ✓
 * 3. **URL matches cloud pattern** → Specific cloud product ✓
 * 4. **x-influxdb-build header** → Definitive product identification ✓
 *
 * ## Scoring System (When not definitive)
 *
 * ### Elimination Rules
 * - **Free + Self-hosted** → Eliminates all cloud products
 * - **Free** → Eliminates: 3 Enterprise, Enterprise, Clustered, Cloud Dedicated, Cloud 1
 * - **Paid + Self-hosted** → Eliminates all cloud products
 * - **Paid + Cloud** → Eliminates all self-hosted products
 * - **Free + Cloud** → Eliminates all self-hosted products, favors Serverless/TSM
 *
 * ### Strong Signals (High points)
 * - **401 Response**: +50 for v3 products, +30 for Clustered
 * - **Port 8181**: +30 for v3 products
 * - **Port 8086**: +20 for legacy products
 * - **SQL Language**: +40 for v3 products, eliminates v1/v2
 * - **Flux Language**: +30 for v2 era, eliminates v1 and v3
 * - **Server Age 5+ years**: +30 for v1 products, -50 for v3
 *
 * ### Ranking Display Rules
 * - Only show "Most Likely" if:
 *   - Top score > 30 (not low confidence)
 *   - AND difference between #1 and #2 is ≥ 15 points
 * - Show manual verification commands only if:
 *   - Confidence is not high (score < 60)
 *   - AND it's a self-hosted product
 *   - AND user didn't say it's cloud
 */

import { getInfluxDBUrls } from './services/local-storage.js';

interface QueryLanguageConfig {
  required_params: string[];
  optional_params?: string[];
}

interface ProductConfig {
  query_languages: Record<string, QueryLanguageConfig>;
  characteristics: string[];
  placeholder_host?: string;
  detection?: {
    url_contains?: string[];
    ping_headers?: Record<string, string>;
  };
}

interface Products {
  [key: string]: ProductConfig;
}

interface Answers {
  context?: string | null;
  portClue?: string | null;
  isCloud?: boolean;
  isDocker?: boolean;
  paid?: string;
  hosted?: string;
  age?: string;
  language?: string;
  auth?: string;
  data?: string;
  version?: string;
  [key: string]: string | boolean | null | undefined;
}

interface ComponentOptions {
  component: HTMLElement;
}

interface AnalyticsEventData {
  detected_product?: string;
  detection_method?: string;
  interaction_type: string;
  section?: string;
  completion_status?: string;
  question_id?: string;
  answer_value?: string;
}

// Global gtag function type declaration
declare global {
  interface Window {
    gtag?: (event: string, action: string, parameters?: Record<string, unknown>) => void;
  }
}

class InfluxDBVersionDetector {
  private container: HTMLElement;
  private products: Products;
  private influxdbUrls: Record<string, unknown>;
  private answers: Answers = {};
  private initialized: boolean = false;
  private questionFlow: string[] = [];
  private currentQuestionIndex = 0;
  private progressBar: HTMLElement | null = null;
  private resultDiv: HTMLElement | null = null;
  private restartBtn: HTMLElement | null = null;
  private currentContext: 'questionnaire' | 'result' = 'questionnaire';

  constructor(options: ComponentOptions) {
    this.container = options.component;

    // Parse data attributes from the component element
    const { products, influxdbUrls } = this.parseComponentData();

    this.products = products;
    this.influxdbUrls = influxdbUrls;

    // Check if component is in a modal
    const modal = this.container.closest('.modal-content');
    if (modal) {
      // If in modal, wait for modal to be opened before initializing
      this.initializeForModal();
    } else {
      // If not in modal, initialize immediately
      this.init();
    }
  }

  private parseComponentData(): {
    products: Products;
    influxdbUrls: Record<string, unknown>;
  } {
    let products: Products = {};
    let influxdbUrls: Record<string, unknown> = {};

    // Parse products data - Hugo always provides this data
    const productsData = this.container.getAttribute('data-products');
    if (productsData) {
      try {
        products = JSON.parse(productsData);
      } catch (error) {
        console.warn('Failed to parse products data:', error);
      }
    }

    // Parse influxdb URLs data
    const influxdbUrlsData = this.container.getAttribute('data-influxdb-urls');
    if (influxdbUrlsData && influxdbUrlsData !== '#ZgotmplZ') {
      try {
        influxdbUrls = JSON.parse(influxdbUrlsData);
      } catch (error) {
        console.warn('Failed to parse influxdb_urls data:', error);
        influxdbUrls = {}; // Fallback to empty object
      }
    } else {
      console.debug(
        'InfluxDB URLs data not available or blocked by template security. ' +
        'This is expected when Hugo data is unavailable.'
      );
      influxdbUrls = {}; // Fallback to empty object
    }

    return { products, influxdbUrls };
  }

  private init(): void {
    this.render();
    this.setupPlaceholders();
    this.attachEventListeners();
    this.showQuestion('q-url-known');
    this.initialized = true;

    // Track modal opening
    this.trackAnalyticsEvent({
      interaction_type: 'modal_opened',
      section: this.getCurrentPageSection()
    });
  }

  private setupPlaceholders(): void {
    // This method is called at init but some placeholders need to be set
    // when questions are actually displayed since DOM elements don't exist yet
  }

  private setupPingHeadersPlaceholder(): void {
    const pingHeaders = this.container.querySelector('#ping-headers');
    if (pingHeaders) {
      const exampleContent = [
        '# Replace this with your actual response headers',
        '# Example formats:',
        '',
        '# InfluxDB 3 Core:',
        'HTTP/1.1 200 OK',
        'x-influxdb-build: core',
        'x-influxdb-version: 3.1.0',
        '',
        '# InfluxDB 3 Enterprise:',
        'HTTP/1.1 200 OK',
        'x-influxdb-build: enterprise',
        'x-influxdb-version: 3.1.0',
        '',
        '# InfluxDB v2 OSS:',
        'HTTP/1.1 204 No Content',
        'X-Influxdb-Build: OSS',
        'X-Influxdb-Version: 2.7.8',
        '',
        '# InfluxDB v1:',
        'HTTP/1.1 204 No Content',
        'X-Influxdb-Version: 1.8.10'
      ].join('\n');

      (pingHeaders as HTMLTextAreaElement).value = exampleContent;

      // Select all text when user clicks in the textarea so they can easily replace it
      pingHeaders.addEventListener('focus', function(this: HTMLTextAreaElement) {
        this.select();
      });
    }
  }

  private setupDockerOutputPlaceholder(): void {
    const dockerOutput = this.container.querySelector('#docker-output');
    if (dockerOutput) {
      const exampleContent = [
        '# Replace this with your actual command output',
        '# Example formats:',
        '',
        '# Version command output:',
        'InfluxDB 3.1.0 (git: abc123def)',
        'or',
        'InfluxDB v2.7.8 (git: 407fa622e)',
        '',
        '# Ping headers from curl -I:',
        'HTTP/1.1 200 OK',
        'x-influxdb-build: core',
        'x-influxdb-version: 3.1.0',
        '',
        '# Startup logs:',
        '2024-01-01T00:00:00.000Z  info  InfluxDB starting',
        '2024-01-01T00:00:00.000Z  info  InfluxDB 3.1.0 (git: abc123)'
      ].join('\n');

      (dockerOutput as HTMLTextAreaElement).value = exampleContent;

      // Select all text when user clicks in the textarea so they can easily replace it
      dockerOutput.addEventListener('focus', function(this: HTMLTextAreaElement) {
        this.select();
      });
    }
  }

  private getCurrentPageSection(): string {
    // Extract meaningful section from current page
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(segment => segment);

    // Try to get a meaningful section name
    if (pathSegments.length >= 3) {
      return pathSegments.slice(0, 3).join('/'); // e.g., "influxdb3/core/visualize-data"
    } else if (pathSegments.length >= 2) {
      return pathSegments.slice(0, 2).join('/'); // e.g., "influxdb3/core"
    }

    return path || 'unknown';
  }

  private trackAnalyticsEvent(eventData: AnalyticsEventData): void {
    // Track Google Analytics events following the pattern from code-controls.js
    try {
      // Get current page context
      const currentUrl = new URL(window.location.href);
      const path = window.location.pathname;

      // Determine product context from current page
      let pageContext = 'other';
      if (/\/influxdb\/cloud\//.test(path)) {
        pageContext = 'cloud';
      } else if (/\/influxdb3\/core/.test(path)) {
        pageContext = 'core';
      } else if (/\/influxdb3\/enterprise/.test(path)) {
        pageContext = 'enterprise';
      } else if (/\/influxdb3\/cloud-serverless/.test(path)) {
        pageContext = 'serverless';
      } else if (/\/influxdb3\/cloud-dedicated/.test(path)) {
        pageContext = 'dedicated';
      } else if (/\/influxdb3\/clustered/.test(path)) {
        pageContext = 'clustered';
      } else if (/\/(enterprise_|influxdb).*\/v[1-2]\//.test(path)) {
        pageContext = 'oss/enterprise';
      }

      // Add tracking parameters to URL (following code-controls.js pattern)
      if (eventData.detected_product) {
        switch (eventData.detected_product) {
          case 'core':
            currentUrl.searchParams.set('dl', 'oss3');
            break;
          case 'enterprise':
            currentUrl.searchParams.set('dl', 'enterprise');
            break;
          case 'cloud':
          case 'cloud-v1':
          case 'cloud-v2-tsm':
            currentUrl.searchParams.set('dl', 'cloud');
            break;
          case 'serverless':
            currentUrl.searchParams.set('dl', 'serverless');
            break;
          case 'dedicated':
            currentUrl.searchParams.set('dl', 'dedicated');
            break;
          case 'clustered':
            currentUrl.searchParams.set('dl', 'clustered');
            break;
          case 'oss':
          case 'oss-v1':
          case 'oss-v2':
            currentUrl.searchParams.set('dl', 'oss');
            break;
        }
      }

      // Add additional tracking parameters
      if (eventData.detection_method) {
        currentUrl.searchParams.set('detection_method', eventData.detection_method);
      }
      if (eventData.completion_status) {
        currentUrl.searchParams.set('completion', eventData.completion_status);
      }
      if (eventData.section) {
        currentUrl.searchParams.set('section',
          encodeURIComponent(eventData.section));
      }

      // Update browser history without triggering page reload
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', currentUrl.toString());
      }

      // Send custom Google Analytics event if gtag is available
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'influxdb_version_detector', {
          interaction_type: eventData.interaction_type,
          detected_product: eventData.detected_product,
          detection_method: eventData.detection_method,
          completion_status: eventData.completion_status,
          question_id: eventData.question_id,
          answer_value: eventData.answer_value,
          section: eventData.section,
          page_context: pageContext,
          custom_map: {
            dimension1: eventData.detected_product,
            dimension2: eventData.detection_method,
            dimension3: pageContext
          }
        });
      }
    } catch (error) {
      // Silently handle analytics errors to avoid breaking functionality
      console.debug('Analytics tracking error:', error);
    }
  }

  private initializeForModal(): void {
    // Set up event listener to initialize when modal opens
    const modalContent = this.container.closest('.modal-content');
    if (!modalContent) return;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' &&
            mutation.attributeName === 'style') {
          const target = mutation.target as HTMLElement;
          const isVisible = target.style.display !== 'none' &&
                           target.style.display !== '';

          if (isVisible && !this.initialized) {
            // Modal just opened and component not yet initialized
            this.init();
            observer.disconnect();
          }
        }
      });
    });

    // Start observing the modal content for style changes
    observer.observe(modalContent, {
      attributes: true,
      attributeFilter: ['style']
    });

    // Also check if modal is already visible
    const computedStyle = window.getComputedStyle(modalContent);
    if (computedStyle.display !== 'none' && !this.initialized) {
      this.init();
      observer.disconnect();
    }
  }

  private getBasicUrlSuggestion(): string {
    // Provide a basic placeholder URL suggestion based on common patterns
    return 'https://your-influxdb-host.com:8086';
  }

  private getProductDisplayName(product: string): string {
    const displayNames: Record<string, string> = {
      // Simplified product keys (used in detection results)
      'oss-v1': 'InfluxDB OSS v1.x',
      'oss-v2': 'InfluxDB OSS v2.x',
      oss: 'InfluxDB OSS (version unknown)',
      cloud: 'InfluxDB Cloud',
      'cloud-v1': 'InfluxDB Cloud v1',
      'cloud-v2-tsm': 'InfluxDB Cloud v2 (TSM)',
      serverless: 'InfluxDB Cloud Serverless',
      core: 'InfluxDB 3 Core',
      enterprise: 'InfluxDB 3 Enterprise',
      'core or enterprise': 'InfluxDB 3 Core or Enterprise',
      dedicated: 'InfluxDB Cloud Dedicated',
      clustered: 'InfluxDB Clustered',
      custom: 'Custom URL',

      // Raw product keys from products.yml (used in scoring)
      'influxdb3_core': 'InfluxDB 3 Core',
      'influxdb3_enterprise': 'InfluxDB 3 Enterprise',
      'influxdb3_cloud_serverless': 'InfluxDB Cloud Serverless',
      'influxdb3_cloud_dedicated': 'InfluxDB Cloud Dedicated',
      'influxdb3_clustered': 'InfluxDB Clustered',
      'influxdb_v1': 'InfluxDB OSS v1.x',
      'influxdb_v2': 'InfluxDB OSS v2.x',
      'enterprise_influxdb': 'InfluxDB Enterprise v1.x',
      'influxdb': 'InfluxDB OSS v2.x',
    };
    return displayNames[product] || product;
  }

  private generateConfigurationGuidance(productKey: string): string {
    // Map from result product names to products.yml keys
    const productMapping: Record<string, string> = {
      'core': 'influxdb3_core',
      'enterprise': 'influxdb3_enterprise',
      'serverless': 'influxdb3_cloud_serverless',
      'dedicated': 'influxdb3_cloud_dedicated',
      'clustered': 'influxdb3_clustered',
      'oss-v1': 'influxdb_v1',
      'oss-v2': 'influxdb_v2'
    };

    const dataKey = productMapping[productKey];
    if (!dataKey || !this.products[dataKey]) {
      return '';
    }

    const productConfig = this.products[dataKey];
    const productName = this.getProductDisplayName(productKey);

    if (!productConfig.query_languages || Object.keys(productConfig.query_languages).length === 0) {
      return '';
    }

    let html = `
      <div class="configuration-guidance" style="margin-top: 1.5rem; padding: 1rem; background: rgba(var(--article-link-rgb, 59, 130, 246), 0.1); border-left: 4px solid var(--article-link, #3b82f6); border-radius: 6px;">
        <h4 style="margin: 0 0 0.75rem 0; color: var(--article-link, #3b82f6);">Configuration Parameter Meanings for ${productName}</h4>
        <p style="margin: 0 0 1rem 0; font-size: 0.9em;">When configuring Grafana or other tools to connect to your ${productName} instance, these parameters mean:</p>
    `;

    // Add HOST explanation
    const hostExample = this.getHostExample(dataKey);
    html += `
      <div style="margin-bottom: 0.75rem;">
        <strong>HOST/URL:</strong> The network address where your ${productName} instance is running<br>
        <span style="font-size: 0.85em; color: var(--article-text-secondary, #6b7280);">
          For your setup, this would typically be: <code style="background: rgba(0,0,0,0.1); padding: 0.125rem 0.25rem; border-radius: 3px;">${hostExample}</code>
        </span>
      </div>
    `;

    // Add database/bucket terminology explanation
    const usesDatabase = this.usesDatabaseTerminology(productConfig);
    if (usesDatabase) {
      html += `
        <div style="margin-bottom: 0.75rem;">
          <strong>DATABASE:</strong> The named collection where your data is stored<br>
          <span style="font-size: 0.85em; color: var(--article-text-secondary, #6b7280);">
            ${productName} uses "database" terminology for organizing your time series data
          </span>
        </div>
      `;
    } else {
      html += `
        <div style="margin-bottom: 0.75rem;">
          <strong>BUCKET:</strong> The named collection where your data is stored<br>
          <span style="font-size: 0.85em; color: var(--article-text-secondary, #6b7280);">
            ${productName} uses "bucket" terminology for organizing your time series data
          </span>
        </div>
      `;
    }

    // Add authentication explanation
    const authInfo = this.getAuthenticationInfo(productConfig);
    html += `
      <div style="margin-bottom: 0.75rem;">
        <strong>AUTHENTICATION:</strong> ${authInfo.description}<br>
        <span style="font-size: 0.85em; color: var(--article-text-secondary, #6b7280);">
          ${authInfo.details}
        </span>
      </div>
    `;

    // Add query language explanation
    const languages = Object.keys(productConfig.query_languages).join(', ');
    html += `
      <div style="margin-bottom: 0;">
        <strong>QUERY LANGUAGE:</strong> The syntax used to retrieve your data<br>
        <span style="font-size: 0.85em; color: var(--article-text-secondary, #6b7280);">
          ${productName} supports: ${languages}
        </span>
      </div>
    `;

    html += '</div>';
    return html;
  }

  private getHostExample(productDataKey: string): string {
    // Extract placeholder_host from the products data if available
    const productData = this.products[productDataKey];

    // Use placeholder_host from the product configuration if available
    if (productData?.placeholder_host) {
      // Add protocol if not present
      const host = productData.placeholder_host;
      if (host.startsWith('http://') || host.startsWith('https://')) {
        return host;
      } else {
        // Default to http for localhost, https for others
        return host.includes('localhost') ? `http://${host}` : `https://${host}`;
      }
    }

    // Fallback based on product type
    const hostExamples: Record<string, string> = {
      'influxdb3_core': 'http://localhost:8181',
      'influxdb3_enterprise': 'http://localhost:8181',
      'influxdb3_cloud_serverless': 'https://cloud2.influxdata.com',
      'influxdb3_cloud_dedicated': 'https://cluster-id.a.influxdb.io',
      'influxdb3_clustered': 'https://cluster-host.com',
      'influxdb_v1': 'http://localhost:8086',
      'influxdb_v2': 'http://localhost:8086'
    };

    return hostExamples[productDataKey] || 'http://localhost:8086';
  }

  private usesDatabaseTerminology(productConfig: ProductConfig): boolean {
    // Check if any query language uses 'Database' parameter
    for (const language of Object.values(productConfig.query_languages)) {
      if (language.required_params.includes('Database')) {
        return true;
      }
    }
    return false;
  }

  private getAuthenticationInfo(productConfig: ProductConfig): { description: string; details: string } {
    // Check if any query language requires Token
    const requiresToken = Object.values(productConfig.query_languages).some(
      lang => lang.required_params.includes('Token')
    );

    // Determine if this product uses "database" or "bucket" terminology
    const usesDatabaseTerm = this.usesDatabaseTerminology(productConfig);
    const resourceName = usesDatabaseTerm ? 'database' : 'bucket';

    if (requiresToken) {
      return {
        description: 'Token-based authentication required',
        details: `You need a valid API token with appropriate permissions for your ${resourceName}`
      };
    } else {
      return {
        description: 'No authentication required by default',
        details: 'This instance typically runs without authentication, though it may be optionally configured'
      };
    }
  }

  private detectEnterpriseFeatures(): {
    likelyProduct: string;
    confidence: number;
  } | null {
    // According to the decision tree, we cannot reliably distinguish
    // Core vs Enterprise from URL alone. The real differentiator is:
    // - Both Enterprise and Core: /ping requires auth by default (opt-out possible)
    // - Definitive identification requires x-influxdb-build header from 200 response
    //
    // Since this component cannot make HTTP requests to test /ping,
    // we return null to indicate we cannot distinguish them from URL alone.

    return null;
  }

  private analyzeUrlPatterns(url: string): {
    likelyProduct: string | null;
    confidence: number;
    suggestion?: string;
  } {
    if (!url || !this.influxdbUrls) {
      return { likelyProduct: null, confidence: 0 };
    }

    const urlLower = url.toLowerCase();

    // PRIORITY 1: Check for definitive cloud patterns first (per decision tree)
    // These should be checked before localhost patterns for accuracy

    // InfluxDB Cloud Dedicated: Contains "influxdb.io"
    if (urlLower.includes('influxdb.io')) {
      return { likelyProduct: 'dedicated', confidence: 1.0 };
    }

    // InfluxDB Cloud Serverless: Contains "cloud2.influxdata.com" regions
    if (urlLower.includes('cloud2.influxdata.com')) {
      // Check for specific Serverless regions
      const serverlessRegions = [
        'us-east-1-1.aws.cloud2.influxdata.com',
        'eu-central-1-1.aws.cloud2.influxdata.com'
      ];

      for (const region of serverlessRegions) {
        if (urlLower.includes(region.toLowerCase())) {
          return { likelyProduct: 'serverless', confidence: 1.0 };
        }
      }

      // Other cloud2 regions default to InfluxDB Cloud v2 (TSM)
      return { likelyProduct: 'cloud-v2-tsm', confidence: 0.9 };
    }

    // InfluxDB Cloud v1 (legacy): Contains "influxcloud.net"
    if (urlLower.includes('influxcloud.net')) {
      return { likelyProduct: 'cloud-v1', confidence: 1.0 };
    }

    // PRIORITY 2: Check for localhost/port-based patterns (OSS, Core, Enterprise)
    // Note: localhost URLs cannot be cloud versions - they're always self-hosted
    if (urlLower.includes('localhost') || urlLower.includes('127.0.0.1')) {
      // OSS default port
      if (urlLower.includes(':8086')) {
        return {
          likelyProduct: 'oss',
          confidence: 0.8,
          suggestion: 'version-check'
        };
      }

      // Core/Enterprise default port - both use 8181
      if (urlLower.includes(':8181')) {
        // Try to distinguish between Core and Enterprise
        const enterpriseResult = this.detectEnterpriseFeatures();
        if (enterpriseResult) {
          return enterpriseResult;
        }

        // Can't distinguish from URL alone - suggest ping test
        return {
          likelyProduct: 'core or enterprise',
          confidence: 0.7,
          suggestion: 'ping-test'
        };
      }
    }

    // Then check cloud products with provider regions
    // Skip this check if URL is localhost (cannot be cloud)
    const isLocalhost = urlLower.includes('localhost') || urlLower.includes('127.0.0.1');
    if (!isLocalhost) {
      for (const [productKey, productData] of Object.entries(this.influxdbUrls)) {
        if (!productData || typeof productData !== 'object') continue;

        const providers = (productData as Record<string, unknown>).providers;
        if (!Array.isArray(providers)) continue;

        for (const provider of providers) {
          if (!provider.regions) continue;

          for (const region of provider.regions) {
            if (region.url) {
              const patternUrl = region.url.toLowerCase();

              // Exact match
              if (urlLower === patternUrl) {
                return { likelyProduct: productKey, confidence: 1.0 };
              }

              // Domain match for cloud URLs
              if (
                productKey === 'cloud' &&
                urlLower.includes('cloud2.influxdata.com')
              ) {
                return { likelyProduct: 'cloud', confidence: 0.9 };
              }
            }
          }
        }
      }
    }

    // Additional heuristics based on common patterns
    // Special handling for user inputs like "cloud 2", "cloud v2", etc.
    // Skip cloud heuristics for localhost URLs
    if (!isLocalhost) {
      if (urlLower.match(/cloud\s*[v]?2/)) {
        return { likelyProduct: 'cloud', confidence: 0.8 };
      }

      if (
        urlLower.includes('cloud') ||
        urlLower.includes('aws') ||
        urlLower.includes('azure') ||
        urlLower.includes('gcp')
      ) {
        return { likelyProduct: 'cloud', confidence: 0.6 };
      }
    }

    if (urlLower.includes(':8086')) {
      return { likelyProduct: 'oss', confidence: 0.5 };
    }

    if (urlLower.includes(':8181')) {
      return { likelyProduct: 'core', confidence: 0.5 };
    }

    return { likelyProduct: null, confidence: 0 };
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="influxdb-version-detector">
        <h2 id="detector-title" class="detector-title" tabindex="-1">
          InfluxDB product detector
        </h2>
        <p class="detector-subtitle">
          Answer a few questions to identify which InfluxDB product you're using
        </p>

        <div class="progress">
          <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
        </div>

        <div class="question-container">
          <!-- Question: Do you know URL -->
          <div class="question active" id="q-url-known">
            <div class="question-text">
              Do you know the URL of your InfluxDB server?
            </div>
            <button class="option-button"
                    data-action="url-known"
                    data-value="true">
              Yes, I know the URL
            </button>
            <button class="option-button"
                    data-action="url-known"
                    data-value="false">
              No, I don't know the URL
            </button>
            <button class="option-button"
                    data-action="url-known"
                    data-value="airgapped">
              Yes, but it's in an airgapped environment
            </button>
            <button class="option-button"
                    data-action="url-known"
                    data-value="docker">
              Yes, but it's running in Docker/Kubernetes
            </button>
          </div>

          <!-- Question: Enter URL -->
          <div class="question" id="q-url-input">
            <div class="question-text">
              Please enter your InfluxDB server URL:
            </div>
            <div class="input-group">
              <input type="url" id="url-input"
                     placeholder="for example, https://us-east-1-1.aws.cloud2.influxdata.com or http://localhost:8086">
            </div>
            <button class="back-button" data-action="go-back">Back</button>
            <button class="submit-button"
                    data-action="detect-url">Detect Version</button>
          </div>

          <!-- Question: Manual ping test -->
          <div class="question" id="q-ping-manual">
            <div class="question-text">
              For airgapped environments, run this command from a machine that can
              access your InfluxDB:
            </div>
            <div class="code-block">curl -I http://your-influxdb-url:8086/ping</div>
            <div class="question-text question-text-spaced">
              Then paste the response headers here:
            </div>
            <textarea id="ping-headers">
            </textarea>
            <div class="question-options">
              <button class="back-button" data-action="go-back">Back</button>
              <button class="submit-button"
                      data-action="analyze-headers">Analyze Headers</button>
            </div>
          </div>

          <!-- Question: Docker commands -->
          <div class="question" id="q-docker-manual">
            <div class="question-text">
              For Docker/Kubernetes environments, run these commands to identify your InfluxDB version:
            </div>
            <div class="question-text question-text-spaced">
              First, find your container:
            </div>
            <div class="code-block">docker ps | grep influx</div>
            <div class="question-text question-text-spaced">
              Then run one of these commands (replace &lt;container&gt; with your container name/ID):
            </div>
            <div class="code-block"># Get version info:
docker exec &lt;container&gt; influxd version

# Get ping headers:
docker exec &lt;container&gt; curl -I localhost:8086/ping

# Or check startup logs:
docker logs &lt;container&gt; 2>&amp;1 | head -20</div>
            <div class="question-text question-text-spaced">
              Paste the output here:
            </div>
            <textarea id="docker-output">
            </textarea>
            <div class="question-options">
              <button class="back-button" data-action="go-back">Back</button>
              <button class="submit-button"
                      data-action="analyze-docker">Analyze Output</button>
            </div>
          </div>

          <!-- Question: Paid vs Free -->
          <div class="question" id="q-paid">
            <div class="question-text">
              Which type of InfluxDB license do you have?
            </div>
            <button class="option-button"
                    data-action="answer"
                    data-category="paid"
                    data-value="paid">
              Paid/Commercial License
            </button>
            <button class="option-button"
                    data-action="answer"
                    data-category="paid"
                    data-value="free">
              Free/Open Source (including free cloud tiers)
            </button>
            <button class="option-button"
                    data-action="answer"
                    data-category="paid"
                    data-value="unknown">
              I'm not sure
            </button>
          </div>

          <!-- Question: Cloud vs Self-hosted -->
          <div class="question" id="q-hosted">
            <div class="question-text">
              Is your InfluxDB instance hosted by InfluxData (cloud) or
              self-hosted?
            </div>
            <button class="option-button"
                    data-action="answer"
                    data-category="hosted"
                    data-value="cloud">
              Cloud service (hosted by InfluxData)
            </button>
            <button class="option-button"
                    data-action="answer"
                    data-category="hosted"
                    data-value="self">
              Self-hosted (on your own servers)
            </button>
            <button class="option-button"
                    data-action="answer"
                    data-category="hosted"
                    data-value="unknown">
              I'm not sure
            </button>
          </div>

          <!-- Question: Server Age -->
          <div class="question" id="q-age">
            <div class="question-text">How long has your InfluxDB server been in place?</div>
            <button class="option-button" data-action="answer" data-category="age" data-value="recent">
              Recently installed (less than 1 year)
            </button>
            <button class="option-button" data-action="answer" data-category="age" data-value="1-5">
              1-5 years
            </button>
            <button class="option-button" data-action="answer" data-category="age" data-value="5+">
              More than 5 years
            </button>
            <button class="option-button" data-action="answer" data-category="age" data-value="unknown">
              I'm not sure
            </button>
          </div>

          <!-- Question: Query Language -->
          <div class="question" id="q-language">
            <div class="question-text">Which query language(s) do you use with InfluxDB?</div>
            <button class="option-button" data-action="answer" data-category="language" data-value="sql">
              SQL
            </button>
            <button class="option-button" data-action="answer" data-category="language" data-value="influxql">
              InfluxQL
            </button>
            <button class="option-button" data-action="answer" data-category="language" data-value="flux">
              Flux
            </button>
            <button class="option-button" data-action="answer" data-category="language" data-value="multiple">
              Multiple languages
            </button>
            <button class="option-button" data-action="answer" data-category="language" data-value="unknown">
              I'm not sure
            </button>
          </div>
        </div>

        <div id="result" class="result"></div>

        <button class="submit-button restart-button" data-action="restart" style="display: none;" id="restart-btn">
          Start Over
        </button>
      </div>
    `;

    // Cache DOM elements
    this.progressBar = this.container.querySelector('#progress-bar');
    this.resultDiv = this.container.querySelector('#result');
    this.restartBtn = this.container.querySelector('#restart-btn');
  }

  private attachEventListeners(): void {
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      if (
        target.classList.contains('option-button') ||
        target.classList.contains('submit-button') ||
        target.classList.contains('back-button')
      ) {
        const action = target.dataset.action;

        switch (action) {
          case 'url-known':
            this.trackAnalyticsEvent({
              interaction_type: 'question_answered',
              question_id: 'url-known',
              answer_value: target.dataset.value || '',
              section: this.getCurrentPageSection()
            });
            this.handleUrlKnown(target.dataset.value);
            break;
          case 'go-back':
            this.trackAnalyticsEvent({
              interaction_type: 'navigation',
              section: this.getCurrentPageSection()
            });
            this.goBack();
            break;
          case 'detect-url':
            this.trackAnalyticsEvent({
              interaction_type: 'url_detection_attempt',
              detection_method: 'url_analysis',
              section: this.getCurrentPageSection()
            });
            this.detectByUrl();
            break;
          case 'analyze-headers':
            this.trackAnalyticsEvent({
              interaction_type: 'manual_analysis',
              detection_method: 'ping_headers',
              section: this.getCurrentPageSection()
            });
            this.analyzePingHeaders();
            break;
          case 'analyze-docker':
            this.trackAnalyticsEvent({
              interaction_type: 'manual_analysis',
              detection_method: 'docker_output',
              section: this.getCurrentPageSection()
            });
            this.analyzeDockerOutput();
            break;
          case 'answer':
            this.trackAnalyticsEvent({
              interaction_type: 'question_answered',
              question_id: target.dataset.category || '',
              answer_value: target.dataset.value || '',
              section: this.getCurrentPageSection()
            });
            this.answerQuestion(
              target.dataset.category!,
              target.dataset.value!
            );
            break;
          case 'auth-help-answer':
            this.trackAnalyticsEvent({
              interaction_type: 'auth_help_response',
              question_id: target.dataset.category || '',
              answer_value: target.dataset.value || '',
              section: this.getCurrentPageSection()
            });
            this.handleAuthorizationHelp(
              target.dataset.category!,
              target.dataset.value!
            );
            break;
          case 'restart':
            this.trackAnalyticsEvent({
              interaction_type: 'restart',
              section: this.getCurrentPageSection()
            });
            this.restart();
            break;
          case 'start-questionnaire': {
            this.trackAnalyticsEvent({
              interaction_type: 'start_questionnaire',
              section: this.getCurrentPageSection()
            });
            // Hide result and restart button first
            if (this.resultDiv) {
              this.resultDiv.classList.remove('show');
            }
            if (this.restartBtn) {
              this.restartBtn.style.display = 'none';
            }
            // Start questionnaire with the detected context
            this.startQuestionnaire(target.dataset.context || null);
            // Focus on the component heading
            const heading = document.getElementById('detector-title');
            if (heading) {
              heading.focus();
              heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            break;
          }
        }
      }
    });
  }

  private updateProgress(): void {
    const totalQuestions = this.questionFlow.length || 5;
    const progress = ((this.currentQuestionIndex + 1) / totalQuestions) * 100;
    if (this.progressBar) {
      this.progressBar.style.width = `${progress}%`;
    }
  }

  private showQuestion(questionId: string): void {
    const questions = this.container.querySelectorAll('.question');
    questions.forEach((q) => q.classList.remove('active'));

    const activeQuestion = this.container.querySelector(`#${questionId}`);
    if (activeQuestion) {
      activeQuestion.classList.add('active');

      // Add smart suggestions for URL input question
      if (questionId === 'q-url-input') {
        this.enhanceUrlInputWithSuggestions();
      }
    }

    this.updateProgress();
  }

  private enhanceUrlInputWithSuggestions(): void {
    const urlInputQuestion = this.container.querySelector('#q-url-input');
    if (!urlInputQuestion) return;

    const urlInput = urlInputQuestion.querySelector(
      '#url-input'
    ) as HTMLInputElement;
    if (!urlInput) return;

    // Check for existing URL in localStorage
    const storedUrls = getInfluxDBUrls();
    const currentProduct = this.getCurrentProduct();
    const storedUrl = storedUrls[currentProduct] || storedUrls.custom;

    if (storedUrl && storedUrl !== 'http://localhost:8086') {
      urlInput.value = storedUrl;
      // Add indicator that URL was pre-filled (only if one doesn't already exist)
      const existingIndicator = urlInput.parentElement?.querySelector('.url-prefilled-indicator');
      if (!existingIndicator) {
        const indicator = document.createElement('div');
        indicator.className = 'url-prefilled-indicator';
        indicator.textContent = 'Using previously saved URL';
        urlInput.parentElement?.insertBefore(indicator, urlInput);

        // Hide indicator when user starts typing
        const originalValue = urlInput.value;
        urlInput.addEventListener('input', () => {
          if (urlInput.value !== originalValue) {
            indicator.style.display = 'none';
          }
        });
      }
    } else {
      // Set a basic placeholder suggestion
      const suggestedUrl = this.getBasicUrlSuggestion();
      urlInput.placeholder = `for example, ${suggestedUrl}`;
    }
  }

  private getCurrentProduct(): string {
    // Try to determine current product context from page or default
    // This could be enhanced to detect from page context
    return 'core'; // Default to core for now
  }

  private handleUrlKnown(value: string | undefined): void {
    this.currentQuestionIndex++;

    if (value === 'true') {
      this.showQuestion('q-url-input');
    } else if (value === 'airgapped') {
      this.showQuestion('q-ping-manual');
      // Set up placeholder after question is shown
      setTimeout(() => this.setupPingHeadersPlaceholder(), 0);
    } else if (value === 'docker') {
      this.answers.isDocker = true;
      this.showQuestion('q-docker-manual');
      // Set up placeholder after question is shown
      setTimeout(() => this.setupDockerOutputPlaceholder(), 0);
    } else {
      // Start the questionnaire
      this.answers = {};
      this.questionFlow = ['q-paid', 'q-hosted', 'q-age', 'q-language'];
      this.currentQuestionIndex = 0;
      this.showQuestion('q-paid');
    }
  }

  private goBack(): void {
    this.currentQuestionIndex = 0;
    this.showQuestion('q-url-known');
  }

  private async detectByUrl(): Promise<void> {
    const urlInput = (
      this.container.querySelector('#url-input') as HTMLInputElement
    )?.value.trim();

    if (!urlInput) {
      this.showResult('error', 'Please enter a valid URL');
      return;
    }

    // Use improved URL pattern analysis
    const analysisResult = this.analyzeUrlPatterns(urlInput);

    // Store URL detection results for scoring system
    if (analysisResult.likelyProduct && analysisResult.likelyProduct !== null) {
      this.answers.detectedProduct = analysisResult.likelyProduct;
      this.answers.detectedConfidence = analysisResult.confidence.toString();
    }

    if (analysisResult.likelyProduct && analysisResult.likelyProduct !== null) {
      if (analysisResult.suggestion === 'ping-test') {
        // Show ping test suggestion for Core/Enterprise detection
        this.showPingTestSuggestion(urlInput, analysisResult.likelyProduct);
        return;
      } else if (analysisResult.suggestion === 'version-check') {
        // Show OSS version check suggestion
        this.showOSSVersionCheckSuggestion(urlInput);
        return;
      } else {
        // Direct detection
        this.showDetectedVersion(analysisResult.likelyProduct);
        return;
      }
    }

    // URL not recognized - start questionnaire with context
    this.showResult(
      'info',
      'Analyzing your InfluxDB server...'
    );

    // Check if this is a cloud context (like "cloud 2")
    const contextResult = this.detectContext(urlInput);
    if (contextResult.likelyProduct === 'cloud') {
      // Start questionnaire with cloud context
      setTimeout(() => {
        this.startQuestionnaireWithCloudContext();
      }, 2000);
    } else {
      // For other URLs, use the regular questionnaire
      setTimeout(() => {
        this.startQuestionnaire('manual', this.detectPortFromUrl(urlInput));
      }, 2000);
    }
  }

  private detectContext(urlInput: string): { likelyProduct?: string } {
    const input = urlInput.toLowerCase();

    // Check for cloud indicators
    if (input.includes('cloud') || input.includes('influxdata.com')) {
      return { likelyProduct: 'cloud' };
    }

    // Check for other patterns like "cloud 2"
    if (/cloud\s*[v]?2/.test(input)) {
      return { likelyProduct: 'cloud' };
    }

    return {};
  }

  private detectPortFromUrl(urlString: string): string | null {
    try {
      const url = new URL(urlString);
      const port = url.port || (url.protocol === 'https:' ? '443' : '80');

      if (port === '8181') {
        return 'v3'; // InfluxDB 3 Core/Enterprise typically use 8181
      } else if (port === '8086') {
        return 'legacy'; // OSS v1/v2 or Enterprise v1 typically use 8086
      }
    } catch {
      // Invalid URL
    }
    return null;
  }

  private startQuestionnaire(
    context: string | null = null,
    portClue: string | null = null
  ): void {
    this.answers = {};
    this.answers.context = context;
    this.answers.portClue = portClue;
    this.answers.isCloud = false;
    this.questionFlow = ['q-paid', 'q-age', 'q-language'];
    this.currentQuestionIndex = 0;
    this.showQuestion('q-paid');
  }

  private startQuestionnaireWithCloudContext(): void {
    this.answers = {};
    this.answers.context = 'cloud';
    this.answers.hosted = 'cloud'; // Pre-set cloud hosting
    this.answers.isCloud = true;
    this.questionFlow = ['q-paid', 'q-age', 'q-language'];
    this.currentQuestionIndex = 0;
    this.showQuestion('q-paid');
  }

  private answerQuestion(category: string, answer: string): void {
    this.answers[category] = answer;

    // Determine next question or show results
    if (category === 'paid') {
      if (!this.answers.context) {
        // No URL provided - ask about cloud vs self-hosted
        this.currentQuestionIndex = 1;
        this.showQuestion('q-hosted');
      } else {
        // We have context from URL - go to age
        this.currentQuestionIndex = 1;
        this.showQuestion('q-age');
      }
    } else if (category === 'hosted') {
      this.currentQuestionIndex = 2;
      this.showQuestion('q-age');
    } else if (category === 'age') {
      this.currentQuestionIndex = 3;
      this.showQuestion('q-language');
    } else if (category === 'language') {
      // All questions answered - show ranked results
      this.showRankedResults();
    }
  }

  private handleAuthorizationHelp(category: string, answer: string): void {
    // Store the answer
    this.answers[category] = answer;

    // Check if we're in the context of localhost:8181 detection
    // If so, we can provide a high-confidence result
    const currentUrl = (this.container.querySelector('#url-input') as HTMLInputElement)?.value?.toLowerCase() || '';
    const isLocalhost8181 = (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) &&
                            currentUrl.includes(':8181');

    if (isLocalhost8181) {
      // For localhost:8181, we can give high-confidence results based on license
      if (answer === 'free') {
        // High confidence it's InfluxDB 3 Core
        const html = `
          <strong>Based on your localhost:8181 server and free license:</strong><br><br>
          ${this.generateProductResult('core', true, 'High', false)}
          <div class="action-section" style="margin-top: 1.5rem;">
            <strong>Want to confirm this result?</strong>
            <button class="option-button" data-action="start-questionnaire" data-context="v3-port-detected">
              Use guided questions instead
            </button>
          </div>
        `;
        this.showResult('success', html);
      } else if (answer === 'paid') {
        // High confidence it's InfluxDB 3 Enterprise
        const html = `
          <strong>Based on your localhost:8181 server and paid license:</strong><br><br>
          ${this.generateProductResult('enterprise', true, 'High', false)}
          <div class="action-section" style="margin-top: 1.5rem;">
            <strong>Want to confirm this result?</strong>
            <button class="option-button" data-action="start-questionnaire" data-context="v3-port-detected">
              Use guided questions instead
            </button>
          </div>
        `;
        this.showResult('success', html);
      }
    } else {
      // Original behavior for non-localhost:8181 cases
      const resultDiv = this.container.querySelector('#result');
      if (resultDiv) {
        // Add a message about what the license answer means
        const licenseGuidance = document.createElement('div');
        licenseGuidance.className = 'license-guidance';
        licenseGuidance.style.marginTop = '1rem';
        licenseGuidance.style.padding = '0.75rem';
        licenseGuidance.style.backgroundColor = 'rgba(var(--article-link-rgb, 0, 163, 255), 0.1)';
        licenseGuidance.style.borderLeft = '4px solid var(--article-link, #00A3FF)';
        licenseGuidance.style.borderRadius = '4px';

        if (answer === 'free') {
          licenseGuidance.innerHTML = `
            <strong>Free/Open Source License:</strong>
            <p>This suggests you're using InfluxDB 3 Core or InfluxDB OSS.</p>
            <ul>
              <li><a href="/influxdb3/core/visualize-data/grafana/"
                 target="_blank" class="grafana-link">Configure Grafana for InfluxDB 3 Core</a></li>
              <li><a href="/influxdb/v2/visualize-data/grafana/"
                 target="_blank" class="grafana-link">Configure Grafana for InfluxDB OSS v2</a></li>
              <li><a href="/influxdb/v1/tools/grafana/"
                 target="_blank" class="grafana-link">Configure Grafana for InfluxDB OSS v1</a></li>
            </ul>
          `;
        } else if (answer === 'paid') {
          licenseGuidance.innerHTML = `
            <strong>Paid/Commercial License:</strong>
            <p>This suggests you're using InfluxDB 3 Enterprise or a paid cloud service.</p>
            <ul>
              <li><a href="/influxdb3/enterprise/visualize-data/grafana/"
                 target="_blank" class="grafana-link">Configure Grafana for InfluxDB 3 Enterprise</a></li>
              <li><a href="/influxdb3/cloud-dedicated/visualize-data/grafana/"
                 target="_blank" class="grafana-link">Configure Grafana for InfluxDB Cloud Dedicated</a></li>
              <li><a href="/influxdb3/cloud-serverless/visualize-data/grafana/"
                 target="_blank" class="grafana-link">Configure Grafana for InfluxDB Cloud Serverless</a></li>
            </ul>
          `;
        }

        // Remove any existing guidance
        const existingGuidance = resultDiv.querySelector('.license-guidance');
        if (existingGuidance) {
          existingGuidance.remove();
        }

        // Add the new guidance
        resultDiv.appendChild(licenseGuidance);

        // Focus on the guidance message for accessibility
        licenseGuidance.focus();
      }
    }
  }

  private showRankedResults(): void {
    const scores: Record<string, number> = {};

    // Initialize all products with base score
    Object.keys(this.products).forEach((product) => {
      scores[product] = 0;
    });

    // Apply scoring logic based on answers
    this.applyScoring(scores);

    // Sort by score
    const ranked = Object.entries(scores)
      .filter(([, score]) => score > -50)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Display results
    this.displayRankedResults(ranked);
  }

  /**
   * Gets the Grafana documentation link for a given product
   */
  private getGrafanaLink(productName: string): string | null {
    const GRAFANA_LINKS: Record<string, string> = {
      'InfluxDB 3 Core': '/influxdb3/core/visualize-data/grafana/',
      'InfluxDB 3 Enterprise': '/influxdb3/enterprise/visualize-data/grafana/',
      'InfluxDB Cloud Dedicated': '/influxdb3/cloud-dedicated/visualize-data/grafana/',
      'InfluxDB Cloud Serverless': '/influxdb3/cloud-serverless/visualize-data/grafana/',
      'InfluxDB OSS 1.x': '/influxdb/v1/tools/grafana/',
      'InfluxDB OSS 2.x': '/influxdb/v2/visualize-data/grafana/',
      'InfluxDB Enterprise': '/influxdb/enterprise/visualize-data/grafana/',
      'InfluxDB Clustered': '/influxdb3/clustered/visualize-data/grafana/',
      'InfluxDB Cloud (TSM)': '/influxdb/cloud/visualize-data/grafana/',
      'InfluxDB Cloud v1': '/influxdb/cloud/visualize-data/grafana/'
    };

    return GRAFANA_LINKS[productName] || null;
  }

  /**
   * Generates a unified product result block with characteristics and Grafana link
   */
  private generateProductResult(
    productName: string,
    isTopResult: boolean = false,
    confidence?: string,
    showRanking?: boolean
  ): string {
    const displayName = this.getProductDisplayName(productName) || productName;
    const grafanaLink = this.getGrafanaLink(displayName);
    const resultClass = isTopResult ? 'product-ranking top-result' : 'product-ranking';

    // Get characteristics from products data
    const characteristics = this.products[productName]?.characteristics;

    let html = `<div class="${resultClass}">`;

    if (showRanking) {
      html += `<div class="product-title">${displayName}</div>`;
      if (isTopResult) {
        html += '<span class="most-likely-label">Most Likely</span>';
      }
    } else {
      html += `<div class="product-title">${displayName}</div>`;
      if (isTopResult) {
        html += '<span class="most-likely-label">Detected</span>';
      }
    }

    // Add characteristics and confidence
    const details = [];
    if (confidence) details.push(`Confidence: ${confidence}`);
    if (characteristics) {
      details.push(characteristics.slice(0, 3).join(', '));
    }

    if (details.length > 0) {
      html += `<div class="product-details">${details.join(' • ')}</div>`;
    }

    // Add Grafana link if available
    if (grafanaLink) {
      html += `
        <div class="product-details" style="margin-top: 0.5rem;">
          <a href="${grafanaLink}" target="_blank" class="grafana-link">
            Configure Grafana for ${displayName}
          </a>
        </div>
      `;
    }

    html += '</div>';

    // Add configuration guidance for top results
    if (isTopResult) {
      const configGuidance = this.generateConfigurationGuidance(productName);
      if (configGuidance) {
        html += configGuidance;
      }
    }

    return html;
  }

  /**
   * Maps simple product keys (used in URL detection) to full product names (used in scoring)
   */
  private mapProductKeyToFullName(productKey: string): string | null {
    const KEY_TO_FULL_NAME_MAP: Record<string, string> = {
      'core': 'InfluxDB 3 Core',
      'enterprise': 'InfluxDB 3 Enterprise',
      'serverless': 'InfluxDB Cloud Serverless',
      'dedicated': 'InfluxDB Cloud Dedicated',
      'clustered': 'InfluxDB Clustered',
      'cloud-v2-tsm': 'InfluxDB Cloud (TSM)',
      'cloud-v1': 'InfluxDB Cloud v1',
      'oss': 'InfluxDB OSS 2.x',
      'oss-1x': 'InfluxDB OSS 1.x',
      'enterprise-1x': 'InfluxDB Enterprise'
    };

    return KEY_TO_FULL_NAME_MAP[productKey] || null;
  }

  private applyScoring(scores: Record<string, number>): void {
    // Product release dates for time-aware scoring
    const PRODUCT_RELEASE_DATES: Record<string, Date> = {
      'InfluxDB 3 Core': new Date('2025-01-01'),
      'InfluxDB 3 Enterprise': new Date('2025-01-01'),
      'InfluxDB Cloud Serverless': new Date('2024-01-01'),
      'InfluxDB Cloud Dedicated': new Date('2024-01-01'),
      'InfluxDB Clustered': new Date('2024-01-01'),
      'InfluxDB OSS 2.x': new Date('2020-11-01'),
      'InfluxDB Cloud (TSM)': new Date('2020-11-01'),
      'InfluxDB OSS 1.x': new Date('2016-09-01'),
      'InfluxDB Enterprise': new Date('2016-09-01'),
    };

    const currentDate = new Date();

    // Apply URL detection boost if available
    if (this.answers.detectedProduct && this.answers.detectedConfidence) {
      const fullProductName = this.mapProductKeyToFullName(this.answers.detectedProduct as string);
      if (fullProductName && scores[fullProductName] !== undefined) {
        const confidence = typeof this.answers.detectedConfidence === 'number'
          ? this.answers.detectedConfidence
          : parseFloat(this.answers.detectedConfidence as string);
        // Strong confidence boost for definitive URL pattern matches
        if (confidence >= 1.0) {
          scores[fullProductName] += 100; // Definitive match
        } else if (confidence >= 0.9) {
          scores[fullProductName] += 80; // Very high confidence
        } else if (confidence >= 0.7) {
          scores[fullProductName] += 60; // High confidence
        } else if (confidence >= 0.5) {
          scores[fullProductName] += 40; // Medium confidence
        }
      }
    }

    // Cloud vs self-hosted
    if (this.answers.hosted === 'cloud') {
      scores['InfluxDB 3 Core'] = -1000;
      scores['InfluxDB 3 Enterprise'] = -1000;
      scores['InfluxDB OSS 1.x'] = -1000;
      scores['InfluxDB OSS 2.x'] = -1000;
      scores['InfluxDB Enterprise'] = -1000;
      scores['InfluxDB Clustered'] = -1000;
    } else if (this.answers.hosted === 'self' || !this.answers.isCloud) {
      scores['InfluxDB Cloud Dedicated'] = -1000;
      scores['InfluxDB Cloud Serverless'] = -1000;
      scores['InfluxDB Cloud (TSM)'] = -1000;
    }

    // Paid vs Free
    if (this.answers.paid === 'free') {
      scores['InfluxDB 3 Core'] += 25;
      scores['InfluxDB OSS 1.x'] += 25;
      scores['InfluxDB OSS 2.x'] += 25;
      scores['InfluxDB Cloud Serverless'] += 10;
      scores['InfluxDB Cloud (TSM)'] += 10;

      scores['InfluxDB 3 Enterprise'] = -100;
      scores['InfluxDB Enterprise'] = -100;
      scores['InfluxDB Clustered'] = -100;
      scores['InfluxDB Cloud Dedicated'] = -100;
    } else if (this.answers.paid === 'paid') {
      scores['InfluxDB 3 Enterprise'] += 25;
      scores['InfluxDB Enterprise'] += 20;
      scores['InfluxDB Clustered'] += 15;
      scores['InfluxDB Cloud Dedicated'] += 20;
      scores['InfluxDB Cloud Serverless'] += 15;
      scores['InfluxDB Cloud (TSM)'] += 15;

      scores['InfluxDB 3 Core'] = -100;
      scores['InfluxDB OSS 1.x'] = -100;
      scores['InfluxDB OSS 2.x'] = -100;
    }

    // Time-aware age-based scoring
    Object.entries(scores).forEach(([product]) => {
      const releaseDate = PRODUCT_RELEASE_DATES[product];
      if (!releaseDate) return;

      const yearsSinceRelease =
        (currentDate.getTime() - releaseDate.getTime()) /
        (365.25 * 24 * 60 * 60 * 1000);

      if (this.answers.age === 'recent') {
        // Favor products released within last year
        if (yearsSinceRelease < 1) {
          scores[product] += 40; // Very new product
        } else if (yearsSinceRelease < 3) {
          scores[product] += 25; // Relatively new
        }
      } else if (this.answers.age === '1-5') {
        // Check if product existed in this timeframe
        if (yearsSinceRelease >= 1 && yearsSinceRelease <= 5) {
          scores[product] += 25;
        } else if (yearsSinceRelease < 1) {
          scores[product] -= 30; // Too new for this age range
        }
      } else if (this.answers.age === '5+') {
        // Only penalize if product didn't exist 5+ years ago
        if (yearsSinceRelease < 5) {
          scores[product] -= 100; // Product didn't exist 5 years ago
        } else {
          scores[product] += 30; // Product was available 5+ years ago
        }
      }
    });

    // Query language scoring
    if (this.answers.language === 'sql') {
      scores['InfluxDB 3 Core'] += 40;
      scores['InfluxDB 3 Enterprise'] += 40;
      scores['InfluxDB Cloud Dedicated'] += 30;
      scores['InfluxDB Cloud Serverless'] += 30;
      scores['InfluxDB Clustered'] += 30;

      scores['InfluxDB OSS 1.x'] = -1000;
      scores['InfluxDB OSS 2.x'] = -1000;
      scores['InfluxDB Enterprise'] = -1000;
      scores['InfluxDB Cloud (TSM)'] = -1000;
    } else if (this.answers.language === 'flux') {
      scores['InfluxDB OSS 2.x'] += 30;
      scores['InfluxDB Cloud (TSM)'] += 40;
      scores['InfluxDB Cloud Serverless'] += 20;
      scores['InfluxDB Enterprise'] += 20;  // v1.x Enterprise supports Flux

      scores['InfluxDB OSS 1.x'] = -1000;
      scores['InfluxDB 3 Core'] = -1000;
      scores['InfluxDB 3 Enterprise'] = -1000;
      scores['InfluxDB Cloud Dedicated'] = -1000;
      scores['InfluxDB Clustered'] = -1000;
    } else if (this.answers.language === 'influxql') {
      // InfluxQL is supported by all products except pure Flux products
      scores['InfluxDB OSS 1.x'] += 30;
      scores['InfluxDB Enterprise'] += 30;
      scores['InfluxDB OSS 2.x'] += 20;
      scores['InfluxDB Cloud (TSM)'] += 20;
      scores['InfluxDB 3 Core'] += 25;
      scores['InfluxDB 3 Enterprise'] += 25;
      scores['InfluxDB Cloud Dedicated'] += 25;
      scores['InfluxDB Cloud Serverless'] += 25;
      scores['InfluxDB Clustered'] += 25;
    }
  }

  private displayRankedResults(ranked: [string, number][]): void {
    const topScore = ranked[0]?.[1] || 0;
    const secondScore = ranked[1]?.[1] || 0;
    const hasStandout = topScore > 30 && topScore - secondScore >= 15;

    let html =
      '<strong>Based on your answers, here are the most likely InfluxDB products:</strong><br><br>';

    ranked.forEach(([product, score], index) => {
      const confidence = score > 60 ? 'High' : score > 30 ? 'Medium' : 'Low';
      const isTopResult = index === 0 && hasStandout;

      // Use unified product result generation with ranking number
      let productHtml = this.generateProductResult(product, isTopResult, confidence, true);

      // Add ranking number to the product title
      productHtml = productHtml.replace(
        '<div class="product-title">',
        `<div class="product-title">${index + 1}. `
      );

      html += productHtml;
    });

    // Add Quick Reference table
    html += `
      <div class="quick-reference">
        <details>
          <summary class="reference-summary">
            InfluxDB version quick reference
          </summary>
          <table class="reference-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>License</th>
                <th>Hosting</th>
                <th>Port</th>
                <th>Ping requires auth</th>
                <th>Query languages</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="product-name">InfluxDB 3 Enterprise</td>
                <td>Paid only</td>
                <td>Self-hosted</td>
                <td>8181</td>
                <td>Yes (opt-out)</td>
                <td>SQL, InfluxQL</td>
              </tr>
              <tr>
                <td class="product-name">InfluxDB 3 Core</td>
                <td>Free only</td>
                <td>Self-hosted</td>
                <td>8181</td>
                <td>Yes (opt-out)</td>
                <td>SQL, InfluxQL</td>
              </tr>
              <tr>
                <td class="product-name">InfluxDB Enterprise</td>
                <td>Paid only</td>
                <td>Self-hosted</td>
                <td>8086</td>
                <td>Yes (required)</td>
                <td>InfluxQL, Flux</td>
              </tr>
              <tr>
                <td class="product-name">InfluxDB Clustered</td>
                <td>Paid only</td>
                <td>Self-hosted</td>
                <td>Varies</td>
                <td>No</td>
                <td>SQL, InfluxQL</td>
              </tr>
              <tr>
                <td class="product-name">InfluxDB OSS 1.x</td>
                <td>Free only</td>
                <td>Self-hosted</td>
                <td>8086</td>
                <td>No (optional)</td>
                <td>InfluxQL</td>
              </tr>
              <tr>
                <td class="product-name">InfluxDB OSS 2.x</td>
                <td>Free only</td>
                <td>Self-hosted</td>
                <td>8086</td>
                <td>No</td>
                <td>InfluxQL, Flux</td>
              </tr>
              <tr>
                <td class="product-name">InfluxDB Cloud Dedicated</td>
                <td>Paid only</td>
                <td>Cloud</td>
                <td>N/A</td>
                <td>No</td>
                <td>SQL, InfluxQL</td>
              </tr>
              <tr>
                <td class="product-name">InfluxDB Cloud Serverless</td>
                <td>Free + Paid</td>
                <td>Cloud</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>SQL, InfluxQL, Flux</td>
              </tr>
              <tr>
                <td class="product-name">InfluxDB Cloud (TSM)</td>
                <td>Free + Paid</td>
                <td>Cloud</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>InfluxQL, Flux</td>
              </tr>
            </tbody>
          </table>
        </details>
      </div>
    `;

    this.showResult('success', html);
  }

  private analyzePingHeaders(): void {
    const headersText = (
      this.container.querySelector('#ping-headers') as HTMLTextAreaElement
    )?.value.trim();

    if (!headersText) {
      this.showResult('error', 'Please paste the ping response headers');
      return;
    }

    // Check if user is trying to analyze the example content
    if (headersText.includes('# Replace this with your actual response headers') ||
        headersText.includes('# Example formats:')) {
      this.showResult('error', 'Please replace the example content with your actual ping response headers');
      return;
    }

    // Check for 401/403 unauthorized responses
    if (headersText.includes('401') || headersText.includes('403')) {
      this.showResult(
        'info',
        `
        <strong>Authentication Required Detected</strong><br><br>
        The ping endpoint requires authentication, which indicates you're likely using one of:<br><br>
        <div class="expected-results">
          <div class="manual-output">
            <strong>InfluxDB 3 Enterprise</strong> - Requires auth by default (opt-out possible)
          </div>
          <div class="manual-output">
            <strong>InfluxDB 3 Core</strong> - Requires auth by default (opt-out possible)
          </div>
        </div>
        Please use the guided questions to narrow down your specific version.
      `
      );
      return;
    }

    // Parse headers and check against patterns
    const headers: Record<string, string> = {};
    headersText.split('\n').forEach((line) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        const key = line.substring(0, colonIndex).trim().toLowerCase();
        const value = line.substring(colonIndex + 1).trim();
        headers[key] = value;
      }
    });

    // PRIORITY: Check for definitive x-influxdb-build header (per decision tree)
    const buildHeader = headers['x-influxdb-build'];
    if (buildHeader) {
      if (buildHeader.toLowerCase().includes('enterprise')) {
        this.showDetectedVersion('InfluxDB 3 Enterprise');
        return;
      } else if (buildHeader.toLowerCase().includes('core')) {
        this.showDetectedVersion('InfluxDB 3 Core');
        return;
      }
    }

    // Check against product patterns
    let detectedProduct: string | null = null;
    for (const [productName, config] of Object.entries(this.products)) {
      if (config.detection?.ping_headers) {
        let matches = true;
        for (const [header, pattern] of Object.entries(
          config.detection.ping_headers
        )) {
          const regex = new RegExp(pattern);
          if (!headers[header] || !regex.test(headers[header])) {
            matches = false;
            break;
          }
        }
        if (matches) {
          detectedProduct = productName;
          break;
        }
      }
    }

    if (detectedProduct) {
      this.showDetectedVersion(detectedProduct);
    } else {
      this.showResult(
        'warning',
        'Unable to determine version from headers. Consider using the guided questions instead.'
      );
    }
  }

  private showResult(type: string, message: string): void {
    if (this.resultDiv) {
      this.resultDiv.className = `result ${type} show`;
      this.resultDiv.innerHTML = message;
    }
    if (this.restartBtn) {
      this.restartBtn.style.display = 'block';
    }
  }

  private analyzeDockerOutput(): void {
    const dockerOutput = (
      this.container.querySelector('#docker-output') as HTMLTextAreaElement
    )?.value.trim();

    if (!dockerOutput) {
      this.showResult('error', 'Please paste the Docker command output');
      return;
    }

    // Check if user is trying to analyze the example content
    if (dockerOutput.includes('# Replace this with your actual command output') ||
        dockerOutput.includes('# Example formats:')) {
      this.showResult('error', 'Please replace the example content with your actual Docker command output');
      return;
    }

    let detectedProduct: string | null = null;

    // Check for version patterns in the output
    if (dockerOutput.includes('InfluxDB 3 Core')) {
      detectedProduct = 'InfluxDB 3 Core';
    } else if (dockerOutput.includes('InfluxDB 3 Enterprise')) {
      detectedProduct = 'InfluxDB 3 Enterprise';
    } else if (dockerOutput.includes('InfluxDB v3')) {
      // Generic v3 detection - need more info
      detectedProduct = 'InfluxDB 3 Core or Enterprise';
    } else if (dockerOutput.includes('InfluxDB v2') || dockerOutput.includes('InfluxDB 2.')) {
      detectedProduct = 'InfluxDB OSS 2.x';
    } else if (dockerOutput.includes('InfluxDB v1') || dockerOutput.includes('InfluxDB 1.')) {
      if (dockerOutput.includes('Enterprise')) {
        detectedProduct = 'InfluxDB Enterprise';
      } else {
        detectedProduct = 'InfluxDB OSS 1.x';
      }
    }

    // Also check for ping header patterns (case-insensitive)
    if (!detectedProduct) {
      // First check for x-influxdb-build header (definitive identification)
      const buildMatch = dockerOutput.match(/x-influxdb-build:\s*(\w+)/i);
      if (buildMatch) {
        const build = buildMatch[1].toLowerCase();
        if (build === 'enterprise') {
          detectedProduct = 'InfluxDB 3 Enterprise';
        } else if (build === 'core') {
          detectedProduct = 'InfluxDB 3 Core';
        }
      }

      // If no build header, check version headers (case-insensitive)
      if (!detectedProduct) {
        const versionMatch = dockerOutput.match(/x-influxdb-version:\s*([\d.]+)/i);
        if (versionMatch) {
          const version = versionMatch[1];
          if (version.startsWith('3.')) {
            detectedProduct = 'InfluxDB 3 Core or Enterprise';
          } else if (version.startsWith('2.')) {
            detectedProduct = 'InfluxDB OSS 2.x';
          } else if (version.startsWith('1.')) {
            detectedProduct = dockerOutput.includes('Enterprise') ? 'InfluxDB Enterprise' : 'InfluxDB OSS 1.x';
          }
        }
      }
    }

    if (detectedProduct) {
      this.showDetectedVersion(detectedProduct);
    } else {
      this.showResult(
        'warning',
        'Unable to determine version from Docker output. Consider using the guided questions instead.'
      );
    }
  }

  private showPingTestSuggestion(url: string, productName: string): void {
    // Convert product key to display name
    const displayName = this.getProductDisplayName(productName) || productName;
    const html = `
      <strong>Port 8181 detected - likely ${displayName}</strong><br><br>

      <p>To distinguish between InfluxDB 3 Core and Enterprise, run one of these commands:</p>

      <div class="code-block">
# Direct API call:
curl -I ${url}/ping
      </div>

      <details style="margin: 1rem 0;">
        <summary class="expandable-summary">
          View Docker/Container Commands
        </summary>
        <div class="code-block" style="margin-top: 0.5rem;">
# With Docker Compose:
docker compose exec influxdb3 curl -I http://localhost:8181/ping

# With Docker (replace &lt;container&gt; with your container name):
docker exec &lt;container&gt; curl -I localhost:8181/ping
        </div>
      </details>

      <div class="expected-results">
        <div class="results-title">Expected results:</div>
        • <strong>X-Influxdb-Build: Enterprise</strong> → InfluxDB 3 Enterprise (definitive)<br>
        • <strong>X-Influxdb-Build: Core</strong> → InfluxDB 3 Core (definitive)<br>
        • <strong>401 Unauthorized</strong> → Use the license information below
      </div>

      <div class="authorization-help">
        <div class="results-title">If you get 401 Unauthorized:</div>
        <p><strong>What type of license do you have?</strong></p>
        <button class="option-button compact"
                data-action="auth-help-answer"
                data-category="paid"
                data-value="free">
          Free / Open Source
        </button>
        <button class="option-button compact"
                data-action="auth-help-answer"
                data-category="paid"
                data-value="paid">
          Paid / Commercial
        </button>
      </div>

      <div class="action-section">
        <strong>Can't run the command?</strong>
        <button class="option-button" data-action="start-questionnaire" data-context="v3-port-detected">
          Use guided questions instead
        </button>
      </div>
    `;
    this.showResult('success', html);
  }

  private showOSSVersionCheckSuggestion(url: string): void {
    const html = `
      <strong>Port 8086 detected - likely InfluxDB OSS</strong><br><br>

      <p>To determine if this is InfluxDB OSS v1.x or v2.x, run one of these commands:</p>

      <div class="code-block">
# Check version directly:
influxd version

# Or check via API:
curl -I ${url}/ping
      </div>

      <div class="expected-results">
        <div class="results-title">Expected version patterns:</div>
        • <strong>v1.x.x</strong> → ${this.getProductDisplayName('oss-v1')}<br>
        • <strong>v2.x.x</strong> → ${this.getProductDisplayName('oss-v2')}<br>
      </div>

      <details style="margin: 1rem 0;">
        <summary class="expandable-summary">
          Docker/Container Commands
        </summary>
        <div class="code-block" style="margin-top: 0.5rem;">
# Get version info:
docker exec &lt;container&gt; influxd version

# Get ping headers:
docker exec &lt;container&gt; curl -I localhost:8086/ping

# Or check startup logs:
docker logs &lt;container&gt; 2>&1 | head -20
        </div>
        <p style="margin-top: 0.5rem; font-size: 0.9em; opacity: 0.8;">
          Replace &lt;container&gt; with your actual container name or ID.
        </p>
      </details>

      <div class="action-section">
        <strong>Can't run these commands?</strong>
        <button class="option-button" data-action="start-questionnaire" data-context="oss-port-detected">
          Use guided questions instead
        </button>
      </div>
    `;
    this.showResult('success', html);
  }


  private showDetectedVersion(productName: string): void {
    // Track successful detection
    this.trackAnalyticsEvent({
      interaction_type: 'product_detected',
      detected_product: productName.toLowerCase().replace(/\s+/g, '_'),
      completion_status: 'success',
      section: this.getCurrentPageSection()
    });

    const html = `
      <strong>Based on your input, we believe the InfluxDB product you are using is most likely:</strong><br><br>
      ${this.generateProductResult(productName, true, 'High', false)}
    `;
    this.showResult('success', html);
  }

  private restart(): void {
    this.answers = {};
    this.questionFlow = [];
    this.currentQuestionIndex = 0;

    // Clear inputs
    const urlInput = this.container.querySelector(
      '#url-input'
    ) as HTMLInputElement;
    const pingHeaders = this.container.querySelector(
      '#ping-headers'
    ) as HTMLTextAreaElement;
    const dockerOutput = this.container.querySelector(
      '#docker-output'
    ) as HTMLTextAreaElement;

    if (urlInput) urlInput.value = '';
    if (pingHeaders) pingHeaders.value = '';
    if (dockerOutput) dockerOutput.value = '';

    // Remove URL prefilled indicator if present
    const indicator = this.container.querySelector('.url-prefilled-indicator');
    if (indicator) {
      indicator.remove();
    }

    // Hide result
    if (this.resultDiv) {
      this.resultDiv.classList.remove('show');
    }
    if (this.restartBtn) {
      this.restartBtn.style.display = 'none';
    }

    // Show first question
    this.showQuestion('q-url-known');

    // Reset progress
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }
  }

}

// Export as component initializer
export default function initInfluxDBVersionDetector(
  options: ComponentOptions
): InfluxDBVersionDetector {
  return new InfluxDBVersionDetector(options);
}
