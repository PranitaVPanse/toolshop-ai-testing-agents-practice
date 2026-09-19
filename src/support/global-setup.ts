import { request } from '@playwright/test';
import { env } from '../../config/env';

/**
 * Warms up the application before the suite starts.
 * The local Toolshop runs in development mode, where the first request through each API code
 * path takes up to 10 s and later ones well under 1 s. Without this, the first tests fail on
 * timeouts that say nothing about the application.
 */
export default async function globalSetup(): Promise<void> {
  const api = await request.newContext({ baseURL: env.apiUrl, timeout: 120_000 });
  try {
    const status = await api.get('/status');
    if (!status.ok()) {
      throw new Error(`API at ${env.apiUrl} answered ${status.status()}. Start the app with: npm run aut:up`);
    }
    await api.get('/products');
    for (const user of [env.users.customer, env.users.admin]) {
      const login = await api.post('/users/login', { data: user });
      if (!login.ok()) {
        throw new Error(`Warm-up login failed for ${user.email} with ${login.status()}. Reset data with: npm run aut:reset`);
      }
      // The pages shown after login wait for these before they render the user menu.
      const headers = { Authorization: `Bearer ${(await login.json()).access_token}` };
      for (const path of ['/users/me', '/invoices?page=1', '/reports/total-sales-of-years?years=5']) {
        await api.get(path, { headers }); // 403 for the customer on reports is fine, it still warms the route
      }
    }
    // A rejected login runs a different code path than a successful one.
    await api.post('/users/login', { data: { email: 'nobody@example.com', password: 'warm-up' } });
  } finally {
    await api.dispose();
  }
}
