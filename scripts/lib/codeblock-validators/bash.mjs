import { spawn } from 'node:child_process';

const TIMEOUT_MS = 5000;

export function validate(code) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(result);
    };

    const proc = spawn('bash', ['-n', '/dev/stdin'], { stdio: ['pipe', 'ignore', 'pipe'] });
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGKILL');
    }, TIMEOUT_MS);

    proc.on('error', (err) => {
      finish({
        ok: false,
        errors: [{ line: 1, message: err?.message || 'bash: failed to spawn validator' }],
      });
    });
    proc.stderr.on('data', (d) => { stderr += d; });
    proc.on('close', () => {
      if (timedOut) {
        return finish({ ok: false, errors: [{ line: 1, message: 'bash: validator timeout' }] });
      }
      if (!stderr.trim()) return finish({ ok: true, errors: [] });
      const errors = [];
      for (const rawLine of stderr.split('\n')) {
        if (!rawLine.trim()) continue;
        const m = rawLine.match(/line (\d+):/);
        errors.push({
          line: m ? Number(m[1]) : 1,
          message: rawLine.replace(/^[^:]*:\s*/, '').trim(),
        });
      }
      finish({ ok: false, errors: errors.length ? errors : [{ line: 1, message: stderr.trim() }] });
    });
    proc.stdin.end(code);
  });
}
