/**
 * InfluxDB Version Detector Component
 * Helps users identify which InfluxDB product they're using through a guided questionnaire
 */

interface ProductConfig {
  queryLanguages: Record<string, string[]>;
  detection?: {
    urlContains?: string[];
    pingHeaders?: Record<string, RegExp>;
  };
  characteristics: string[];
}

interface Products {
  [key: string]: ProductConfig;
}

interface Answers {
  context?: string | null;
  portClue?: string | null;
  isCloud?: boolean;
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

class InfluxDBVersionDetector {
  private container: HTMLElement;
  private products: Products;
  private answers: Answers = {};
  private questionFlow: string[] = [];
  private currentQuestionIndex = 0;
  private progressBar: HTMLElement | null = null;
  private resultDiv: HTMLElement | null = null;
  private restartBtn: HTMLElement | null = null;

  constructor(options: ComponentOptions) {
    this.container = options.component;
    this.products = this.initializeProducts();
    this.init();
  }

  private initializeProducts(): Products {
    return {
      'InfluxDB Cloud Dedicated': {
        queryLanguages: {
          SQL: ['Host', 'Database', 'Token'],
          InfluxQL: ['Host', 'Database', 'Token'],
        },
        detection: {
          urlContains: ['influxdb.io'],
        },
        characteristics: [
          'Paid',
          'Cloud',
          'SQL/InfluxQL',
          'Token',
          'Databases',
        ],
      },
      'InfluxDB Cloud Serverless': {
        queryLanguages: {
          SQL: ['Host', 'Bucket', 'Token'],
          InfluxQL: ['Host', 'Bucket', 'Token'],
          Flux: ['Host', 'Organization', 'Token', 'Default bucket'],
        },
        detection: {
          urlContains: [
            'us-east-1-1.aws.cloud2.influxdata.com',
            'eu-central-1-1.aws.cloud2.influxdata.com',
          ],
        },
        characteristics: [
          'Paid/Free',
          'Cloud',
          'All languages',
          'Token',
          'Buckets',
        ],
      },
      'InfluxDB Clustered': {
        queryLanguages: {
          SQL: ['Host', 'Database', 'Token'],
          InfluxQL: ['URL', 'Database', 'Token'],
        },
        detection: {
          pingHeaders: {
            'x-influxdb-version': /\s*influxqlbridged-development/,
          },
        },
        characteristics: [
          'Paid',
          'Self-hosted',
          'SQL/InfluxQL',
          'Token',
          'Databases',
        ],
      },
      'InfluxDB Enterprise': {
        queryLanguages: {
          InfluxQL: ['URL', 'Database', 'User', 'Password'],
          Flux: ['URL', 'User', 'Password', 'Default database'],
        },
        detection: {
          pingHeaders: {
            'x-influxdb-build': /Enterprise/,
          },
        },
        characteristics: [
          'Paid',
          'Self-hosted',
          'InfluxQL/Flux',
          'Username/Password',
          'Databases',
        ],
      },
      'InfluxDB Cloud (TSM)': {
        queryLanguages: {
          InfluxQL: ['URL', 'Database', 'Token'],
          Flux: ['URL', 'Organization', 'Token', 'Default bucket'],
        },
        detection: {
          urlContains: [
            'us-west-2-1.aws.cloud2.influxdata.com',
            'us-west-2-2.aws.cloud2.influxdata.com',
            'us-east-1-1.aws.cloud2.influxdata.com',
            'eu-central-1-1.aws.cloud2.influxdata.com',
            'us-central1-1.gcp.cloud2.influxdata.com',
            'westeurope-1.azure.cloud2.influxdata.com',
            'eastus-1.azure.cloud2.influxdata.com',
          ],
        },
        characteristics: [
          'Paid/Free',
          'Cloud',
          'InfluxQL/Flux',
          'Token',
          'Databases/Buckets',
        ],
      },
      'InfluxDB OSS 1.x': {
        queryLanguages: {
          InfluxQL: ['URL', 'Database', 'Username', 'Password'],
          Flux: ['URL', 'Username', 'Password', 'Default database'],
        },
        detection: {
          pingHeaders: {
            'x-influxdb-build': /OSS/,
            'x-influxdb-version': /^1\./,
          },
        },
        characteristics: [
          'Free',
          'Self-hosted',
          'InfluxQL/Flux',
          'Username/Password',
          'Databases',
        ],
      },
      'InfluxDB OSS 2.x': {
        queryLanguages: {
          InfluxQL: ['URL', 'Database', 'Auth Type (Basic or Token)'],
          Flux: ['URL', 'Token', 'Default bucket'],
        },
        detection: {
          pingHeaders: {
            'x-influxdb-build': /OSS/,
            'x-influxdb-version': /^2\./,
          },
        },
        characteristics: [
          'Free',
          'Self-hosted',
          'InfluxQL/Flux',
          'Token or Username/Password',
          'Buckets',
        ],
      },
      'InfluxDB 3 Enterprise': {
        queryLanguages: {
          SQL: ['Host', 'Database', 'Token'],
          InfluxQL: ['Host', 'Database', 'Token'],
        },
        detection: {
          pingHeaders: {
            'x-influxdb-version': /^3\./,
            'x-influxdb-build': /Enterprise/,
          },
        },
        characteristics: [
          'Paid',
          'Self-hosted',
          'SQL/InfluxQL',
          'Token',
          'Databases',
        ],
      },
      'InfluxDB 3 Core': {
        queryLanguages: {
          SQL: ['Host', 'Database'],
          InfluxQL: ['Host', 'Database'],
        },
        detection: {
          pingHeaders: {
            'x-influxdb-version': /^3\./,
            'x-influxdb-build': /Core/,
          },
        },
        characteristics: [
          'Free',
          'Self-hosted',
          'SQL/InfluxQL',
          'No auth required',
          'Databases',
        ],
      },
    };
  }

