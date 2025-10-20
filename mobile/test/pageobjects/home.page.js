
class HomePage {

    get welcomeMessage () {
        // Seletor para a mensagem de boas-vindas ou outro elemento que confirme o login.
        // Exemplo: return $('//android.widget.TextView[contains(@text, "Welcome")]'); // XPath
        return $('~welcome'); 
    }

    async isWelcomeMessageDisplayed() {
        return await this.welcomeMessage.isDisplayed();
    }
}

module.exports = new HomePage();
