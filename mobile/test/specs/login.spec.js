describe('ApiDemos - Smoke', () => {
    it('deve abrir o app e navegar para Views', async () => {
        // Verifica que o item "Views" está presente na tela inicial e clica nele
        const viewsItem = await $('android=new UiSelector().text("Views")');
        await viewsItem.waitForDisplayed({ timeout: 20000 });
        await viewsItem.click();

        // Verifica que o item "Buttons" está presente na lista de Views
        const buttonsItem = await $('android=new UiSelector().text("Buttons")');
        const isDisplayed = await buttonsItem.isDisplayed();
        expect(isDisplayed).toBe(true);
    });
});

