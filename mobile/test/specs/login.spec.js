describe('ApiDemos - Smoke', () => {
    it('deve abrir o app e navegar para Views', async () => {
        // Use seletor por texto (UiSelector) para estabilidade no CI
        const viewsTextSelector = 'android=new UiSelector().text("Views")';

        // Garante que "Views" esteja visível (faz scroll se necessário)
        let viewsItem = await $(viewsTextSelector);
        if (!(await viewsItem.isDisplayed().catch(() => false))) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Views")');
            viewsItem = await $(viewsTextSelector);
        }

        await viewsItem.waitForDisplayed({ timeout: 90000 });
        await viewsItem.click();

        // Verifica que "Buttons" aparece dentro de Views
        const buttonsTextSelector = 'android=new UiSelector().text("Buttons")';
        const buttonsItem = await $(buttonsTextSelector);
        await buttonsItem.waitForDisplayed({ timeout: 60000 });
        expect(await buttonsItem.isDisplayed()).toBe(true);
    });
});

