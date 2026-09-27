// Starts, stops or resets the local Toolshop with Docker Compose.
// Usage: node helpers/aut.mjs up | down | reset
import { execSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const REPO = 'https://github.com/testsmith-io/practice-software-testing.git';
const DIR = 'aut/practice-software-testing';
const command = process.argv[2];

const run = (cmd, cwd = DIR) => {
  if (spawnSync(cmd, { shell: true, stdio: 'inherit', cwd }).status !== 0) throw new Error(`Failed: ${cmd}`);
};
const succeeds = (cmd) => spawnSync(cmd, { shell: true, stdio: 'ignore', cwd: DIR }).status === 0;
const output = (cmd) => execSync(cmd, { cwd: DIR, encoding: 'utf8' }).trim();

async function waitFor(url) {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(url, { signal: AbortSignal.timeout(5000) })).ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error(`${url} did not answer within 5 minutes. Check: docker compose logs`);
}

async function up({ reseed }) {
  const firstRun = !existsSync(DIR);
  if (firstRun) run(`git clone --depth 1 ${REPO} ${DIR}`, '.');

  run('docker compose up -d');

  // The composer service installs the PHP dependencies and exits. Unzipping through a Windows
  // bind mount can exceed composer's 300 s limit, so retry once without the limit.
  const composer = output('docker compose ps -a -q composer');
  if (composer && output(`docker wait ${composer}`) !== '0') {
    run('docker compose run --rm -e COMPOSER_PROCESS_TIMEOUT=0 composer');
  }
  // composer chowns everything to its own www-data (uid 82), but the API runs as uid 1000.
  // Without this, Laravel cannot write its log or cache and every database route returns 500.
  run('docker compose exec -T -u root laravel-api chmod -R a+rwX storage bootstrap/cache');

  if (firstRun || reseed || !succeeds('docker compose exec -T laravel-api php artisan migrate:status')) {
    run('docker compose exec -T laravel-api php artisan migrate:fresh --seed --force');
  }

  await waitFor('http://localhost:8091/status');
  await waitFor('http://localhost:4200');
  console.log(
    'Toolshop UI http://localhost:4200, API http://localhost:8091, Swagger http://localhost:8091/api/documentation',
  );
}

if (command === 'up') await up({ reseed: false });
else if (command === 'reset') await up({ reseed: true });
else if (command === 'down') {
  if (existsSync(DIR)) run('docker compose down');
  else console.log('Nothing to stop.');
} else {
  console.error('Usage: node helpers/aut.mjs up | down | reset');
  process.exit(1);
}
