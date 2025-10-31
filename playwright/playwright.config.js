// Configuração do Playwright emulando um dispositivo móvel
// Executa testes em `playwright/tests` usando o perfil de device Pixel 5
const { devices } = require('@playwright/test');

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  // Note: resolved relative to this config file directory
  testDir: 'tests',
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  // Relatório HTML sempre gerado em `playwright-report`
  reporter: process.env.CI ? [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]] : [['html', { outputFolder: 'playwright-report' }]],
  use: {
    // Base opcional para testes que navegam em app/web real
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Mobile Chrome (Pixel 5)',
      use: { ...devices['Pixel 5'] },
    },
  ],
};

module.exports = config;
