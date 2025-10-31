const { test, expect } = require('@playwright/test');

test.describe('Playwright - Smoke (emulação móvel)', () => {
  test('deve abrir página e navegar para Views', async ({ page }) => {
    // Página offline simples via data URL para simular o fluxo do app
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>API Demos</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 16px; }
            .item { padding: 12px 16px; border-bottom: 1px solid #ddd; }
            .hidden { display: none; }
          </style>
        </head>
        <body>
          <h1>API Demos</h1>
          <div id="list">
            <div class="item" id="views">Views</div>
          </div>
          <div id="views-screen" class="hidden">
            <div class="item" id="buttons">Buttons</div>
          </div>
          <script>
            document.getElementById('views').addEventListener('click', () => {
              document.getElementById('list').classList.add('hidden');
              document.getElementById('views-screen').classList.remove('hidden');
            });
          </script>
        </body>
      </html>`;

    await page.goto('data:text/html,' + encodeURIComponent(html));

    await expect(page.getByRole('heading', { name: 'API Demos' })).toBeVisible();

    const views = page.locator('#views');
    await expect(views).toBeVisible();
    await views.click();

    await expect(page.locator('#buttons')).toBeVisible();
  });
});
