# Puppeteer Integration for AI Agent Development

This directory contains Puppeteer utilities designed to help AI agents (like Claude) test and debug the InfluxData documentation site during development.

## Purpose

Puppeteer enables AI agents to:

- **See what's happening** - Take screenshots to visually inspect pages
- **Debug interactively** - Launch a browser to manually test features
- **Gather context** - Inspect page metadata, performance, errors, and structure
- **Test components** - Verify JavaScript components are working correctly
- **Validate content** - Check for shortcode remnants, broken links, and accessibility issues

## Installation

### Step 1: Install dependencies

Due to network restrictions, install Puppeteer without downloading the browser binary:

```bash
PUPPETEER_SKIP_DOWNLOAD=true yarn install
```

### Step 2: Configure Chrome path (if needed)

If you're using system Chrome instead of Puppeteer's bundled browser, set the path in your scripts:

**Common Chrome paths:**

- macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- Linux: `/usr/bin/google-chrome`
- Windows: `C:\Program Files\Google\Chrome\Application\chrome.exe`

You can pass the Chrome path using the `--chrome` flag:

```bash
yarn debug:browser /influxdb3/core/ --chrome "/usr/bin/google-chrome"
```

### Step 3: Start Hugo server

Before using Puppeteer tools, make sure the Hugo development server is running:

```bash
npx hugo server
```

The server should be accessible at `http://localhost:1313`.

## Quick Start for AI Agents

### Common Debugging Workflow

When a user reports an issue or you need to debug something:

1. **Start Hugo server** (if not already running)
   ```bash
   npx hugo server
   ```

2. **Inspect the page** to gather information
   ```bash
   yarn debug:inspect /influxdb3/core/get-started/
   ```

3. **Take a screenshot** to see visual issues
   ```bash
   yarn debug:screenshot /influxdb3/core/get-started/ --full-page
   ```

4. **Open browser interactively** if you need to test manually
   ```bash
   yarn debug:browser /influxdb3/core/get-started/ --devtools
   ```

## Available Tools

### 1. Page Inspector (`yarn debug:inspect`)

Gather comprehensive information about a page:

```bash
yarn debug:inspect <url-path> [options]
```

**What it reports:**

