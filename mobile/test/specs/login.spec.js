describe('ApiDemos - Smoke', () => {
    it('deve abrir o app e navegar para Views', async () => {
        // Verifica que o item "Views" está presente na tela inicial e clica nele
        // Usa accessibility id (content-desc) que é mais estável/rápido que busca por texto
        const viewsItem = await $('~Views');
        await viewsItem.waitForDisplayed({ timeout: 60000 });
        await viewsItem.click();

        // Verifica que o item "Buttons" está presente na lista de Views
        const buttonsItem = await $('~Buttons');
        const isDisplayed = await buttonsItem.isDisplayed();
        expect(isDisplayed).toBe(true);
        await buttonsItem.click();
    });
});
