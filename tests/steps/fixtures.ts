import { test as base, createBdd } from 'playwright-bdd';
import { AccountPage } from '../pages/account.page';
import { LoginPage } from '../pages/login.page';

/**
 * Page objects are registered here as fixtures, one per page.
 * Step files import Given, When, Then from this file, never from playwright-bdd directly,
 * so every step gets the same fixtures.
 */
type Pages = {
  loginPage: LoginPage;
  accountPage: AccountPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  accountPage: async ({ page }, use) => use(new AccountPage(page)),
});

export const { Given, When, Then, Before, After } = createBdd(test);
