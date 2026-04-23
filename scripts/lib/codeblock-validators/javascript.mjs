import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const TIMEOUT_MS = 5000;

export function validate(code) {
  return new Promise((resolve) => {
    const dir = mkdtempSync(join(tmpdir(), 'lint-js-'));
    const file = join(dir, 'snippet.js');
    writeFileSync(file, code, 'utf8');
    const proc = spawn(process.execPath, ['--check', file], {
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; proc.kill('SIGKILL'); }, TIMEOUT_MS);
    proc.stderr.on('data', (d) => { stderr += d; });
    proc.on('close', (exitCode) => {
      clearTimeout(timer);
      rmSync(dir, { recursive: true, force: true });
      if (timedOut) {
        return resolve({
          ok: false,
          errors: [{ line: 1, message: 'node --check: validator timeout' }],
        });
      }
      if (exitCode === 0) return resolve({ ok: true, errors: [] });
      // Node prints either `path:line` or `path:line:column` in stderr.
      const lineMatch = stderr.match(/:(\d+):\d+/) || stderr.match(/:(\d+)\b/);
      const msgMatch = stderr.match(/SyntaxError: ([^\n]+)/);
      resolve({
        ok: false,
        errors: [{
          line: lineMatch ? Number(lineMatch[1]) : 1,
          message: msgMatch
            ? msgMatch[1].trim()
            : stderr.trim().split('\n').pop() || 'javascript syntax error',
        }],
      });
    });
  });
}
