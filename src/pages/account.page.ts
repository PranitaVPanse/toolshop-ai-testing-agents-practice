import type { Page } from '@playwright/test';
import { accountLocators, type AccountLocators } from '../locators/account.locators';
import { BasePage } from './base.page';

export class AccountPage extends BasePage<AccountLocators> {
  constructor(page: Page) {
    super(page, accountLocators, '/account');
  }
}
