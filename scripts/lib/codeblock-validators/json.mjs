function positionToLine(source, position) {
  if (typeof position !== 'number' || position < 0) return 1;
  let line = 1;
  for (let i = 0; i < position && i < source.length; i++) {
    if (source[i] === '\n') line++;
  }
  return line;
}

function parseOne(code) {
  try {
    JSON.parse(code);
    return null;
  } catch (err) {
    const msg = err.message ?? String(err);
    const lineMatch = msg.match(/line (\d+)/);
    const posMatch = msg.match(/position (\d+)/);
    let line = 1;
    if (lineMatch) line = Number(lineMatch[1]);
    else if (posMatch) line = positionToLine(code, Number(posMatch[1]));
    return { line, message: msg };
  }
}

export function validate(code, { jsonl = false } = {}) {
  if (!jsonl) {
    const e = parseOne(code);
    return e ? { ok: false, errors: [e] } : { ok: true, errors: [] };
  }
  const errors = [];
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const e = parseOne(line);
    if (e) errors.push({ line: i + 1, message: e.message });
  }
  return { ok: errors.length === 0, errors };
}
