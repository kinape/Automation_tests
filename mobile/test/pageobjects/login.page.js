
class LoginPage {

    get inputUsername () {
        // Seletor para o campo de usuário. Use o Appium Inspector para encontrar o seletor correto.
        // Exemplo: return $('~username'); // Accessibility ID
        // Exemplo: return $('//android.widget.EditText[@content-desc="username"]'); // XPath
        return $('~username');
    }

    get inputPassword () {
        // Seletor para o campo de senha.
        return $('~password');
    }

    get btnLogin () {
        // Seletor para o botão de login.
        return $('~login');
    }

    async login (username, password) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnLogin.click();
    }
}

module.exports = new LoginPage();

