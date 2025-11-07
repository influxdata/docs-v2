/**
 * Format Selector Component
 *
 * Provides a dropdown menu for users and AI agents to access documentation
 * in different formats (Markdown for LLMs, ChatGPT/Claude integration, MCP servers).
 *
 * FEATURES:
 * - Copy page/section as Markdown to clipboard
 * - Open page in ChatGPT or Claude with context
 * - Connect to MCP servers (Cursor, VS Code) - future enhancement
 * - Adaptive UI for leaf nodes (single pages) vs branch nodes (sections)
 * - Smart section download for large sections (>10 pages)
 *
 * UI PATTERN:
 * Matches Mintlify's format selector with dark dropdown, icons, and sublabels.
 * See `.context/Screenshot 2025-11-13 at 11.39.13 AM.png` for reference.
 */

interface FormatSelectorConfig {
  pageType: 'leaf' | 'branch'; // Leaf = single page, Branch = section with children
  markdownUrl: string;
  sectionMarkdownUrl?: string; // For branch nodes - aggregated content
  markdownContent?: string; // For clipboard copy (lazy-loaded)
  pageTitle: string;
  pageUrl: string;

  // For branch nodes (sections)
  childPageCount?: number;
  estimatedTokens?: number;
  sectionDownloadUrl?: string;

  // AI integration URLs
  chatGptUrl: string;
  claudeUrl: string;

  // Future MCP server links
  mcpCursorUrl?: string;
  mcpVSCodeUrl?: string;
}

interface FormatSelectorOption {
  label: string;
  sublabel: string;
  icon: string; // SVG icon name or class
  action: () => void;
  href?: string; // For external links
  target?: string; // '_blank' for external links
  external: boolean; // Shows ↗ arrow
  visible: boolean; // Conditional display based on pageType/size
  dataAttribute: string; // For testing (e.g., 'copy-page', 'open-chatgpt')
}

interface ComponentOptions {
  component: HTMLElement;
}

/**
 * Initialize format selector component
 * @param {ComponentOptions} options - Component configuration
 */
