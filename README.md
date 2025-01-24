# Playwright TypeScript Framework

This is a Javascript-based testing framework using Playwright to automate the Parabank website. The framework is set up to facilitate end-to-end testing for Web and API.

## Project Structure

- `package.json`: Contains metadata about the project and lists the dependencies.
- `package-lock.json`: Records the exact versions of the dependencies installed.
- `node_modules/`: Directory where all the project dependencies are installed.

## Dependencies

### Dev Dependencies

- **@playwright/test**: Playwright's test runner and assertion library.
- **@types/node**: TypeScript definitions for Node.js.

## Installation

To install the dependencies, run:


```zsh
brew install node
```

```zsh
npm install
```

```zsh
npm init playwright
```

## Running Tests

To run the tests, execute the following command:

```zsh
npx playwright test
```

To run the tests in headed mode, execute the following command:

```zsh
npx playwright test --headed
```

To start the interactive UI mode:

```zsh
npx playwright test --ui
```

To run the tests only on Desktop Chrome:

```zsh
npx playwright test --project=chromium
```

To run the tests in a specific file:

```zsh
npx playwright test example
```

To run the tests in debug mode:

```zsh
npx playwright test --debug
```

To auto generate tests with Codegen:

```zsh
npx playwright codegen
```


## Writing Tests

The tests are written in TypeScript and are located in the `tests/` directory. The test files have the `.spec.ts` extension.

## Configuration

The configuration for the Playwright test runner is located in the `playwright.config.ts` file.

## Reporting

The test results are displayed in the terminal. You can also generate a report in HTML format by running the following command:

```zsh
npx playwright test --reporter=list
```

The report will be saved in the `test-results/` directory.

## CI/CD
- The project is set up to run on Jenkins. The `Jenkinsfile.groovy` is located in the `infra` directory.
- The project is also set up to run on GitHub Actions. The workflow configuration is located in the `.github/workflows/` directory.