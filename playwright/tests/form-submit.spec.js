const { test, expect } = require('@playwright/test');

test.describe('Playwright - Formulário (mobile emulation)', () => {
  test('deve preencher e enviar o formulário de entrada de texto', async ({ page }) => {
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>App/Alert Dialogs</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 16px; }
            .item { padding: 12px 16px; border-bottom: 1px solid #ddd; cursor: pointer; }
            .hidden { display: none; }
            /* Ensure dialog is hidden by default to avoid initial overlay intercept */
            .dialog { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,.3); }
            .dialog.open { display: flex; }
            .panel { background: white; padding: 16px; border-radius: 8px; width: 90%; max-width: 360px; }
            label { display: block; margin: 8px 0 4px; }
            input { width: 100%; padding: 8px; }
            .actions { margin-top: 12px; text-align: right; }
            button { padding: 8px 12px; }
          </style>
        </head>
        <body>
          <h1>App</h1>
          <div id="menu">
            <div class="item" id="app">App</div>
            <div class="item hidden" id="alert-dialogs">Alert Dialogs</div>
            <div class="item hidden" id="text-entry">Text Entry dialog</div>
          </div>

          <div id="dialog" class="dialog" role="dialog" aria-label="Text Entry">
            <div class="panel">
              <h2>Text Entry</h2>
              <label for="username">Username</label>
              <input id="username" />
              <label for="password">Password</label>
              <input id="password" type="password" />
              <div class="actions">
                <button id="ok">OK</button>
                <button id="cancel">Cancel</button>
              </div>
            </div>
          </div>

          <script>
            const app = document.getElementById('app');
            const alertDialogs = document.getElementById('alert-dialogs');
            const textEntry = document.getElementById('text-entry');
            const dialog = document.getElementById('dialog');
            const ok = document.getElementById('ok');
            const cancel = document.getElementById('cancel');

            app.addEventListener('click', () => {
              alertDialogs.classList.remove('hidden');
            });
            alertDialogs.addEventListener('click', () => {
              textEntry.classList.remove('hidden');
            });
            textEntry.addEventListener('click', () => {
              dialog.classList.add('open');
            });
            function closeDialog() { dialog.classList.remove('open'); }
            ok.addEventListener('click', closeDialog);
            cancel.addEventListener('click', closeDialog);
          </script>
        </body>
      </html>`;

    await page.goto('data:text/html,' + encodeURIComponent(html));

    // Aguarda renderização e garante que o diálogo está oculto
    await expect(page.locator('#dialog')).toBeHidden();

    // Abre a seção "App"
    await page.locator('#app').click();
    await page.locator('#alert-dialogs').click();
    await page.locator('#text-entry').click();

    // Preenche o formulário
    const username = page.locator('#username');
    const password = page.locator('#password');
    await username.fill('rogerio.teste');
    await password.fill('Senha@123');

    // Envia (OK) e valida que o diálogo fechou
    await page.locator('#ok').click();
    await expect(page.locator('#dialog')).toBeHidden();

    // Verifica que ainda estamos na tela de "App/Alert Dialogs"
    await expect(page).toHaveTitle(/App\/Alert Dialogs/);
  });
});
