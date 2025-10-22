describe('ApiDemos - Smoke', () => {
    it('deve abrir o app e navegar para Views', async () => {
        // Garante que o item "Views" esteja visível; se não, rola até ele
        const viewsItem = await $('~Views');
        const viewsVisible = await viewsItem.isDisplayed().catch(() => false);
        if (!viewsVisible) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Views")');
        }
        await (await $('~Views')).waitForDisplayed({ timeout: 60000 });
        await (await $('~Views')).click();

        // Garante que o item "Buttons" esteja visível em "Views"; se necessário, rola
        const buttonsItem = await $('~Buttons');
        const buttonsVisible = await buttonsItem.isDisplayed().catch(() => false);
        if (!buttonsVisible) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Buttons")');
        }
        await (await $('~Buttons')).waitForDisplayed({ timeout: 30000 });
        expect(await (await $('~Buttons')).isDisplayed()).toBe(true);
    });
});

