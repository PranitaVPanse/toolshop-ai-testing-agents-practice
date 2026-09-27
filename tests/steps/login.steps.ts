import { expect } from '@playwright/test';
import type { Role } from '../../helpers/env';
import { Given, When, Then } from './fixtures';

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.open();
  await expect(loginPage.locators.heading).toBeVisible();
});

When('I log in as the {word}', async ({ loginPage }, role: Role) => {
  await loginPage.loginAs(role);
});

When('I log in with email {string} and password {string}', async ({ loginPage }, email: string, password: string) => {
  await loginPage.login(email, password);
});

When('I submit the login form without entering anything', async ({ loginPage }) => {
  await loginPage.submitEmpty();
});

Then('I am taken to {string}', async ({ page }, path: string) => {
  await expect(page).toHaveURL(new RegExp(`${path}$`));
});

Then('I see the My account page', async ({ accountPage }) => {
  await expect(accountPage.locators.heading).toBeVisible();
});

Then('I am signed in', async ({ accountPage }) => {
  await expect(accountPage.locators.userMenu).toBeVisible();
  await expect(accountPage.locators.signInLink).toBeHidden();
});

Then('I see the login error {string}', async ({ loginPage }, message: string) => {
  await expect(loginPage.locators.loginError).toHaveText(message);
});

Then('I see the email error {string}', async ({ loginPage }, message: string) => {
  await expect(loginPage.locators.emailError).toHaveText(message);
});

Then('I see the password error {string}', async ({ loginPage }, message: string) => {
  await expect(loginPage.locators.passwordError).toHaveText(message);
});

Then('I am still on the login page', async ({ page, loginPage }) => {
  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(loginPage.locators.submitButton).toBeVisible();
});
