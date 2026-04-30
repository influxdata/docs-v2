import { spawn } from 'node:child_process';

const TIMEOUT_MS = 5000;
const PROGRAM = 'import sys, ast; ast.parse(sys.stdin.read())';

export function validate(code) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(result);
    };

    const proc = spawn('python3', ['-c', PROGRAM], { stdio: ['pipe', 'ignore', 'pipe'] });
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; proc.kill('SIGKILL'); }, TIMEOUT_MS);

    proc.on('error', (err) => {
      finish({
        ok: false,
        errors: [{ line: 1, message: err?.message || 'python: failed to spawn validator' }],
      });
    });
    proc.stderr.on('data', (d) => { stderr += d; });
    proc.on('close', (exitCode) => {
      if (timedOut) {
        return finish({ ok: false, errors: [{ line: 1, message: 'python: validator timeout' }] });
      }
      if (exitCode === 0) return finish({ ok: true, errors: [] });
      const lineMatch = stderr.match(/line (\d+)/);
      const msgMatch = stderr.match(/SyntaxError: ([^\n]+)/) || stderr.match(/IndentationError: ([^\n]+)/);
      finish({
        ok: false,
        errors: [{
          line: lineMatch ? Number(lineMatch[1]) : 1,
          message: msgMatch
            ? msgMatch[1].trim()
            : stderr.trim().split('\n').pop() || 'python syntax error',
        }],
      });
    });
    proc.stdin.end(code);
  });
}
