import { parse } from 'smol-toml';

export function validate(code) {
  try {
    parse(code, { integersAsBigInt: true });
    return { ok: true, errors: [] };
  } catch (err) {
    const line = typeof err?.line === 'number' ? err.line : 1;
    const column = typeof err?.column === 'number' ? err.column : undefined;
    return {
      ok: false,
      errors: [{ line, column, message: err.message ?? String(err) }],
    };
  }
}
