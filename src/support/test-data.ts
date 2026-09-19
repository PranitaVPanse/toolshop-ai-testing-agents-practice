import { env } from '../../config/env';

/** Name for a record created by an automated test, for example "BDD-20260919-141207 Hammer". */
export function prefixed(label: string): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  return `${env.testDataPrefix}-${stamp} ${label}`;
}