- Page metadata (title, description, language)
- Performance metrics (load time, FCP, etc.)
- Console errors and warnings
- Links analysis (internal/external counts)
- Detected components (`data-component` attributes)
- Shortcode remnants (Hugo shortcodes that didn't render)
- Basic accessibility checks
- Content structure (headings, code blocks)

**Examples:**

```bash
# Inspect a page
yarn debug:inspect /influxdb3/core/

# Save report to JSON
yarn debug:inspect /influxdb3/core/ --output report.json

# Also capture a screenshot
yarn debug:inspect /influxdb3/core/ --screenshot
```

**Use cases:**

- User reports a page isn't loading correctly
- Need to check if a page has JavaScript errors
- Want to verify shortcodes are rendering properly
- Need performance metrics for optimization

### 2. Screenshot Tool (`yarn debug:screenshot`)

Capture screenshots of pages or specific elements:

```bash
yarn debug:screenshot <url-path> [options]
```

**Options:**

- `--output PATH` - Save to specific file
- `--full-page` - Capture entire scrollable page
- `--selector CSS` - Capture specific element
- `--viewport WxH` - Set viewport size (e.g., `375x667` for mobile)

**Examples:**

```bash
# Basic screenshot
yarn debug:screenshot /influxdb3/core/

# Full page screenshot
yarn debug:screenshot /influxdb3/core/ --full-page

# Screenshot of specific element
yarn debug:screenshot /influxdb3/core/ --selector .article--content

# Mobile viewport screenshot
yarn debug:screenshot /influxdb3/core/ --viewport 375x667

# Custom output path
yarn debug:screenshot /influxdb3/core/ --output debug/home-page.png
```

**Use cases:**

- User reports visual issue ("the button is cut off")
- Need to see how page looks at different viewport sizes
- Want to capture a specific component for documentation
- Need before/after images for PR review

### 3. Interactive Browser (`yarn debug:browser`)

Launch a browser window for manual testing:

```bash
yarn debug:browser <url-path> [options]
```

**Options:**

- `--devtools` - Open Chrome DevTools automatically
- `--slow-mo NUM` - Slow down actions by NUM milliseconds
- `--viewport WxH` - Set viewport size
- `--base-url URL` - Use different base URL

**Examples:**

```bash
# Open page in browser
yarn debug:browser /influxdb3/core/

# Open with DevTools
yarn debug:browser /influxdb3/core/ --devtools

# Slow down for debugging
yarn debug:browser /influxdb3/core/ --slow-mo 500

# Mobile viewport
yarn debug:browser /influxdb3/core/ --viewport 375x667
```

**Use cases:**

- Need to manually click through a workflow
- Want to use Chrome DevTools to debug JavaScript
- Testing responsive design breakpoints
- Verifying interactive component behavior

## Programmatic Usage

AI agents can also use the helper functions directly in custom scripts:

```javascript
import {
  launchBrowser,
  navigateToPage,
  takeScreenshot,
  getPageMetrics,
  elementExists,
  getElementText,
  clickAndNavigate,
  testComponent,
} from './utils/puppeteer-helpers.js';

// Launch browser
const browser = await launchBrowser({ headless: true });

// Navigate to page
const page = await navigateToPage(browser, '/influxdb3/core/');

// Check if element exists
const hasFormatSelector = await elementExists(page, '[data-component="format-selector"]');
console.log('Format selector present:', hasFormatSelector);

// Get text content
const title = await getElementText(page, 'h1');
console.log('Page title:', title);

// Take screenshot
await takeScreenshot(page, 'debug.png');

// Get performance metrics
const metrics = await getPageMetrics(page);
console.log('Load time:', metrics.performance.loadComplete);

// Close browser
await browser.close();
```

## Common Scenarios

### Scenario 1: User reports "shortcodes are showing as raw text"

```bash
# Inspect the page for shortcode remnants
yarn debug:inspect /path/to/page/

# Take a screenshot to see the issue
yarn debug:screenshot /path/to/page/ --full-page --output shortcode-issue.png
```

**What to look for in the report:**

- `shortcodeRemnants` section will show any `{{<` or `{{%` patterns
- Screenshot will show visual rendering

### Scenario 2: User reports "page is loading slowly"

```bash
# Inspect page for performance metrics
yarn debug:inspect /path/to/page/ --output performance-report.json

# Check the report for:
# - performance.performance.loadComplete (should be < 3000ms)
# - performance.performance.firstContentfulPaint (should be < 1500ms)
```

### Scenario 3: User reports "JavaScript error in console"

```bash
# Inspect page for console errors
yarn debug:inspect /path/to/page/

# Open browser with DevTools to see detailed error
yarn debug:browser /path/to/page/ --devtools
```

**What to look for:**

- `errors` section in inspection report
- Red error messages in DevTools console
- Stack traces showing which file/line caused the error

### Scenario 4: User reports "component not working on mobile"

```bash
# Take screenshot at mobile viewport
yarn debug:screenshot /path/to/page/ --viewport 375x667 --output mobile-view.png

# Open browser at mobile viewport for testing
yarn debug:browser /path/to/page/ --viewport 375x667 --devtools
```

### Scenario 5: Testing a Hugo shortcode implementation

```bash
# 1. Inspect test page for components
yarn debug:inspect /example/ --screenshot

# 2. Take screenshots of different states
yarn debug:screenshot /example/ --selector '[data-component="tabs-wrapper"]'

# 3. Open browser to test interactivity
yarn debug:browser /example/ --devtools
```

### Scenario 6: Validating responsive design

```javascript
// Create a custom script: test-responsive.js
import { launchBrowser, navigateToPage, takeScreenshot, testResponsive } from './utils/puppeteer-helpers.js';

const browser = await launchBrowser();
const page = await navigateToPage(browser, '/influxdb3/core/');

const viewports = [
  { width: 375, height: 667, name: 'iPhone SE' },
  { width: 768, height: 1024, name: 'iPad' },
  { width: 1280, height: 720, name: 'Desktop' },
  { width: 1920, height: 1080, name: 'Desktop HD' },
];

const results = await testResponsive(page, viewports, async (page, viewport) => {
  await takeScreenshot(page, `responsive-${viewport.name}.png`);
  const hasNav = await elementExists(page, '[data-component="mobile-nav"]');
  return { hasNav };
});

console.log('Responsive test results:', results);
await browser.close();
```

```bash
node scripts/puppeteer/test-responsive.js
```

## Helper Functions Reference

See `utils/puppeteer-helpers.js` for complete documentation. Key functions:

### Browser & Navigation

- `launchBrowser(options)` - Launch browser instance
- `navigateToPage(browser, urlPath, options)` - Navigate to page
- `clickAndNavigate(page, selector)` - Click and wait for navigation

### Elements

- `elementExists(page, selector)` - Check if element exists
- `waitForElement(page, selector, timeout)` - Wait for element
- `getElementText(page, selector)` - Get element text content
- `getComputedStyles(page, selector, properties)` - Get CSS styles

### Screenshots & Visual

- `takeScreenshot(page, path, options)` - Capture screenshot
- `compareScreenshots(baseline, current, diff)` - Compare images
- `testResponsive(page, viewports, testFn)` - Test at different sizes

### Analysis

- `getPageMetrics(page)` - Get performance metrics
- `getPageLinks(page)` - Get all links on page
- `captureConsoleLogs(page)` - Capture console output
- `debugPage(page, name)` - Save HTML + screenshot for debugging

### Testing

- `testComponent(page, selector, testFn)` - Test component behavior

## Troubleshooting

### Error: "Failed to launch browser"

**Problem:** Puppeteer can't find Chrome executable

**Solutions:**

1. **Use system Chrome:**
   ```bash
   yarn debug:browser /path/ --chrome "/usr/bin/google-chrome"
   ```

2. **Install Puppeteer browser:**
   ```bash
   npx puppeteer browsers install chrome
   ```

3. **Check common Chrome paths:**
   - macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
   - Linux: `/usr/bin/google-chrome` or `/usr/bin/chromium`
   - Windows: `C:\Program Files\Google\Chrome\Application\chrome.exe`

### Error: "Failed to navigate to <http://localhost:1313>"

**Problem:** Hugo server is not running

**Solution:**

```bash
# In a separate terminal
npx hugo server
```

### Error: "Element not found: .selector"

**Problem:** Element doesn't exist on page or page hasn't finished loading

**Solutions:**

1. **Wait for element:**
   ```javascript
   await waitForElement(page, '.selector', 10000); // 10 second timeout
   ```

2. **Check if element exists first:**
   ```javascript
   if (await elementExists(page, '.selector')) {
     // Element exists, safe to interact
   }
   ```

3. **Take screenshot to debug:**
   ```bash
   yarn debug:screenshot /path/ --output debug.png
   ```

### Network restrictions blocking browser download

**Problem:** Cannot download Puppeteer's bundled Chrome due to network restrictions

**Solution:**

```bash
# Install without browser binary
PUPPETEER_SKIP_DOWNLOAD=true yarn install

# Use system Chrome with --chrome flag
yarn debug:browser /path/ --chrome "/usr/bin/google-chrome"
```

## Best Practices for AI Agents

### 1. Always check if Hugo server is running first

```bash
# Check if server is responding
curl -s -o /dev/null -w "%{http_code}" http://localhost:1313/
```

If it returns `000` or connection refused, start Hugo:

```bash
npx hugo server
```

### 2. Use inspection before screenshots

Inspection is faster and provides more context:

```bash
# First, inspect to understand the issue
yarn debug:inspect /path/

# Then take targeted screenshots if needed
yarn debug:screenshot /path/ --selector .problem-component
```

### 3. Prefer headless for automated checks

Headless mode is faster and doesn't require display:

```javascript
const browser = await launchBrowser({ headless: true });
```

Only use non-headless (`headless: false`) when you need to visually debug.

### 4. Clean up resources

Always close the browser when done:

```javascript
try {
  const browser = await launchBrowser();
  const page = await navigateToPage(browser, '/path/');
  // ... do work
} finally {
  await browser.close();
}
```

### 5. Use meaningful screenshot names

```bash
# Bad
yarn debug:screenshot /path/ --output screenshot.png

# Good
yarn debug:screenshot /influxdb3/core/ --output debug/influxdb3-core-home-issue-123.png
```

### 6. Capture full context for bug reports

When a user reports an issue, gather comprehensive context:

```bash
# 1. Inspection report
yarn debug:inspect /path/to/issue/ --output reports/issue-123-inspect.json --screenshot

# 2. Full page screenshot
yarn debug:screenshot /path/to/issue/ --full-page --output reports/issue-123-full.png

# 3. Element screenshot if specific
yarn debug:screenshot /path/to/issue/ --selector .problem-area --output reports/issue-123-element.png
```

## Integration with Development Workflow

### Use in PR Reviews

```bash
# Before changes
yarn debug:screenshot /path/ --output before.png

# Make changes to code

# After changes (restart Hugo if needed)
yarn debug:screenshot /path/ --output after.png

# Compare visually
```

### Use for Component Development

When developing a new component:

```bash
# 1. Open browser to test interactively
yarn debug:browser /example/ --devtools

# 2. Inspect for errors and components
yarn debug:inspect /example/

# 3. Take screenshots for documentation
yarn debug:screenshot /example/ --selector '[data-component="new-component"]'
```

### Use for Regression Testing

```bash
# Create baseline screenshots
yarn debug:screenshot /influxdb3/core/ --output baselines/core-home.png
yarn debug:screenshot /influxdb3/core/get-started/ --output baselines/core-get-started.png

# After changes, compare
yarn debug:screenshot /influxdb3/core/ --output current/core-home.png

# Visual comparison (manual for now, can be automated with pixelmatch)
```

## Next Steps

1. **Install dependencies** when you have network access:
   ```bash
   PUPPETEER_SKIP_DOWNLOAD=true yarn install
   ```

2. **Configure Chrome path** if needed (see [Troubleshooting](#troubleshooting))

3. **Test the setup** with a simple example:
   ```bash
   npx hugo server  # In one terminal
   yarn debug:screenshot /  # In another terminal
   ```

4. **Start using for development** - See [Common Scenarios](#common-scenarios)

## Related Documentation

- [Puppeteer API Documentation](https://pptr.dev/)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
- [Hugo Documentation](https://gohugo.io/documentation/)
- [Testing Guide](../../DOCS-TESTING.md)
- [Contributing Guide](../../DOCS-CONTRIBUTING.md)
