import type { Page } from '@playwright/test';

/** Customer account overview, /account. */
export const accountLocators = (page: Page) => ({
  heading: page.getByRole('heading', { name: 'My account', level: 1 }),
  // Header menu that carries the signed-in user's name. Only rendered when logged in.
  userMenu: page.getByTestId('nav-menu'),
  signInLink: page.getByRole('link', { name: 'Sign in' }),
});

export type AccountLocators = ReturnType<typeof accountLocators>;
