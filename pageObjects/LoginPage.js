class LoginPage {
    constructor(page) {
        this.logInBtn = page.locator("//input[@value='Log In']");
        this.username = page.locator("//input[@name='username']");
        this.password = page.locator("//input[@name='password']");
        this.logInBtn = page.locator("//input[@value='Log In']");
    }

    async login(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.logInBtn.click();
    }
}

module.exports = LoginPage;