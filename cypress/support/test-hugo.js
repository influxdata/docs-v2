import { spawn } from 'child_process';
import cypress from 'cypress';

const HUGO_PORT = 1315;
// Start Hugo server
const hugoServer = spawn('yarn', ['run', 'hugo', 'server', '--config', 'hugo.testing.yml', '--port', String(HUGO_PORT), '--buildDrafts'], { stdio: 'pipe' });
console.log(hugoServer);
hugoServer.stdout.on('data', (data) => {
  console.log(`Hugo server output: ${data}`);
});

hugoServer.stderr.on('data', (data) => {
  console.error(`Hugo server error: ${data}`);
});

hugoServer.on('close', (code) => {
  console.log(`Hugo server exited with code ${code}`);
});

// Run Cypress tests
cypress.run({
  reporter: 'junit',
  browser: 'chrome',
  config: {
    baseUrl: `http://localhost:${HUGO_PORT}`,
    video: true,
  },
  env: {
    login_url: '/login',
    products_url: '/products',
  },
});