const {request, expect} = require('@playwright/test');

class APITestHelper {
    constructor(baseURL, username, password) {
        this.baseURL = baseURL;
        this.username = username;
        this.password = password;
    }

    async searchTransactionsByAmount(newAccountNumber, billAmount) {
        const apiContext = await request.newContext({
            httpCredentials: {
                username: this.username,
                password: this.password
            }
        });
        const URL = this.baseURL + "/parabank/services_proxy/bank/accounts/" + newAccountNumber + "/transactions/amount/" + billAmount + "?timeout=30000";
        const response = await apiContext.get(URL);
        console.log("Status: " + response.status());
        console.log("Response successful: " + response.ok());
        console.log("Response body: " + JSON.stringify(await response.json(), null, 2));
        return await response.json();
    }
}

module.exports = APITestHelper;