import type { Page } from '@playwright/test';

/** Login page, /auth/login. Every locator below was checked to match exactly one element. */
export const loginLocators = (page: Page) => ({
  heading: page.getByRole('heading', { name: 'Login' }),
  emailInput: page.getByLabel('Email address'),
  // Not getByLabel('Password'): it matches 2 elements, the input and the "Forgot your Password?" link.
  passwordInput: page.getByRole('textbox', { name: 'Password' }),
  submitButton: page.getByRole('button', { name: 'Login', exact: true }),
  // Error containers have no role, so test ids are the stable choice. Their text is translated.
  emailError: page.getByTestId('email-error'),
  passwordError: page.getByTestId('password-error'),
  loginError: page.getByTestId('login-error'),
});

export type LoginLocators = ReturnType<typeof loginLocators>;
