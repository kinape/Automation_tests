describe('ApiDemos - Smoke', () => {
    it('deve abrir o app e navegar para Views', async () => {
        // 1. Aguardar a tela inicial carregar
        // Um elemento confiável na tela inicial é o próprio nome do app "API Demos".
        const appTitle = await $('//android.widget.TextView[@text="API Demos"]');
        await appTitle.waitForDisplayed({
            timeout: 90000,
            timeoutMsg: 'A tela inicial do App (API Demos) não carregou a tempo.'
        });

        // 2. Navegar para "Views"
        const viewsSelector = '~Views';
        const viewsItem = await $(viewsSelector);

        // Tenta clicar diretamente, mas se não estiver visível, rola a tela.
        if (!(await viewsItem.isDisplayed().catch(() => false))) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Views")');
        }
        await viewsItem.click();

        // 3. Verificar se a tela "Views" foi carregada
        const viewsTitle = await $('//android.widget.TextView[@text="Views"]');
        await viewsTitle.waitForDisplayed({ 
            timeout: 30000,
            timeoutMsg: 'A tela de "Views" não carregou após o clique.'
        });

        // 4. Verificar a presença do item "Buttons"
        const buttonsSelector = '~Buttons';
        const buttonsItem = await $(buttonsSelector);

        if (!(await buttonsItem.isDisplayed().catch(() => false))) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Buttons")');
        }

        await buttonsItem.waitForDisplayed({ 
            timeout: 30000,
            timeoutMsg: 'O item "Buttons" não foi encontrado na tela "Views".'
        });
        expect(await buttonsItem.isDisplayed()).toBe(true);
    });
});
