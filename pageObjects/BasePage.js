class BasePage {

    constructor(page) {
        this.page = page;
    }

    async navigateTo() {
        await this.page.goto("https://parabank.parasoft.com");
    }

}

module.exports = BasePage;