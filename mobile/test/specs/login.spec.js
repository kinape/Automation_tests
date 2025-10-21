describe('ApiDemos - Smoke', () => {
    it('deve abrir o app e navegar para Views', async () => {
        // Verifica que o item "Views" está presente na tela inicial e clica nele
        // Tenta por accessibility id; se não estiver visível, faz scroll até o texto aparecer
        let viewsItem = await $('~Views');
        if (!(await viewsItem.isDisplayed().catch(() => false))) {
            const scroller = await $(
                'android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Views")'
            );
            // Após o scroll, localiza novamente por texto para garantir o clique
            viewsItem = await $('android=new UiSelector().text("Views")');
        }
        await viewsItem.waitForDisplayed({ timeout: 60000 });
        await viewsItem.click();

        // Verifica que o item "Buttons" está presente na lista de Views (faz scroll se necessário)
        let buttonsItem = await $('~Buttons');
        if (!(await buttonsItem.isDisplayed().catch(() => false))) {
            await $(
                'android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Buttons")'
            );
            buttonsItem = await $('android=new UiSelector().text("Buttons")');
        }
        await buttonsItem.waitForDisplayed({ timeout: 30000 });
        expect(await buttonsItem.isDisplayed()).toBe(true);
    });
});
