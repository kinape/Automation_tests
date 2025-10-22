describe('ApiDemos - Formulário', () => {
    it('deve preencher e enviar o formulário de entrada de texto', async () => {
        // Aguarda a tela inicial do API Demos
        const title = await $("//android.widget.TextView[@text='API Demos']");
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

