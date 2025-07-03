import { spawn } from 'child_process';
import fs from 'fs';
import http from 'http';
import net from 'net';
import process from 'process';

// Hugo server constants
export const HUGO_ENVIRONMENT = 'testing';
export const HUGO_PORT = 1315;
export const HUGO_LOG_FILE = '/tmp/hugo_server.log';

/**
 * Check if a port is already in use
 * @param {number} port - The port to check
 * @returns {Promise<boolean>} True if port is in use, false otherwise
 */
export async function isPortInUse(port) {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once('error', () => resolve(true))
      .once('listening', () => {
        tester.close();
        resolve(false);
      })
      .listen(port, '127.0.0.1');
  });
}

/**
 * Start the Hugo server with the specified options
 * @param {Object} options - Configuration options for Hugo
 * @param {string} options.configFile - Path to Hugo config file
 * @param {string} options.environment - Environment to run Hugo in
 * @param {number} options.port - Port number for Hugo server
 * @param {boolean} options.buildDrafts - Whether to build draft content
 * @param {boolean} options.noHTTPCache - Whether to disable HTTP caching
 * @param {string} options.logFile - Path to write Hugo logs
 * @returns {Promise<Object>} Child process object
 */
export async function startHugoServer({
  configFile = 'config/_default/hugo.yml',
  port = HUGO_PORT,
  environment = 'testing',
  buildDrafts = false,
  noHTTPCache = true,
  logFile = HUGO_LOG_FILE,
} = {}) {
  console.log(`Starting Hugo server on port ${port}...`);

  // Prepare command arguments
  const hugoArgs = [
    'hugo',
    'server',
    '--environment',
    environment,
    '--config',
    configFile,
    '--port',
    String(port),
  ];

  if (buildDrafts) {
    hugoArgs.push('--buildDrafts');
  }

  if (noHTTPCache) {
    hugoArgs.push('--noHTTPCache');
  }

  return new Promise((resolve, reject) => {
    try {
      // Use yarn to find and execute Hugo, which will work regardless of installation method
      console.log(`Running Hugo with yarn: yarn ${hugoArgs.join(' ')}`);
      const hugoProc = spawn('yarn', hugoArgs, {
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true,
      });

      // Check if the process started successfully
      if (!hugoProc || !hugoProc.pid) {
        return reject(new Error('Failed to start Hugo server via yarn'));
      }

      // Set up logging
      if (logFile) {
        hugoProc.stdout.on('data', (data) => {
          const output = data.toString();
          fs.appendFileSync(logFile, output);
          process.stdout.write(`Hugo: ${output}`);
        });

        hugoProc.stderr.on('data', (data) => {
          const output = data.toString();
          fs.appendFileSync(logFile, output);
          process.stderr.write(`Hugo ERROR: ${output}`);
        });
      }

      // Handle process errors
      hugoProc.on('error', (err) => {
        console.error(`Error in Hugo server process: ${err}`);
        reject(err);
      });

      // Check for early exit
      hugoProc.on('close', (code) => {
        if (code !== null && code !== 0) {
          reject(new Error(`Hugo process exited early with code ${code}`));
        }
      });

      // Resolve with the process object after a short delay to ensure it's running
      setTimeout(() => {
        if (hugoProc.killed) {
          reject(new Error('Hugo process was killed during startup'));
        } else {
          resolve(hugoProc);
        }
      }, 500);
    } catch (err) {
      console.error(`Error starting Hugo server: ${err.message}`);
      reject(err);
    }
  });
}

/**
 * Wait for the Hugo server to be ready
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<void>}
 */
export async function waitForHugoReady(timeoutMs = 30000) {
  console.log(
    `Waiting for Hugo server to be ready on http://localhost:${HUGO_PORT}...`
  );

  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    // Poll the server
    function checkServer() {
      const req = http.get(`http://localhost:${HUGO_PORT}`, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          // If we get a response but not 200, try again after delay
          const elapsed = Date.now() - startTime;
          if (elapsed > timeoutMs) {
            reject(
              new Error(
                `Hugo server responded with status ${res.statusCode} after timeout`
              )
            );
          } else {
            setTimeout(checkServer, 1000);
          }
        }
      });

      req.on('error', (err) => {
        // Connection errors are expected while server is starting
        const elapsed = Date.now() - startTime;
        if (elapsed > timeoutMs) {
          reject(
            new Error(`Timed out waiting for Hugo server: ${err.message}`)
          );
        } else {
          // Try again after a delay
          setTimeout(checkServer, 1000);
        }
      });

      req.end();
    }

    // Start polling
    checkServer();
  });
}
