import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set. Copy .env.example to .env.`);
  }
  return value;
}

/** Single place where tests read environment settings. Secrets never get a default here. */
export const env = {
  baseUrl: process.env.AUT_BASE_URL ?? 'http://localhost:4200',
  apiUrl: process.env.AUT_API_URL ?? 'http://localhost:8091',
  headless: process.env.HEADED !== '1',
  /** Prefix for every record an automated test creates, so cleanup can find it. */
  testDataPrefix: process.env.TEST_DATA_PREFIX ?? 'BDD',
  users: {
    get admin() {
      return { email: required('AUT_ADMIN_EMAIL'), password: required('AUT_ADMIN_PASSWORD') };
    },
    get customer() {
      return { email: required('AUT_CUSTOMER_EMAIL'), password: required('AUT_CUSTOMER_PASSWORD') };
    },
  },
};

export type Role = keyof typeof env.users;
