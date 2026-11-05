import process from 'node:process';
import { defineConfig, devices } from '@playwright/test';

const hugoPort = 1315;
const hugoServerCommand = [
  'npx hugo server --environment testing',
  `--port ${hugoPort} --noHTTPCache --disableFastRender`,
].join(' ');
const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

export default defineConfig({
  testDir: 'playwright/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  expect: { timeout: 10000 },
  use: {
    baseURL: `http://localhost:${hugoPort}`,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: hugoServerCommand,
    url: `http://localhost:${hugoPort}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 300000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: chromiumExecutablePath
          ? { executablePath: chromiumExecutablePath }
          : {},
      },
    },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
