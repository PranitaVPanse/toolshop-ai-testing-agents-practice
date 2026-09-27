import type { Page } from '@playwright/test';
import { env, type Role } from '../../helpers/env';
import { loginLocators, type LoginLocators } from '../locators/login.locators';
import { BasePage } from './base.page';

export class LoginPage extends BasePage<LoginLocators> {
  constructor(page: Page) {
    super(page, loginLocators, '/auth/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.loc.emailInput.fill(email);
    await this.loc.passwordInput.fill(password);
    await this.loc.submitButton.click();
  }

  /** Logs in with the demo account for the role. Credentials come from .env, never from a feature file. */
  async loginAs(role: Role): Promise<void> {
    const { email, password } = env.users[role];
    await this.login(email, password);
  }

  async submitEmpty(): Promise<void> {
    await this.loc.submitButton.click();
  }
}
