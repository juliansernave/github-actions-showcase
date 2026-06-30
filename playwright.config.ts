import { defineConfig, devices } from '@playwright/test';

const browser = process.env.BROWSER;

export default defineConfig({
  testDir: './tests/e2e',

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/playwright-junit.xml' }],
  ],

  // Auto-start the Express server before tests, stop it after.
  // reuseExistingServer lets you run a local server during development.
  webServer: {
    command: 'node app/src/api.js',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },

  projects: browser
    ? [
        {
          name: browser,
          use: {
            ...devices[
              browser === 'chromium'
                ? 'Desktop Chrome'
                : browser === 'firefox'
                  ? 'Desktop Firefox'
                  : 'Desktop Safari'
            ],
          },
        },
      ]
    : [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
      ],
});
