const {expect} = require("@playwright/test");

class AccountServicesPage {

    constructor(page) {
        this.page = page;
        this.loginWelcomeName = page.locator("//p[@class='smallText']");
        this.accountServices = page.locator("//h2[text()='Account Services']//following-sibling::ul/li");
        this.openNewAccount = page.locator("//a[text()='Open New Account']");
        this.accountsOverview = page.locator("//h2[text()='Account Services']//following-sibling::ul//li//a[text()='Accounts Overview']");
        this.transferFunds = page.locator("//h2[text()='Account Services']//following-sibling::ul//li//a[text()='Transfer Funds']");
        this.accountTypeDropdown = page.locator("//select[@id='type']");
        this.existingAccountDropdown = page.locator("//select[@id='fromAccountId']");
        this.existingAccountNumber = page.locator("//select[@id='fromAccountId']//option");
        this.openNewAccountBtn = page.locator("//input[@value='Open New Account']");
        this.accountNumberCreated = page.locator("//a[@id='newAccountId']");
        this.transferAmount = page.locator("//input[@id='amount']");
        this.fromAccountID = page.locator("//select[@id='fromAccountId']");
        this.toAccountID = page.locator("//select[@id='toAccountId']");
        this.transferBtn = page.locator("//input[@value='Transfer']");
        this.transferCompleteText = page.locator("//h1[text()='Transfer Complete!']");

        this.billPay = page.locator("//h2[text()='Account Services']//following-sibling::ul//li//a[text()='Bill Pay']");
        this.payeeName = page.locator("//input[@name='payee.name']");
        this.payeeAddress = page.locator("//input[@name='payee.address.street']");
        this.payeeCity = page.locator("//input[@name='payee.address.city']");
        this.payeeState = page.locator("//input[@name='payee.address.state']");
        this.payeeZipCode = page.locator("//input[@name='payee.address.zipCode']");
        this.payeePhoneNumber = page.locator("//input[@name='payee.phoneNumber']");
        this.payeeAccountNumber = page.locator("//input[@name='payee.accountNumber']");
        this.verifyAccount = page.locator("//input[@name='verifyAccount']");
        this.amountToTransfer = page.locator("//input[@name='amount']");
        this.fromAccount = page.locator("//select[@name='fromAccountId']");
        this.sendPayment = page.locator("//input[@value='Send Payment']");
        this.billPaymentCompleteText = page.locator("//h1[text()='Bill Payment Complete']");
    }

    async getLoginWelcomeName() {
        return await this.loginWelcomeName.textContent();
    }

    async getAccountServicesNames() {
        return this.accountServices;
    }

    async openNewSavingsAccount() {
        await this.openNewAccount.click();
    }

    async fetchExistingAccountNumber() {
        await this.existingAccountNumber.isVisible();
        return await this.existingAccountNumber.textContent();
    }

    async createSavingsAccount(accountType, existingAccNum) {
        await this.accountTypeDropdown.selectOption(accountType);

        await this.existingAccountDropdown.selectOption(existingAccNum);
        await this.openNewAccountBtn.isEnabled();
        await this.openNewAccountBtn.click();

        await this.page.waitForSelector("//a[@id='newAccountId']");
        await this.accountNumberCreated.isVisible();
        return await this.accountNumberCreated.textContent();
    }

    async fetchAccountBalanceOfNewAccount(accountNumber) {
        await this.accountsOverview.click();
        const accountBalance = this.page.locator("//a[text()=" + accountNumber + "]//parent::td//following-sibling::td[1]");
        await accountBalance.waitFor("visible");
        const balance = await accountBalance.textContent();
        console.log("New Account Balance: " + balance);
        return balance;
    }

    async transferFundsFromNewAccount(newAccNum, existingAccNum, transferAmount) {
        await this.transferFunds.click();
        await this.transferAmount.fill(transferAmount);
        await this.fromAccountID.selectOption(newAccNum);
        await this.toAccountID.selectOption(existingAccNum);
        await this.transferBtn.click();
    }

    async getTransferCompleteText() {
        await this.transferCompleteText.isVisible();
        return this.transferCompleteText.textContent();
    }

    async billPayFromNewAccount(billPayee, newAccNum, existingAccNum, amount) {
        await this.billPay.click();
        await this.payeeName.fill(billPayee.name);
        await this.payeeAddress.fill(billPayee.address);
        await this.payeeCity.fill(billPayee.city);
        await this.payeeState.fill(billPayee.state);
        await this.payeeZipCode.fill(billPayee.zipCode);
        await this.payeePhoneNumber.fill(billPayee.phoneNumber);
        await this.payeeAccountNumber.fill(existingAccNum);
        await this.verifyAccount.fill(existingAccNum);
        await this.amountToTransfer.fill(amount.toString());
        await this.fromAccount.selectOption(newAccNum);
        await this.sendPayment.click();
    }

    async getBillPaymentCompleteText() {
        await this.billPaymentCompleteText.isVisible();
        return this.billPaymentCompleteText.textContent();
    }
}

module.exports = AccountServicesPage;