  private init(): void {
    this.render();
    this.attachEventListeners();
    this.showQuestion('q-url-known');
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="influxdb-version-detector">
        <h2 class="detector-title">InfluxDB Product Detector</h2>
        <p class="detector-subtitle">Answer a few questions to identify which InfluxDB product you're using</p>

        <div class="progress">
          <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
        </div>

        <div class="question-container">
          <!-- Question: Do you know URL -->
          <div class="question active" id="q-url-known">
            <div class="question-text">Do you know the URL of your InfluxDB server?</div>
            <button class="option-button" data-action="url-known" data-value="true">
              Yes, I know the URL
            </button>
            <button class="option-button" data-action="url-known" data-value="false">
              No, I don't know the URL
            </button>
            <button class="option-button" data-action="url-known" data-value="airgapped">
              Yes, but it's in an airgapped environment
            </button>
          </div>

          <!-- Question: Enter URL -->
          <div class="question" id="q-url-input">
            <div class="question-text">Please enter your InfluxDB server URL:</div>
            <div class="input-group">
              <input type="url" id="url-input"
                     placeholder="e.g., https://us-east-1-1.aws.cloud2.influxdata.com or http://localhost:8086">
            </div>
            <button class="back-button" data-action="go-back">Back</button>
            <button class="submit-button" data-action="detect-url">Detect Version</button>
          </div>

          <!-- Question: Manual ping test -->
          <div class="question" id="q-ping-manual">
            <div class="question-text">
              For airgapped environments, run this command from a machine that can access your InfluxDB:
            </div>
            <div class="code-block">curl -I http://your-influxdb-url:8086/ping</div>
            <div class="question-text" style="margin-top: 15px;">
              Then paste the response headers here:
            </div>
            <textarea id="ping-headers"
                      placeholder="X-Influxdb-Build: OSS&#10;X-Influxdb-Version: 2.7.1&#10;&#10;Or if you get HTTP/1.1 401 Unauthorized, paste that">
            </textarea>
            <div style="margin-top: 15px;">
              <button class="back-button" data-action="go-back">Back</button>
              <button class="submit-button" data-action="analyze-headers">Analyze Headers</button>
            </div>
          </div>

          <!-- Question: Paid vs Free -->
          <div class="question" id="q-paid">
            <div class="question-text">Which type of InfluxDB license do you have?</div>
            <button class="option-button" data-action="answer" data-category="paid" data-value="paid">
              Paid/Commercial License
            </button>
            <button class="option-button" data-action="answer" data-category="paid" data-value="free">
              Free/Open Source (including free cloud tiers)
            </button>
            <button class="option-button" data-action="answer" data-category="paid" data-value="unknown">
              I'm not sure
            </button>
          </div>

          <!-- Question: Cloud vs Self-hosted -->
          <div class="question" id="q-hosted">
            <div class="question-text">Is your InfluxDB instance hosted by InfluxData (cloud) or self-hosted?</div>
            <button class="option-button" data-action="answer" data-category="hosted" data-value="cloud">
              Cloud service (hosted by InfluxData)
            </button>
            <button class="option-button" data-action="answer" data-category="hosted" data-value="self">
              Self-hosted (on your own servers)
            </button>
            <button class="option-button" data-action="answer" data-category="hosted" data-value="unknown">
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
            this.handleUrlKnown(target.dataset.value);
            break;
          case 'go-back':
            this.goBack();
            break;
          case 'detect-url':
            this.detectByUrl();
            break;
          case 'analyze-headers':
            this.analyzePingHeaders();
            break;
          case 'answer':
            this.answerQuestion(
              target.dataset.category!,
              target.dataset.value!
            );
            break;
          case 'restart':
            this.restart();
            break;
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
    }

    this.updateProgress();
  }

