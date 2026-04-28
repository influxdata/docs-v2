import yaml from 'js-yaml';

export function validate(code) {
  try {
    yaml.load(code, { schema: yaml.CORE_SCHEMA, json: false });
    return { ok: true, errors: [] };
  } catch (err) {
    const line = err?.mark?.line != null ? err.mark.line + 1 : 1;
    const column = err?.mark?.column != null ? err.mark.column + 1 : undefined;
    return { ok: false, errors: [{ line, column, message: err.message ?? String(err) }] };
  }
}
