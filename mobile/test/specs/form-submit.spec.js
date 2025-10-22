describe('ApiDemos - Formulário', () => {
    async function ensureAppReady() {
        // Aguarda elementos-chave da tela inicial ou força abrir a Activity principal
        const ready = await browser.waitUntil(async () => {
            const titles = await $$("//android.widget.TextView[@text='API Demos']");
            if (titles.length > 0) return true;
            const appItem = await $('~App').catch(() => undefined);
            if (appItem && await appItem.isDisplayed().catch(() => false)) return true;
            const viewsItem = await $('~Views').catch(() => undefined);
            if (viewsItem && await viewsItem.isDisplayed().catch(() => false)) return true;
            return false;
        }, { timeout: 30000, interval: 500 }).catch(() => false);

        if (!ready) {
            // Tenta trazer o aplicativo para o primeiro plano explicitamente
            try {
                await driver.startActivity('io.appium.android.apis', 'io.appium.android.apis.ApiDemos');
            } catch (e) {
                try {
                    await driver.execute('mobile: startActivity', { appPackage: 'io.appium.android.apis', appActivity: 'io.appium.android.apis.ApiDemos' });
                } catch (_) { /* noop */ }
            }
            await browser.pause(2000);
        }
    }

    it('deve preencher e enviar o formulário de entrada de texto', async () => {
        // Aguarda a tela inicial do API Demos
                const title = await $('~API Demos');
        await title.waitForDisplayed({ timeout: 60000 });

        // Abre a seção "App" com fallback para texto + rolagem
        let appItem = await $('~App').catch(() => undefined);
        if (!appItem || !(await appItem.isDisplayed().catch(() => false))) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("App")');
            appItem = await $("android=new UiSelector().text(\"App\")");
        }
        await appItem.waitForDisplayed({ timeout: 30000 });
        await appItem.click();

        // Abre "Alert Dialogs"
        let alertDialogsItem = await $('~Alert Dialogs').catch(() => undefined);
        if (!alertDialogsItem || !(await alertDialogsItem.isDisplayed().catch(() => false))) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Alert Dialogs")');
            alertDialogsItem = await $("android=new UiSelector().text(\"Alert Dialogs\")");
        }
        await alertDialogsItem.click();

        // Abre o diálogo de entrada de texto (formulário)
        let textEntryItem = await $('~Text Entry dialog').catch(() => undefined);
        if (!textEntryItem || !(await textEntryItem.isDisplayed().catch(() => false))) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Text Entry dialog")');
            textEntryItem = await $("android=new UiSelector().text(\"Text Entry dialog\")");
        }
        await textEntryItem.click();

        // Preenche os campos do formulário
        const usernameField = await $("id:io.appium.android.apis:id/username_edit");
        const passwordField = await $("id:io.appium.android.apis:id/password_edit");
        await usernameField.waitForDisplayed({ timeout: 20000 });
        await usernameField.setValue('usuario.teste');
        await passwordField.setValue('Senha@123');

        // Envia (OK)
        const okButton = await $("id:android:id/button1");
        await okButton.click();

        // Valida que o diálogo foi fechado (OK/Cancel não devem mais estar visíveis)
        await browser.waitUntil(async () => !(await okButton.isDisplayed().catch(() => false)), {
            timeout: 20000,
            timeoutMsg: 'O diálogo de formulário não foi fechado após enviar.'
        });

        // Verifica que ainda estamos na tela de "Alert Dialogs"
        const screenTitle = await $("//android.widget.TextView[@text='App/Alert Dialogs']");
        expect(await screenTitle.isDisplayed()).toBe(true);
    });
});
