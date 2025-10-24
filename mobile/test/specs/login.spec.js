describe('ApiDemos - Smoke', () => {
    it('deve abrir o app e navegar para Views', async () => {
        // Tenta localizar "Views"; se não estiver visível, faz scroll até ficar em viewport
        const viewsSelector = '~Views';
        let viewsItem = await $(viewsSelector);

        try {
            if (!(await viewsItem.isDisplayed())) {
                await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Views")');
                viewsItem = await $(viewsSelector);
            }
        } catch (_) {
            // Fallback adicional: tenta sempre o UiScrollable
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Views")');
            viewsItem = await $(viewsSelector);
        }

        await viewsItem.waitForDisplayed({ timeout: 90000 });
        await viewsItem.click();

        // Verifica que "Buttons" aparece dentro de Views
        const buttonsItem = await $('~Buttons');
        await buttonsItem.waitForDisplayed({ timeout: 60000 });
        expect(await buttonsItem.isDisplayed()).toBe(true);
    });
});

