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
interface ComponentOptions {
    component: HTMLElement;
}
declare global {
    interface Window {
        gtag?: (_event: string, _action: string, _parameters?: Record<string, unknown>) => void;
    }
}
declare class InfluxDBVersionDetector {
    private container;
    private products;
    private influxdbUrls;
    private answers;
    private initialized;
    private questionFlow;
    private currentQuestionIndex;
    private questionHistory;
    private progressBar;
    private resultDiv;
    private restartBtn;
    private currentContext;
    constructor(options: ComponentOptions);
    private parseComponentData;
    private init;
    private setupPlaceholders;
    private setupPingHeadersPlaceholder;
    private setupDockerOutputPlaceholder;
    private getCurrentPageSection;
    private trackAnalyticsEvent;
    private initializeForModal;
    private getBasicUrlSuggestion;
    private getProductDisplayName;
    private generateConfigurationGuidance;
    private getHostExample;
    private usesDatabaseTerminology;
    private getAuthenticationInfo;
    private detectEnterpriseFeatures;
    private analyzeUrlPatterns;
    private render;
    private attachEventListeners;
    private updateProgress;
    private showQuestion;
    private enhanceUrlInputWithSuggestions;
    private getCurrentProduct;
    private handleUrlKnown;
    private goBack;
    private detectByUrl;
    private detectContext;
    private detectPortFromUrl;
    private startQuestionnaire;
    private startQuestionnaireWithCloudContext;
    private answerQuestion;
    private handleAuthorizationHelp;
    private showRankedResults;
    /**
     * Gets the Grafana documentation link for a given product
     */
    private getGrafanaLink;
    /**
     * Generates a unified product result block with characteristics and Grafana link
     */
    private generateProductResult;
    /**
     * Maps simple product keys (used in URL detection) to full product names (used in scoring)
     */
    private mapProductKeyToFullName;
    private applyScoring;
    private displayRankedResults;
    private analyzePingHeaders;
    private showResult;
    private analyzeDockerOutput;
    private showPingTestSuggestion;
    private showOSSVersionCheckSuggestion;
    private showMultipleCandidatesSuggestion;
    private showDetectedVersion;
    private restart;
}
export default function initInfluxDBVersionDetector(options: ComponentOptions): InfluxDBVersionDetector;
export {};
//# sourceMappingURL=influxdb-version-detector.d.ts.map