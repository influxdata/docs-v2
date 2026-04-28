import TOML from '@iarna/toml';

export function validate(code) {
  try {
    TOML.parse(code);
    return { ok: true, errors: [] };
  } catch (err) {
    const line = typeof err?.line === 'number' ? err.line + 1 : 1;
    const column = typeof err?.col === 'number' ? err.col + 1 : undefined;
    return { ok: false, errors: [{ line, column, message: err.message ?? String(err) }] };
  }
}
