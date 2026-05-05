import yaml from 'js-yaml';

export function validate(code) {
  try {
    // loadAll handles both single documents and YAML streams (multiple
    // documents separated by `---`). Single-doc inputs are treated as a
    // stream of one — same parse outcome, no behavior change for existing
    // valid YAML. Kubernetes manifests, Hugo template manifests, and
    // similar tools commonly emit multi-document streams; rejecting them
    // would force authors to relabel the fence and lose syntax highlighting.
    yaml.loadAll(code, null, { schema: yaml.CORE_SCHEMA, json: false });
    return { ok: true, errors: [] };
  } catch (err) {
    const line = err?.mark?.line != null ? err.mark.line + 1 : 1;
    const column = err?.mark?.column != null ? err.mark.column + 1 : undefined;
    return { ok: false, errors: [{ line, column, message: err.message ?? String(err) }] };
  }
}
