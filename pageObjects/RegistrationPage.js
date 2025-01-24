class RegistrationPage {

    constructor(page) {
        this.registerBtnLanding = page.locator("//a[text()='Register']");
        this.firstName = page.locator("//input[@id='customer.firstName']");
        this.lastName = page.locator("//input[@id='customer.lastName']");
        this.address = page.locator("//input[@id='customer.address.street']");
        this.city = page.locator("//input[@id='customer.address.city']");
        this.state = page.locator("//input[@id='customer.address.state']");
        this.zipCode = page.locator("//input[@id='customer.address.zipCode']");
        this.phoneNumber = page.locator("//input[@id='customer.phoneNumber']");
        this.ssn = page.locator("//input[@id='customer.ssn']");
        this.customerUsername = page.locator("//input[@id='customer.username']");
        this.customerPassword = page.locator("//input[@id='customer.password']");
        this.repeatedPassword = page.locator("//input[@id='repeatedPassword']");
        this.registerBtn = page.locator("//input[@value='Register']");
        this.welcomeText = page.locator("//h1");
        this.loggedInText = page.locator("//h1//following-sibling::p");
        this.logOutBtn = page.locator("//a[text()='Log Out']");
    }

    async register(user) {
        await this.registerBtnLanding.click();
        await this.firstName.fill(user.firstName);
        await this.lastName.fill(user.lastName);
        await this.address.fill(user.address);
        await this.city.fill(user.city);
        await this.state.fill(user.state);
        await this.zipCode.fill(user.zipCode);
        await this.phoneNumber.fill(user.phoneNumber);
        await this.ssn.fill(user.ssn);
        await this.customerUsername.fill(user.username);
        await this.customerPassword.fill(user.password);
        await this.repeatedPassword.fill(user.password);
        await this.registerBtn.click();
    }

    async getWelcomeText() {
        await this.welcomeText.isVisible();
        return await this.welcomeText.textContent();
    }

    async getLoggedInText() {
        await this.loggedInText.isVisible();
        return await this.loggedInText.textContent();
    }

    async logOut() {
        await this.logOutBtn.click();
    }
}

module.exports = RegistrationPage;