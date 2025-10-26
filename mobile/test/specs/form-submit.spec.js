describe('ApiDemos - Formulário', () => {
    it('deve preencher e enviar o formulário de entrada de texto', async () => {
        const mainTitle = await $('android=new UiSelector().text("API Demos")');
        await mainTitle.waitForDisplayed({ timeout: 300000 });

        // Abre a seção "App"
        const appTextSelector = 'android=new UiSelector().text("App")';
        let appItem = await $(appTextSelector);
        if (!(await appItem.isDisplayed().catch(() => false))) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("App")');
            appItem = await $(appTextSelector);
        }
        await appItem.waitForDisplayed({ timeout: 60000 });
        await appItem.click();

        // Abre "Alert Dialogs"
        const alertDialogsTextSelector = 'android=new UiSelector().text("Alert Dialogs")';
        let alertDialogsItem = await $(alertDialogsTextSelector);
        if (!(await alertDialogsItem.isDisplayed().catch(() => false))) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Alert Dialogs")');
            alertDialogsItem = await $(alertDialogsTextSelector);
        }
        await alertDialogsItem.click();

        // Abre o diálogo de entrada de texto (formulário)
        const textEntryTextSelector = 'android=new UiSelector().text("Text Entry dialog")';
        let textEntryItem = await $(textEntryTextSelector);
        if (!(await textEntryItem.isDisplayed().catch(() => false))) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Text Entry dialog")');
            textEntryItem = await $(textEntryTextSelector);
        }
        await textEntryItem.click();

        // Preenche os campos do formulário
        const usernameField = await $("id:io.appium.android.apis:id/username_edit");
        const passwordField = await $("id:io.appium.android.apis:id/password_edit");
        await usernameField.waitForDisplayed({ timeout: 20000 });
        await usernameField.setValue('rogerio.teste');
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