export default function FormatSelector(options: ComponentOptions) {
  const { component } = options;

  // State
  let isOpen = false;
  let config: FormatSelectorConfig = {
    pageType: 'leaf',
    markdownUrl: '',
    pageTitle: '',
    pageUrl: '',
    chatGptUrl: '',
    claudeUrl: '',
  };

  // DOM elements
  const button = component.querySelector('button') as HTMLButtonElement;
  const dropdownMenu = component.querySelector(
    '[data-dropdown-menu]'
  ) as HTMLElement;

  if (!button || !dropdownMenu) {
    console.error('Format selector: Missing required elements');
    return;
  }

  /**
   * Initialize component config from page context and data attributes
   */
  function initConfig(): void {
    // page-context exports individual properties, not a detect() function
    const currentUrl = window.location.href;
    const currentPath = window.location.pathname;

    // Determine page type (leaf vs branch)
    const childCount = parseInt(component.dataset.childCount || '0', 10);
    const pageType: 'leaf' | 'branch' = childCount > 0 ? 'branch' : 'leaf';

    // Construct markdown URL
    // Hugo generates markdown files as index.md in directories matching the URL path
    let markdownUrl = currentPath;
    if (!markdownUrl.endsWith('.md')) {
      // Ensure path ends with /
      if (!markdownUrl.endsWith('/')) {
        markdownUrl += '/';
      }
      // Append index.md
      markdownUrl += 'index.md';
    }

    // Construct section markdown URL (for branch pages only)
    let sectionMarkdownUrl: string | undefined;
    if (pageType === 'branch') {
      sectionMarkdownUrl = markdownUrl.replace('index.md', 'index.section.md');
    }

    // Get page title from meta or h1
    const pageTitle =
      document
        .querySelector('meta[property="og:title"]')
        ?.getAttribute('content') ||
      document.querySelector('h1')?.textContent ||
      document.title;

    config = {
      pageType,
      markdownUrl,
      sectionMarkdownUrl,
      pageTitle,
      pageUrl: currentUrl,
      childPageCount: childCount,
      estimatedTokens: parseInt(component.dataset.estimatedTokens || '0', 10),
      sectionDownloadUrl: component.dataset.sectionDownloadUrl,

      // AI integration URLs
      chatGptUrl: generateChatGPTUrl(pageTitle, currentUrl, markdownUrl),
      claudeUrl: generateClaudeUrl(pageTitle, currentUrl, markdownUrl),

      // Future MCP server links
      mcpCursorUrl: component.dataset.mcpCursorUrl,
      mcpVSCodeUrl: component.dataset.mcpVSCodeUrl,
    };

    // Update button label based on page type
    updateButtonLabel();
  }

  /**
   * Update button label: "Copy page" vs "Copy section"
   */
  function updateButtonLabel(): void {
    const label = config.pageType === 'leaf' ? 'Copy page' : 'Copy section';
    const buttonText = button.querySelector('[data-button-text]');
    if (buttonText) {
      buttonText.textContent = label;
    }
  }

  /**
   * Generate ChatGPT share URL with page context
   */
  function generateChatGPTUrl(
    title: string,
    pageUrl: string,
    markdownUrl: string
  ): string {
    // ChatGPT share URL pattern (as of 2025)
    // This may need updating based on ChatGPT's URL scheme
    const baseUrl = 'https://chatgpt.com';
    const markdownFullUrl = `${window.location.origin}${markdownUrl}`;
    const prompt = `Read from ${markdownFullUrl} so I can ask questions about it.`;
    return `${baseUrl}/?q=${encodeURIComponent(prompt)}`;
  }

  /**
   * Generate Claude share URL with page context
   */
  function generateClaudeUrl(
    title: string,
    pageUrl: string,
    markdownUrl: string
  ): string {
    // Claude.ai share URL pattern (as of 2025)
    const baseUrl = 'https://claude.ai/new';
    const markdownFullUrl = `${window.location.origin}${markdownUrl}`;
    const prompt = `Read from ${markdownFullUrl} so I can ask questions about it.`;
    return `${baseUrl}?q=${encodeURIComponent(prompt)}`;
  }

  /**
   * Fetch markdown content for clipboard copy
   */
  async function fetchMarkdownContent(): Promise<string> {
    try {
      const response = await fetch(config.markdownUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch Markdown: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error fetching Markdown content:', error);
      throw error;
    }
  }

  /**
   * Copy content to clipboard
   */
  async function copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('Copied to clipboard!', 'success');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      showNotification('Failed to copy to clipboard', 'error');
    }
  }

  /**
   * Show notification (integrates with existing notifications module)
   */
  function showNotification(message: string, type: 'success' | 'error'): void {
    // TODO: Integrate with existing notifications module
    // For now, use a simple console log
    console.log(`[${type.toUpperCase()}] ${message}`);

    // Optionally add a simple visual notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      border-radius: 6px;
      z-index: 10000;
      font-size: 14px;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  /**
   * Handle copy page action
   */
  async function handleCopyPage(): Promise<void> {
    try {
      const markdown = await fetchMarkdownContent();
      await copyToClipboard(markdown);
      closeDropdown();
    } catch (error) {
      console.error('Failed to copy page:', error);
    }
  }

  /**
   * Handle copy section action (aggregates child pages)
   */
  async function handleCopySection(): Promise<void> {
    try {
      // Fetch aggregated section markdown (includes all child pages)
      const url = config.sectionMarkdownUrl || config.markdownUrl;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch section markdown: ${response.statusText}`
        );
      }

      const markdown = await response.text();
      await copyToClipboard(markdown);
      showNotification('Section copied to clipboard', 'success');
      closeDropdown();
    } catch (error) {
      console.error('Failed to copy section:', error);
      showNotification('Failed to copy section', 'error');
    }
  }

  /**
   * Handle download page action (for single pages)
   * Commented out - not needed right now
   */
  /*
  function handleDownloadPage(): void {
    // Trigger download of current page as markdown
    window.open(config.markdownUrl, '_self');
    closeDropdown();
  }
  */

  /**
   * Handle download section action
   * Commented out - not yet implemented
   */
  /*
  function handleDownloadSection(): void {
    if (config.sectionDownloadUrl) {
      window.open(config.sectionDownloadUrl, '_self');
      closeDropdown();
    }
  }
  */

  /**
   * Handle external link action
   */
  function handleExternalLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
    closeDropdown();
  }

  /**
   * Build dropdown options based on config
   */
  function buildOptions(): FormatSelectorOption[] {
    const options: FormatSelectorOption[] = [];

    // Option 1: Copy page/section
    if (config.pageType === 'leaf') {
      options.push({
        label: 'Copy page',
        sublabel: 'Copy page as Markdown for LLMs',
        icon: 'document',
        action: handleCopyPage,
        external: false,
        visible: true,
        dataAttribute: 'copy-page',
      });
    } else {
      options.push({
        label: 'Copy section',
        sublabel: `Copy all ${config.childPageCount} pages in this section as Markdown`,
        icon: 'document',
        action: handleCopySection,
        external: false,
        visible: true,
        dataAttribute: 'copy-section',
      });
    }

    // Option 1b: Download page (for leaf nodes)
    // Removed - not needed right now
    /*
    if (config.pageType === 'leaf' && config.markdownUrl) {
      options.push({
        label: 'Download page',
        sublabel: 'Download page as Markdown file',
        icon: 'download',
        action: handleDownloadPage,
        external: false,
        visible: true,
        dataAttribute: 'download-page',
      });
    }
    */

    // Option 2: Open in ChatGPT
    options.push({
      label: 'Open in ChatGPT',
      sublabel: 'Ask questions about this page',
      icon: 'chatgpt',
      action: () => handleExternalLink(config.chatGptUrl),
      href: config.chatGptUrl,
      target: '_blank',
      external: true,
      visible: true,
      dataAttribute: 'open-chatgpt',
    });

    // Option 3: Open in Claude
    options.push({
      label: 'Open in Claude',
      sublabel: 'Ask questions about this page',
      icon: 'claude',
      action: () => handleExternalLink(config.claudeUrl),
      href: config.claudeUrl,
      target: '_blank',
      external: true,
      visible: true,
      dataAttribute: 'open-claude',
    });

    // Future: Download section option
    // Commented out - not yet implemented
    /*
    if (config.pageType === 'branch') {
      const shouldShowDownload =
        (config.childPageCount && config.childPageCount > 10) ||
        (config.estimatedTokens && config.estimatedTokens >= 50000);

      if (shouldShowDownload && config.sectionDownloadUrl) {
        options.push({
          label: 'Download section',
          sublabel: `Download all ${config.childPageCount} pages (.zip with /md and /txt folders)`,
          icon: 'download',
          action: handleDownloadSection,
          external: false,
          visible: true,
          dataAttribute: 'download-section',
        });
      }
    }
    */

    // Future: MCP server options
    // Commented out for now - will be implemented as future enhancement
    /*
    if (config.mcpCursorUrl) {
      options.push({
        label: 'Connect to Cursor',
        sublabel: 'Install MCP Server on Cursor',
        icon: 'cursor',
        action: () => handleExternalLink(config.mcpCursorUrl!),
        href: config.mcpCursorUrl,
        target: '_blank',
        external: true,
        visible: true,
        dataAttribute: 'connect-cursor',
      });
    }

    if (config.mcpVSCodeUrl) {
      options.push({
        label: 'Connect to VS Code',
        sublabel: 'Install MCP Server on VS Code',
        icon: 'vscode',
        action: () => handleExternalLink(config.mcpVSCodeUrl!),
        href: config.mcpVSCodeUrl,
        target: '_blank',
        external: true,
        visible: true,
        dataAttribute: 'connect-vscode',
      });
    }
    */

    return options.filter((opt) => opt.visible);
  }

  /**
   * Get SVG icon for option
   */
  function getIconSVG(iconName: string): string {
    const icons: Record<string, string> = {
      document: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2C4.89543 2 4 2.89543 4 4V16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16V7L11 2H6Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11 2V7H16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      chatgpt: `<svg viewBox="0 0 721 721" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_chatgpt)">
          <path d="M304.246 294.611V249.028C304.246 245.189 305.687 242.309 309.044 240.392L400.692 187.612C413.167 180.415 428.042 177.058 443.394 177.058C500.971 177.058 537.44 221.682 537.44 269.182C537.44 272.54 537.44 276.379 536.959 280.218L441.954 224.558C436.197 221.201 430.437 221.201 424.68 224.558L304.246 294.611ZM518.245 472.145V363.224C518.245 356.505 515.364 351.707 509.608 348.349L389.174 278.296L428.519 255.743C431.877 253.826 434.757 253.826 438.115 255.743L529.762 308.523C556.154 323.879 573.905 356.505 573.905 388.171C573.905 424.636 552.315 458.225 518.245 472.141V472.145ZM275.937 376.182L236.592 353.152C233.235 351.235 231.794 348.354 231.794 344.515V238.956C231.794 187.617 271.139 148.749 324.4 148.749C344.555 148.749 363.264 155.468 379.102 167.463L284.578 222.164C278.822 225.521 275.942 230.319 275.942 237.039V376.186L275.937 376.182ZM360.626 425.122L304.246 393.455V326.283L360.626 294.616L417.002 326.283V393.455L360.626 425.122ZM396.852 570.989C376.698 570.989 357.989 564.27 342.151 552.276L436.674 497.574C442.431 494.217 445.311 489.419 445.311 482.699V343.552L485.138 366.582C488.495 368.499 489.936 371.379 489.936 375.219V480.778C489.936 532.117 450.109 570.985 396.852 570.985V570.989ZM283.134 463.99L191.486 411.211C165.094 395.854 147.343 363.229 147.343 331.562C147.343 294.616 169.415 261.509 203.48 247.593V356.991C203.48 363.71 206.361 368.508 212.117 371.866L332.074 441.437L292.729 463.99C289.372 465.907 286.491 465.907 283.134 463.99ZM277.859 542.68C223.639 542.68 183.813 501.895 183.813 451.514C183.813 447.675 184.294 443.836 184.771 439.997L279.295 494.698C285.051 498.056 290.812 498.056 296.568 494.698L417.002 425.127V470.71C417.002 474.549 415.562 477.429 412.204 479.346L320.557 532.126C308.081 539.323 293.206 542.68 277.854 542.68H277.859ZM396.852 599.776C454.911 599.776 503.37 558.513 514.41 503.812C568.149 489.896 602.696 439.515 602.696 388.176C602.696 354.587 588.303 321.962 562.392 298.45C564.791 288.373 566.231 278.296 566.231 268.224C566.231 199.611 510.571 148.267 446.274 148.267C433.322 148.267 420.846 150.184 408.37 154.505C386.775 133.392 357.026 119.958 324.4 119.958C266.342 119.958 217.883 161.22 206.843 215.921C153.104 229.837 118.557 280.218 118.557 331.557C118.557 365.146 132.95 397.771 158.861 421.283C156.462 431.36 155.022 441.437 155.022 451.51C155.022 520.123 210.682 571.466 274.978 571.466C287.931 571.466 300.407 569.549 312.883 565.228C334.473 586.341 364.222 599.776 396.852 599.776Z" fill="currentColor"/>
        </g>
        <defs>
          <clipPath id="clip0_chatgpt">
            <rect width="720" height="720" fill="white" transform="translate(0.607 0.1)"/>
          </clipPath>
        </defs>
      </svg>`,
      claude: `<svg viewBox="0 0 250 251" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M49.0541 166.749L98.2432 139.166L99.0541 136.75L98.2432 135.405H95.8108L87.5676 134.903L59.4595 134.151L35.1351 133.148L11.4865 131.894L5.54054 130.64L0 123.243L0.540541 119.607L5.54054 116.222L12.7027 116.849L28.5135 117.977L52.2973 119.607L69.4595 120.61L95 123.243H99.0541L99.5946 121.613L98.2432 120.61L97.1622 119.607L72.5676 102.932L45.9459 85.3796L32.027 75.2242L24.5946 70.0837L20.8108 65.3195L19.1892 54.7879L25.9459 47.2653L35.1351 47.8922L37.4324 48.5191L46.7568 55.6655L66.6216 71.0868L92.5676 90.1439L96.3514 93.2783L97.875 92.25L98.1081 91.5231L96.3514 88.6394L82.2973 63.1881L67.2973 37.2352L60.5405 26.4529L58.7838 20.0587C58.1033 17.3753 57.7027 15.1553 57.7027 12.4107L65.4054 1.87914L69.7297 0.5L80.1351 1.87914L84.4595 5.64042L90.9459 20.4348L101.351 43.6294L117.568 75.2242L122.297 84.6274L124.865 93.2783L125.811 95.9112H127.432V94.4067L128.784 76.6033L131.216 54.7879L133.649 26.7036L134.459 18.8049L138.378 9.27633L146.216 4.13591L152.297 7.01956L157.297 14.166L156.622 18.8049L153.649 38.1128L147.838 68.3285L144.054 88.6394H146.216L148.784 86.0065L159.054 72.4659L176.216 50.9012L183.784 42.3756L192.703 32.9724L198.378 28.4589H209.189L217.027 40.2442L213.514 52.4057L202.432 66.4478L193.243 78.3586L180.068 96.011L171.892 110.204L172.625 111.375L174.595 111.207L204.324 104.813L220.405 101.929L239.595 98.6695L248.243 102.682L249.189 106.819L245.811 115.219L225.27 120.234L201.216 125.124L165.397 133.556L165 133.875L165.468 134.569L181.622 136.032L188.514 136.408H205.405L236.892 138.79L245.135 144.181L250 150.826L249.189 155.966L236.486 162.361L219.459 158.349L179.595 148.82L165.946 145.435H164.054V146.563L175.405 157.722L196.351 176.528L222.432 200.851L223.784 206.869L220.405 211.633L216.892 211.132L193.919 193.83L185 186.057L165 169.131H163.649V170.886L168.243 177.656L192.703 214.392L193.919 225.676L192.162 229.311L185.811 231.568L178.919 230.314L164.459 210.129L149.73 187.561L137.838 167.25L136.402 168.157L129.324 243.73L126.081 247.616L118.514 250.5L112.162 245.736L108.784 237.962L112.162 222.541L116.216 202.481L119.459 186.558L122.432 166.749L124.248 160.131L124.088 159.688L122.637 159.932L107.703 180.415L85 211.132L67.027 230.314L62.7027 232.07L55.2703 228.183L55.9459 221.287L60.1351 215.144L85 183.549L100 163.865L109.668 152.566L109.573 150.932L109.04 150.886L42.973 193.955L31.2162 195.46L26.0811 190.696L26.7568 182.922L29.1892 180.415L49.0541 166.749Z" fill="currentColor"/>
      </svg>`,
      download: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3V13M10 13L14 9M10 13L6 9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 15V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V15" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
      cursor: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3L17 10L10 12L8 17L3 3Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      vscode: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 3L6 10L3 7L14 3Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 17L6 10L3 13L14 17Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 3V17" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
    };
    return icons[iconName] || icons.document;
  }

  /**
   * Render dropdown options
   */
  function renderOptions(): void {
    const options = buildOptions();
    dropdownMenu.innerHTML = '';

    options.forEach((option) => {
      const optionEl = document.createElement(option.href ? 'a' : 'button');
      optionEl.classList.add('format-selector__option');
      optionEl.setAttribute('data-option', option.dataAttribute);

      if (option.href) {
        (optionEl as HTMLAnchorElement).href = option.href;
        if (option.target) {
          (optionEl as HTMLAnchorElement).target = option.target;
          (optionEl as HTMLAnchorElement).rel = 'noopener noreferrer';
        }
      }

      optionEl.innerHTML = `
        <span class="format-selector__icon">
          ${getIconSVG(option.icon)}
        </span>
        <span class="format-selector__label-group">
          <span class="format-selector__label">
            ${option.label}
            ${option.external ? '<span class="format-selector__external">↗</span>' : ''}
          </span>
          <span class="format-selector__sublabel">${option.sublabel}</span>
        </span>
      `;

      optionEl.addEventListener('click', (e) => {
        if (!option.href) {
          e.preventDefault();
          option.action();
        }
      });

      dropdownMenu.appendChild(optionEl);
    });
  }

  /**
   * Position dropdown relative to button using fixed positioning
   */
  function positionDropdown(): void {
    const buttonRect = button.getBoundingClientRect();

    // Always position dropdown below button with 8px gap
    dropdownMenu.style.top = `${buttonRect.bottom + 8}px`;

    // Align dropdown to right edge of button
    dropdownMenu.style.left = `${buttonRect.right - dropdownMenu.offsetWidth}px`;
  }

  /**
   * Open dropdown
   */
  function openDropdown(): void {
    isOpen = true;
    dropdownMenu.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');

    // Position dropdown relative to button
    positionDropdown();

    // Add click outside listener
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
  }

  /**
   * Close dropdown
   */
  function closeDropdown(): void {
    isOpen = false;
    dropdownMenu.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', handleClickOutside);
  }

  /**
   * Toggle dropdown
   */
  function toggleDropdown(): void {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  /**
   * Handle click outside dropdown
   */
  function handleClickOutside(event: Event): void {
    if (!component.contains(event.target as Node)) {
      closeDropdown();
    }
  }

  /**
   * Handle button click
   */
  function handleButtonClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    toggleDropdown();
  }

  /**
   * Handle escape key
   */
  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && isOpen) {
      closeDropdown();
      button.focus();
    }
  }

  /**
   * Initialize component
   */
  function init(): void {
    // Initialize config
    initConfig();

    // Render options
    renderOptions();

    // Add event listeners
    button.addEventListener('click', handleButtonClick);
    document.addEventListener('keydown', handleKeyDown);

    // Set initial ARIA attributes
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-haspopup', 'true');
    dropdownMenu.setAttribute('role', 'menu');
  }

  // Initialize on load
  init();

  // Expose for debugging
  return {
    get config() {
      return config;
    },
    openDropdown,
    closeDropdown,
    renderOptions,
  };
}