  private handleUrlKnown(value: string | undefined): void {
    this.currentQuestionIndex++;

    if (value === 'true') {
      this.showQuestion('q-url-input');
    } else if (value === 'airgapped') {
      this.showQuestion('q-ping-manual');
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

    // Check URL patterns first
    let detectedProduct: string | null = null;

    for (const [productName, config] of Object.entries(this.products)) {
      if (config.detection?.urlContains) {
        for (const pattern of config.detection.urlContains) {
          if (urlInput.includes(pattern)) {
            detectedProduct = productName;
            break;
          }
        }
      }
      if (detectedProduct) break;
    }

    if (detectedProduct) {
      this.showDetectedVersion(detectedProduct);
      return;
    }

    // URL not recognized - start questionnaire with context
    this.showResult(
      'info',
      'Analyzing your InfluxDB server...<span class="loading"></span>'
    );

    // For non-cloud URLs, we'll need to use the questionnaire
    setTimeout(() => {
      this.startQuestionnaire('manual', this.detectPortFromUrl(urlInput));
    }, 1500);
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

  private applyScoring(scores: Record<string, number>): void {
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

    // Age-based scoring
    if (this.answers.age === 'recent') {
      scores['InfluxDB 3 Core'] += 30;
      scores['InfluxDB 3 Enterprise'] += 30;
      scores['InfluxDB Cloud Serverless'] += 20;
      scores['InfluxDB Cloud Dedicated'] += 20;
    } else if (this.answers.age === '1-5') {
      scores['InfluxDB OSS 2.x'] += 25;
      scores['InfluxDB 3 Core'] += 15;
      scores['InfluxDB 3 Enterprise'] += 15;
      scores['InfluxDB Clustered'] += 15;
      scores['InfluxDB Cloud (TSM)'] += 15;
    } else if (this.answers.age === '5+') {
      scores['InfluxDB OSS 1.x'] += 30;
      scores['InfluxDB Enterprise'] += 30;
      scores['InfluxDB 3 Core'] -= 50;
      scores['InfluxDB 3 Enterprise'] -= 50;
    }

    // Query language scoring
    if (this.answers.language === 'sql') {
      scores['InfluxDB 3 Core'] += 40;
      scores['InfluxDB 3 Enterprise'] += 40;
      scores['InfluxDB Cloud Dedicated'] += 30;
      scores['InfluxDB Cloud Serverless'] += 30;
      scores['InfluxDB Clustered'] += 30;

      scores['InfluxDB OSS 1.x'] = -100;
      scores['InfluxDB OSS 2.x'] = -100;
      scores['InfluxDB Enterprise'] = -100;
    } else if (this.answers.language === 'flux') {
      scores['InfluxDB OSS 2.x'] += 30;
      scores['InfluxDB Cloud (TSM)'] += 20;
      scores['InfluxDB Cloud Serverless'] += 20;

      scores['InfluxDB OSS 1.x'] = -100;
      scores['InfluxDB 3 Core'] -= 30;
      scores['InfluxDB 3 Enterprise'] -= 30;
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
      const bgColor = index === 0 && hasStandout ? '#e7f3ff' : '#f9f9f9';
      const borderColor = index === 0 && hasStandout ? '#5c16c5' : '#ddd';

      html += `
        <div style="margin-bottom: 10px; padding: 12px; background: ${bgColor};
                    border-left: 4px solid ${borderColor}; border-radius: 4px;">
          <strong>${index + 1}. ${product}</strong>
          ${
            index === 0 && hasStandout
              ? '<span style="color: #5c16c5; font-size: 0.9em; margin-left: 10px;">Most Likely</span>'
              : ''
          }
          <div style="color: #666; font-size: 0.9em; margin-top: 5px;">
            Confidence: ${confidence}
            ${
              this.products[product].characteristics
                ? ' • ' +
                  this.products[product].characteristics.slice(0, 3).join(', ')
                : ''
            }
          </div>
        </div>
      `;
    });

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

    // Check for 401/403 unauthorized responses
    if (headersText.includes('401') || headersText.includes('403')) {
      this.showResult(
        'info',
        `
        <strong>Authentication Required Detected</strong><br><br>
        The ping endpoint requires authentication, which indicates you're likely using one of:<br><br>
        <div style="margin: 15px 0;">
          <div style="padding: 10px; background: white; border-left: 4px solid #5c16c5; margin-bottom: 10px;">
            <strong>InfluxDB 3 Enterprise</strong> - Requires token authentication for ping
          </div>
          <div style="padding: 10px; background: white; border-left: 4px solid #5c16c5;">
            <strong>InfluxDB 3 Core</strong> - May require authentication depending on configuration
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

    // Check against product patterns
    let detectedProduct: string | null = null;
    for (const [productName, config] of Object.entries(this.products)) {
      if (config.detection?.pingHeaders) {
        let matches = true;
        for (const [header, pattern] of Object.entries(
          config.detection.pingHeaders
        )) {
          if (!headers[header] || !pattern.test(headers[header])) {
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

  private showDetectedVersion(productName: string): void {
    const html = `
      <strong>Based on your input, we believe the InfluxDB product you are using is most likely:</strong><br><br>
      <div class="detected-version">${productName}</div>
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
    if (urlInput) urlInput.value = '';
    if (pingHeaders) pingHeaders.value = '';

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
