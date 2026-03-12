# Puppeteer Quick Reference

One-page reference for AI agents using Puppeteer with docs-v2.

## Prerequisites

```bash
# 1. Hugo server must be running
npx hugo server

# 2. Packages installed (one-time)
PUPPETEER_SKIP_DOWNLOAD=true yarn install
```

## Common Commands

### Take Screenshot
```bash
yarn debug:screenshot <path>                    # Basic screenshot
yarn debug:screenshot <path> --full-page        # Full scrollable page
yarn debug:screenshot <path> --selector .class  # Specific element
yarn debug:screenshot <path> --viewport 375x667 # Mobile size
```

### Inspect Page
```bash
yarn debug:inspect <path>                       # Full analysis
yarn debug:inspect <path> --output report.json  # Save report
yarn debug:inspect <path> --screenshot          # Include screenshot
```

### Open Browser
```bash
yarn debug:browser <path>                       # Interactive mode
yarn debug:browser <path> --devtools            # With DevTools
yarn debug:browser <path> --slow-mo 500         # Slow motion
```

## Quick Workflows

### User Reports Visual Issue
```bash
yarn debug:screenshot /path/to/page/ --full-page
yarn debug:inspect /path/to/page/
# Review screenshot and inspection report
```

### Testing Component Change
```bash
# Before
yarn debug:screenshot /example/ --output before.png

# Make changes, restart Hugo

# After
yarn debug:screenshot /example/ --output after.png
```

### Debugging JavaScript Error
```bash
yarn debug:inspect /path/          # Check errors section
yarn debug:browser /path/ --devtools  # Debug in browser
```

### Performance Check
```bash
yarn debug:inspect /path/ --output perf.json
# Check perf.json → performance.performance.loadComplete
# Should be < 3000ms
```

### Automated Issue Detection
```bash
node scripts/puppeteer/examples/detect-issues.js /path/
```

## Programmatic Usage

```javascript
import {
  launchBrowser,
  navigateToPage,
  takeScreenshot,
  elementExists,
  getPageMetrics,
} from './utils/puppeteer-helpers.js';

const browser = await launchBrowser();
const page = await navigateToPage(browser, '/influxdb3/core/');

// Check element
const hasComponent = await elementExists(page, '[data-component="format-selector"]');

// Screenshot
await takeScreenshot(page, 'debug.png');

// Performance
const metrics = await getPageMetrics(page);
console.log('Load time:', metrics.performance.loadComplete);

await browser.close();
```

## Common Flags

```bash
--chrome PATH         # Use system Chrome
--base-url URL        # Different base URL
--viewport WxH        # Viewport size
--output PATH         # Output file path
--full-page           # Full page screenshot
--selector CSS        # Element selector
--screenshot          # Include screenshot
--devtools            # Open DevTools
--slow-mo NUM         # Slow down actions
```

## Troubleshooting

### Browser not found
```bash
# Find Chrome
which google-chrome

# Use with flag
yarn debug:browser /path/ --chrome "$(which google-chrome)"
```

### Hugo not running
```bash
# Check if running
curl -s http://localhost:1313/

# Start if needed
npx hugo server
```

### Network restrictions
```bash
# Install without downloading Chrome
PUPPETEER_SKIP_DOWNLOAD=true yarn install
```

## Helper Functions

### Browser & Navigation
- `launchBrowser(options)` - Launch browser
- `navigateToPage(browser, path, options)` - Navigate
- `clickAndNavigate(page, selector)` - Click & wait

### Screenshots
- `takeScreenshot(page, path, options)` - Capture screenshot
- `compareScreenshots(baseline, current, diff)` - Compare images
- `testResponsive(page, viewports, testFn)` - Multi-viewport

### Elements
- `elementExists(page, selector)` - Check exists
- `waitForElement(page, selector, timeout)` - Wait
- `getElementText(page, selector)` - Get text

### Analysis
- `getPageMetrics(page)` - Performance data
- `getPageLinks(page)` - All links
- `getComputedStyles(page, selector)` - CSS values

### Debugging
- `debugPage(page, name)` - Save HTML + screenshot + logs
- `captureConsoleLogs(page)` - Capture console

## What to Check

### Shortcode Remnants
Look for: `{{<`, `{{%`, `{{.`
```bash
yarn debug:inspect /path/
# Check: report.shortcodeRemnants
```

### JavaScript Errors
```bash
yarn debug:inspect /path/
# Check: report.errors
```

### Performance
```bash
yarn debug:inspect /path/
# Check: report.performance.performance.loadComplete < 3000ms
# Check: report.performance.performance.firstContentfulPaint < 1500ms
```

### Accessibility
```bash
yarn debug:inspect /path/
# Check: report.accessibility
# - hasMainLandmark
# - hasH1
# - imagesWithoutAlt
# - linksWithoutText
```

### Components
```bash
yarn debug:inspect /path/
# Check: report.components
# Lists all [data-component] elements
```

## Examples

All in `scripts/puppeteer/examples/`:

- `test-format-selector.js` - Test interactive component
- `detect-issues.js` - Automated issue detection

Run with:
```bash
node scripts/puppeteer/examples/detect-issues.js /path/
```

## Documentation

- **Full Guide**: `scripts/puppeteer/README.md`
- **Setup**: `scripts/puppeteer/SETUP.md`
- **This Reference**: `scripts/puppeteer/QUICK-REFERENCE.md`

## Emergency Debug

When something's broken and you need full context:

```bash
yarn debug:inspect /path/ --output emergency.json --screenshot
yarn debug:screenshot /path/ --full-page --output emergency-full.png
yarn debug:browser /path/ --devtools
```

This gives you:
1. JSON report with all page data
2. Full page screenshot
3. Interactive browser with DevTools

---

**Remember**: Always start Hugo server first! (`npx hugo server`)
