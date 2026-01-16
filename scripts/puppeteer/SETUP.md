# Puppeteer Setup Guide

Quick setup guide for AI agents using Puppeteer with docs-v2.

## Installation

### Option 1: Use System Chrome (Recommended for network-restricted environments)

```bash
# Install Puppeteer without downloading Chrome
PUPPETEER_SKIP_DOWNLOAD=true yarn install
```

Then use the `--chrome` flag to point to your system Chrome:

```bash
yarn debug:browser /influxdb3/core/ --chrome "/usr/bin/google-chrome"
```

**Find your Chrome path:**

```bash
# macOS
which google-chrome-stable
# Usually: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome

# Linux
which google-chrome
# Usually: /usr/bin/google-chrome or /usr/bin/chromium

# Windows (PowerShell)
Get-Command chrome
# Usually: C:\Program Files\Google\Chrome\Application\chrome.exe
```

### Option 2: Install Puppeteer's Bundled Chrome (Requires network access)

```bash
# Regular installation (downloads Chrome)
yarn install

# Or install Puppeteer browser separately
npx puppeteer browsers install chrome
```

## Verification

### Step 1: Check dependencies

```bash
# Check if Puppeteer is in package.json
grep puppeteer package.json
```

Should show:
```
"puppeteer": "^23.11.1",
```

### Step 2: Start Hugo server

```bash
# Start Hugo development server
npx hugo server
```

Should show:
```
Web Server is available at http://localhost:1313/
```

### Step 3: Test Puppeteer

```bash
# Test screenshot tool
yarn debug:screenshot / --output test-screenshot.png
```

If successful, you'll see:
```
📸 Screenshot Utility
=====================

URL: http://localhost:1313/
Viewport: 1280x720
Output: test-screenshot.png

Navigating to: http://localhost:1313/
✓ Page loaded successfully
✓ Screenshot saved: test-screenshot.png

✓ Screenshot captured successfully
```

### Step 4: Verify screenshot was created

```bash
ls -lh test-screenshot.png
```

Should show a PNG file (typically 100-500KB).

## Troubleshooting

### Issue: "Failed to launch browser"

**Error message:**
```
Failed to launch browser: Could not find Chrome
```

**Solution:** Use system Chrome with `--chrome` flag:

```bash
# Find Chrome path
which google-chrome

# Use with Puppeteer
yarn debug:browser / --chrome "$(which google-chrome)"
```

### Issue: "Failed to navigate to http://localhost:1313"

**Error message:**
```
Failed to navigate to http://localhost:1313/: net::ERR_CONNECTION_REFUSED
```

**Solution:** Start Hugo server:

```bash
npx hugo server
```

### Issue: "PUPPETEER_SKIP_DOWNLOAD not working"

**Error message:**
```
ERROR: Failed to set up chrome-headless-shell
```

**Solution:** Set environment variable before yarn command:

```bash
# Correct
PUPPETEER_SKIP_DOWNLOAD=true yarn install

# Won't work
yarn install PUPPETEER_SKIP_DOWNLOAD=true
```

### Issue: "Command not found: yarn"

**Solution:** Install Yarn or use npm:

```bash
# Install Yarn
npm install -g yarn

# Or use npm instead
npm run debug:screenshot -- / --output test.png
```

## Quick Test Script

Save this as `test-puppeteer-setup.js` and run with `node test-puppeteer-setup.js`:

```javascript
#!/usr/bin/env node

/**
 * Quick test to verify Puppeteer setup
 */

import { launchBrowser, navigateToPage, takeScreenshot } from './utils/puppeteer-helpers.js';

async function test() {
  console.log('\n🧪 Testing Puppeteer Setup\n');

  let browser;
  try {
    // 1. Launch browser
    console.log('1. Launching browser...');
    browser = await launchBrowser({ headless: true });
    console.log('   ✓ Browser launched\n');

    // 2. Navigate to home page
    console.log('2. Navigating to home page...');
    const page = await navigateToPage(browser, '/');
    console.log('   ✓ Page loaded\n');

    // 3. Take screenshot
    console.log('3. Taking screenshot...');
    await takeScreenshot(page, 'test-screenshot.png');
    console.log('   ✓ Screenshot saved\n');

    // 4. Get page title
    console.log('4. Getting page title...');
    const title = await page.title();
    console.log(`   ✓ Title: "${title}"\n`);

    console.log('✅ All tests passed!\n');
    console.log('Puppeteer is set up correctly and ready to use.\n');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nSee SETUP.md for troubleshooting steps.\n');
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

test();
```

Run the test:

```bash
cd scripts/puppeteer
node test-puppeteer-setup.js
```

## Environment Variables

You can set these environment variables to customize Puppeteer behavior:

```bash
# Skip downloading Puppeteer's bundled Chrome
export PUPPETEER_SKIP_DOWNLOAD=true

# Use custom Chrome path
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Disable headless mode by default
export PUPPETEER_HEADLESS=false
```

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.) to make permanent.

## Next Steps

Once setup is verified:

1. **Read the main README**: [README.md](README.md)
2. **Try the debugging tools**:
   ```bash
   yarn debug:inspect /influxdb3/core/
   yarn debug:screenshot /influxdb3/core/ --full-page
   yarn debug:browser /influxdb3/core/ --devtools
   ```
3. **Create custom scripts** using the helper functions
4. **Integrate into your workflow** for testing and debugging

## Getting Help

- **Main documentation**: [README.md](README.md)
- **Helper functions**: [utils/puppeteer-helpers.js](utils/puppeteer-helpers.js)
- **Puppeteer docs**: https://pptr.dev/
- **Report issues**: Create a GitHub issue in docs-v2
