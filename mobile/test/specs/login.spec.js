describe('ApiDemos - Smoke', () => {
    it('deve abrir o app e navegar para Views', async () => {
        // Aguarda a tela inicial do API Demos para evitar flakiness
                const title = await $('~API Demos');
        await title.waitForDisplayed({ timeout: 60000 });

        // Tenta por accessibility id e faz fallback por texto com rolagem
        let viewsItem = await $('~Views').catch(() => undefined);
        if (!viewsItem || !(await viewsItem.isDisplayed().catch(() => false))) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Views")');
            viewsItem = await $("android=new UiSelector().text(\"Views\")");
        }
        await viewsItem.waitForDisplayed({ timeout: 60000 });
        await viewsItem.click();

        // Na tela de "Views", tenta por accessibility id e faz fallback por texto com rolagem
        let buttonsItem = await $('~Buttons').catch(() => undefined);
        if (!buttonsItem || !(await buttonsItem.isDisplayed().catch(() => false))) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Buttons")');
            buttonsItem = await $("android=new UiSelector().text(\"Buttons\")");
        }
        await buttonsItem.waitForDisplayed({ timeout: 30000 });
        expect(await buttonsItem.isDisplayed()).toBe(true);
    });
});
