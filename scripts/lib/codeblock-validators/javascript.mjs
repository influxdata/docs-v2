import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const TIMEOUT_MS = 5000;

export function validate(code) {
  let dir;
  try {
    dir = mkdtempSync(join(tmpdir(), 'lint-js-'));
    writeFileSync(join(dir, 'snippet.js'), code, 'utf8');
  } catch (err) {
    return Promise.resolve({
      ok: false,
      errors: [{ line: 1, message: `js validator setup failed: ${err.message}` }],
    });
  }
  const file = join(dir, 'snippet.js');
  return new Promise((resolve) => {
    const proc = spawn(process.execPath, ['--check', file], {
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    let stderr = '';
    let timedOut = false;
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { rmSync(dir, { recursive: true, force: true }); } catch { /* best-effort */ }
      resolve(result);
    };
    const timer = setTimeout(() => { timedOut = true; proc.kill('SIGKILL'); }, TIMEOUT_MS);
    proc.stderr.on('data', (d) => { stderr += d; });
    proc.on('error', (err) => {
      finish({
        ok: false,
        errors: [{
          line: 1,
          message: err?.message || 'node --check: failed to start validator',
        }],
      });
    });
    proc.on('close', (exitCode) => {
      if (timedOut) {
        return finish({
          ok: false,
          errors: [{ line: 1, message: 'node --check: validator timeout' }],
        });
      }
      if (exitCode === 0) return finish({ ok: true, errors: [] });
      // Node prints either `path:line` or `path:line:column` in stderr.
      const lineMatch = stderr.match(/:(\d+):\d+/) || stderr.match(/:(\d+)\b/);
      const msgMatch = stderr.match(/SyntaxError: ([^\n]+)/);
      finish({
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
