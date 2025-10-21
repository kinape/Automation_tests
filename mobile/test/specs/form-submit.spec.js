describe('ApiDemos - Formulário', () => {
    it('deve preencher e enviar o formulário de entrada de texto', async () => {
        // Abre a seção "App"
        const appItem = await $('~App');
        await appItem.waitForDisplayed({ timeout: 60000 });
        await appItem.click();

        // Abre "Alert Dialogs"
        let alertDialogsItem = await $('~Alert Dialogs');
        if (!(await alertDialogsItem.isDisplayed().catch(() => false))) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Alert Dialogs")');
            alertDialogsItem = await $('~Alert Dialogs');
        }
        await alertDialogsItem.click();

        // Abre o diálogo de entrada de texto (formulário)
        let textEntryItem = await $('~Text Entry dialog');
        if (!(await textEntryItem.isDisplayed().catch(() => false))) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Text Entry dialog")');
            textEntryItem = await $('~Text Entry dialog');
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

