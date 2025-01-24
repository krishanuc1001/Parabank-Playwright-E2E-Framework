const {test, expect, request} = require('@playwright/test');
const BasePage = require("../pageObjects/BasePage")
const RegistrationPage = require('../pageObjects/RegistrationPage');
const LoginPage = require('../pageObjects/LoginPage');
const AccountServicesPage = require('../pageObjects/AccountServicesPage');
const APITestHelper = require('../helpers/APITestHelper');
const testData = require('../data/testData.json');
let page;

test.beforeAll(async ({browser}) => {
    const context = await browser.newContext();
    page = await context.newPage();
    const basePage = new BasePage(page);

    // Navigate to Para bank application
    await basePage.navigateTo();
});

test.only('E2E scenario - UI', async ({browser}) => {
    const registrationPage = new RegistrationPage(page);
    const loginPage = new LoginPage(page);
    const accountServicesPage = new AccountServicesPage(page);

    const randomUsername = `krish${Math.random().toString(36).slice(2, 9)}`;
    console.log(`Random Username: ${randomUsername}`);
    const user = {...testData.user, username: randomUsername};
    const billPayeeDetails = {...testData.billPayee};

    // Create a new user from user registration page
    await registrationPage.register(user)
    expect(await registrationPage.getWelcomeText()).toBe("Welcome " + randomUsername);
    // expect(registrationPage.getLoggedInText()).toBe("Your account was created successfully. You are now logged in.");
    await registrationPage.logOut();

    // Login to the application with the user created
    await loginPage.login(user.username, user.password);
    expect(await accountServicesPage.getLoginWelcomeName()).toBe("Welcome " + user.firstName + " " + user.lastName);

    // Verify if the Global navigation menu in home page is working as expected
    const accountServices = await accountServicesPage.getAccountServicesNames();
    for (let i = 0; i < testData.navMenuItems.length; i++) {
        await expect(accountServices.nth(i).locator("text=" + testData.navMenuItems[i])).toBeVisible();
    }

    // Create a Savings account from “Open New Account Page” and capture the account number
    await accountServicesPage.openNewSavingsAccount();
    const existingAccountNumber = await accountServicesPage.fetchExistingAccountNumber();
    console.log("Existing Account Number: " + existingAccountNumber);
    const newAccountNumber = await accountServicesPage.createSavingsAccount("SAVINGS", existingAccountNumber);
    console.log("New Savings Account Number: " + newAccountNumber);
    await expect(newAccountNumber).toMatch(/\d{4,}/);

    // Validate if Accounts overview page is displaying the balance details as expected
    const balance = await accountServicesPage.fetchAccountBalanceOfNewAccount(newAccountNumber);
    await expect(balance).toMatch(/\$\d+\.\d{2}/);

    // Transfer funds from account created to another account
    await accountServicesPage.transferFundsFromNewAccount(newAccountNumber, existingAccountNumber, "100");
    const transferCompleteText = await accountServicesPage.getTransferCompleteText();
    await expect(transferCompleteText).toBe("Transfer Complete!");

    // Pay the bill with account created
    await accountServicesPage.billPayFromNewAccount(billPayeeDetails, newAccountNumber, existingAccountNumber, 50);
    const billPaymentCompleteText = await accountServicesPage.getBillPaymentCompleteText();
    await expect(billPaymentCompleteText).toBe("Bill Payment Complete");

    // Search the transactions using "Find transactions" API call by amount
    const apiTestHelper = new APITestHelper(testData.baseURL, user.username, user.password);
    const jsonResponse = await apiTestHelper.searchTransactionsByAmount(newAccountNumber, testData.apiTestData.amount);
    const transaction = jsonResponse[0];
    await expect(jsonResponse).toBeDefined();
    await expect(jsonResponse.length).toBeGreaterThan(0);
    await expect(transaction.accountId).toBe(parseInt(newAccountNumber));
    await expect(transaction.type).toBe(testData.apiTestData.type);
    await expect(transaction.amount).toBe(testData.apiTestData.amount);
    await expect(transaction.description).toBe(testData.apiTestData.description);
});