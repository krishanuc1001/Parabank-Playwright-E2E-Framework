const {test, expect, request} = require('@playwright/test');

test('E2E Scenario: Para Bank', async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    const baseURL = 'https://parabank.parasoft.com';
    const randomUsername = `user${Math.floor(Math.random() * 10000)}`;
    const password = 'Password123';
    console.log(`Random Username: ${randomUsername}`);

    // HomePage locators
    const registerBtnHomePage = page.locator("//a[text()='Register']");
    const usernameHomePage = page.locator("//input[@name='username']");
    const passwordHomePage = page.locator("//input[@name='password']");
    const logInBtnHomePage = page.locator("//input[@value='Log In']");

    // User Registration Page locators
    const firstName = page.locator("//input[@id='customer.firstName']");
    const lastName = page.locator("//input[@id='customer.lastName']");
    const address = page.locator("//input[@id='customer.address.street']");
    const city = page.locator("//input[@id='customer.address.city']");
    const state = page.locator("//input[@id='customer.address.state']");
    const zipCode = page.locator("//input[@id='customer.address.zipCode']");
    const phoneNumber = page.locator("//input[@id='customer.phoneNumber']");
    const ssn = page.locator("//input[@id='customer.ssn']");
    const custUsername = page.locator("//input[@id='customer.username']");
    const custPassword = page.locator("//input[@id='customer.password']");
    const repeatedPassword = page.locator("//input[@id='repeatedPassword']");
    const registerBtn = page.locator("//input[@value='Register']");
    const logOutBtn = page.locator("//a[text()='Log Out']");

    // Account Services Page locators
    const accountServices = page.locator("//h2[text()='Account Services']//following-sibling::ul/li");
    const openNewAccount = page.locator("//a[text()='Open New Account']");
    const accountsOverview = page.locator("//h2[text()='Account Services']//following-sibling::ul//li//a[text()='Accounts Overview']");
    const transferFunds = page.locator("//h2[text()='Account Services']//following-sibling::ul//li//a[text()='Transfer Funds']");
    const accountTypeDropdown = page.locator("//select[@id='type']");
    const existingAccountDropdown = page.locator("//select[@id='fromAccountId']");
    const existingAccountNumber = page.locator("//select[@id='fromAccountId']//option");
    const openNewAccountBtn = page.locator("//input[@value='Open New Account']");
    const accountNumberCreated = page.locator("//a[@id='newAccountId']");
    const transferAmount = page.locator("//input[@id='amount']");
    const fromAccountID = page.locator("//select[@id='fromAccountId']");
    const toAccountID = page.locator("//select[@id='toAccountId']");
    const transferBtn = page.locator("//input[@value='Transfer']");
    const transferCompleteText = page.locator("//h1[text()='Transfer Complete!']");

    const billPay = page.locator("//h2[text()='Account Services']//following-sibling::ul//li//a[text()='Bill Pay']");
    const payeeName = page.locator("//input[@name='payee.name']");
    const payeeAddress = page.locator("//input[@name='payee.address.street']");
    const payeeCity = page.locator("//input[@name='payee.address.city']");
    const payeeState = page.locator("//input[@name='payee.address.state']");
    const payeeZipCode = page.locator("//input[@name='payee.address.zipCode']");
    const payeePhoneNumber = page.locator("//input[@name='payee.phoneNumber']");
    const payeeAccountNumber = page.locator("//input[@name='payee.accountNumber']");
    const verifyAccount = page.locator("//input[@name='verifyAccount']");
    const amountToTransfer = page.locator("//input[@name='amount']");
    const fromAccount = page.locator("//select[@name='fromAccountId']");
    const sendPayment = page.locator("//input[@value='Send Payment']");
    const billPaymentCompleteText = page.locator("//h1[text()='Bill Payment Complete']");
    const amount = 50;

    // Navigate to Para bank application
    await page.goto(baseURL);

    // Create a new user from user registration page
    await registerBtnHomePage.click();
    await firstName.fill('Black');
    await lastName.fill('Adam');
    await address.fill('123 Main St');
    await city.fill('anycity');
    await state.fill('CA');
    await zipCode.fill('12345');
    await phoneNumber.fill('1234567890');
    await ssn.fill('123-45-6789');
    await custUsername.fill(randomUsername);
    await custPassword.fill(password);
    await repeatedPassword.fill(password);
    await registerBtn.click();
    await logOutBtn.click();

    // Login to the application with the user created
    await usernameHomePage.fill(randomUsername);
    await passwordHomePage.fill(password);
    await logInBtnHomePage.click();

    // Verify if the Global navigation menu in home page is working as expected
    const navMenuItems = ['Open New Account', 'Accounts Overview', 'Transfer Funds', 'Bill Pay', 'Find Transactions', 'Update Contact Info', 'Request Loan', 'Log Out'];
    for (let i = 0; i < navMenuItems.length; i++) {
        await expect(accountServices.nth(i).locator("text=" + navMenuItems[i])).toBeVisible();
    }

    // Create a Savings account from “Open New Account Page” and capture the account number
    await openNewAccount.click();
    await expect(accountTypeDropdown).toBeVisible();
    await accountTypeDropdown.selectOption("SAVINGS");

    const existingAccNum = await existingAccountNumber.textContent();
    console.log(`Existing Account Number: ${existingAccNum}`);
    await existingAccountDropdown.selectOption(existingAccNum);

    await openNewAccountBtn.isEnabled();
    await openNewAccountBtn.click();

    await page.waitForSelector("//a[@id='newAccountId']");

    await accountNumberCreated.isVisible({timeout: 20000});
    const accountNumber = await accountNumberCreated.textContent();
    console.log("New Savings Account Number: " + accountNumber);
    await expect(accountNumber).toMatch(/\d{4,}/);

    // Validate if Accounts overview page is displaying the balance details as expected
    await accountsOverview.click();
    const accountBalance = page.locator("//a[text()=" + accountNumber + "]//parent::td//following-sibling::td[1]");
    await accountBalance.waitFor("visible");
    const balance = await accountBalance.textContent();
    await expect(balance).toMatch(/\$\d+\.\d{2}/);

    // Transfer funds from account created to another account
    await transferFunds.click();
    await transferAmount.fill("100");
    await fromAccountID.selectOption(accountNumber);
    await toAccountID.selectOption(existingAccNum);
    await transferBtn.click();
    await expect(transferCompleteText).toBeVisible();

    // Pay the bill with account created
    await billPay.click();
    await payeeName.fill("Utility Company");
    await payeeAddress.fill("456 Elm St");
    await payeeCity.fill("Othertown");
    await payeeState.fill("TX");
    await payeeZipCode.fill("67890");
    await payeePhoneNumber.fill("0987654321");
    await payeeAccountNumber.fill(existingAccNum);
    await verifyAccount.fill(existingAccNum);
    await amountToTransfer.fill(amount.toString());
    await fromAccount.selectOption(accountNumber);
    await sendPayment.click();
    await expect(billPaymentCompleteText).toBeVisible();

    // Search the transactions using "Find transactions" API call by amount
    const apiContext = await request.newContext({
        httpCredentials: {
            username: randomUsername,
            password: password
        }
    });
    const URL = baseURL + "/parabank/services_proxy/bank/accounts/" + accountNumber + "/transactions/amount/" + amount + "?timeout=30000"
    const response = await apiContext.get(URL);
    console.log("Status: " + response.status());
    console.log("Response successful: " + response.ok());

    // Validate the details displayed in JSON response
    const jsonResponse = await response.json();
    console.log("JSON Response: " + jsonResponse);

    expect(response.ok()).toBeTruthy();
    expect(jsonResponse).toBeDefined();
    expect(jsonResponse.length).toBeGreaterThan(0);

    const transaction = jsonResponse[0];
    expect(transaction.accountId).toBe(parseInt(accountNumber));
    expect(transaction.type).toBe("Debit");
    expect(transaction.amount).toBe(amount);
    expect(transaction.description).toBe('Bill Payment to Utility Company');
});