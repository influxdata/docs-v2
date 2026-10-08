const INT64_MIN = -(1n << 63n);
const INT64_MAX = (1n << 63n) - 1n;
const UINT64_MAX = (1n << 64n) - 1n;

function fail(message) {
  throw new Error(message);
}

function splitUnescaped(value, delimiter, { quotes = false } = {}) {
  const parts = [];
  let start = 0;
  let escaped = false;
  let quoted = false;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    if (quotes && char === '"') {
      quoted = !quoted;
      continue;
    }
    if (!quoted && char === delimiter) {
      parts.push(value.slice(start, i));
      start = i + 1;
    }
  }
  if (escaped) fail('dangling escape');
  if (quoted) fail('unterminated string');
  parts.push(value.slice(start));
  return parts;
}

function pointTokens(line) {
  const tokens = [];
  let start = -1;
  let escaped = false;
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\') {
      if (start < 0) fail('unexpected escape before measurement');
      escaped = true;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (!quoted && /[ \t]/.test(char)) {
      if (start >= 0) {
        tokens.push(line.slice(start, i));
        start = -1;
      }
      continue;
    }
    if (start < 0) start = i;
  }
  if (escaped) fail('dangling escape');
  if (quoted) fail('unterminated string');
  if (start >= 0) tokens.push(line.slice(start));
  return tokens;
}

function firstUnescaped(value, needle) {
  let escaped = false;
  for (let i = 0; i <= value.length - needle.length; i++) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (value[i] === '\\') {
      escaped = true;
      continue;
    }
    if (value.startsWith(needle, i)) return i;
  }
  return -1;
}

function requireNonempty(value, name) {
  if (!value) fail(`missing ${name}`);
}

function validateEscapes(value) {
  // The scanner intentionally permits every escaped character: line protocol
  // accepts escaped separators and retaining unknown escapes avoids rewriting
  // documented identifiers. It still rejects a trailing escape.
  const trailing = value.match(/\\+$/)?.[0].length ?? 0;
  if (trailing % 2 === 1) fail('dangling escape');
}

function validateKey(key, type) {
  requireNonempty(key, `${type} key`);
  validateEscapes(key);
}

function validateAssignment(part, type) {
  const equals = firstUnescaped(part, '=');
  if (equals < 0) fail(`missing ${type} value`);
  if (firstUnescaped(part.slice(equals + 1), '=') >= 0 && type === 'tag') {
    // Equals signs in values must be escaped. This catches separator mistakes
    // without changing the field value grammar, where strings can contain =.
    fail('invalid tag separator');
  }
  const key = part.slice(0, equals);
  const value = part.slice(equals + 1);
  validateKey(key, type);
  requireNonempty(value, `${type} value`);
  validateEscapes(value);
  return { key, value };
}

function validateFieldKey(key) {
  validateKey(key, 'field');
  const delimiter = firstUnescaped(key, '::');
  if (delimiter < 0) return;
  requireNonempty(key.slice(0, delimiter), 'field family');
  requireNonempty(key.slice(delimiter + 2), 'field name');
}

function validateString(value) {
  if (!value.startsWith('"')) return false;
  if (value.length < 2 || !value.endsWith('"')) fail('unterminated string');
  let escaped = false;
  for (let i = 1; i < value.length - 1; i++) {
    if (escaped) {
      escaped = false;
    } else if (value[i] === '\\') {
      escaped = true;
    } else if (value[i] === '"') {
      fail('unescaped quote in string');
    }
  }
  if (escaped) fail('dangling escape');
  return true;
}

function boundedInteger(value, suffix, min, max, label) {
  const raw = suffix ? value.slice(0, -suffix.length) : value;
  if (!/^[+-]?\d+$/.test(raw)) return false;
  const number = BigInt(raw);
  if (number < min || number > max) fail(`${label} is out of range`);
  return true;
}

function validateFieldValue(value) {
  if (validateString(value)) return;
  if (/^(?:true|false|t|f|TRUE|FALSE|T|F)$/.test(value)) return;
  if (value.endsWith('i') && boundedInteger(value, 'i', INT64_MIN, INT64_MAX, 'integer field')) return;
  if (value.endsWith('u') && boundedInteger(value, 'u', 0n, UINT64_MAX, 'unsigned integer field')) return;
  // An unsuffixed numeric value is a float, including a whole number.
  if (/^[+-]?(?:(?:\d+\.\d*|\d*\.\d+)(?:[eE][+-]?\d+)?|\d+(?:[eE][+-]?\d+)?)$/.test(value)) return;
  fail('invalid field value');
}

function validateLine(line) {
  if (!line || line.startsWith('#')) return;
  const tokens = pointTokens(line);
  if (tokens.length < 2) fail('point requires a measurement and fields');
  if (tokens.length > 3) fail('extra timestamp tokens');

  const [measurementAndTags, fields, timestamp] = tokens;
  const measurementParts = splitUnescaped(measurementAndTags, ',');
  requireNonempty(measurementParts.shift(), 'measurement');
  for (const tag of measurementParts) validateAssignment(tag, 'tag');

  const fieldParts = splitUnescaped(fields, ',', { quotes: true });
  if (!fieldParts.length) fail('missing fields');
  for (const field of fieldParts) {
    const assignment = validateAssignment(field, 'field');
    validateFieldKey(assignment.key);
    validateFieldValue(assignment.value);
  }

  if (timestamp != null) {
    if (!boundedInteger(timestamp, '', INT64_MIN, INT64_MAX, 'timestamp')) {
      fail('timestamp must be a signed integer');
    }
  }
}

/** Validate InfluxDB line protocol, including qualified field keys. */
export function validate(code) {
  const errors = [];
  for (const [index, line] of code.split('\n').entries()) {
    if (!line) continue;
    try {
      validateLine(line);
    } catch (error) {
      errors.push({ line: index + 1, message: error.message ?? String(error) });
    }
  }
  return { ok: errors.length === 0, errors };
}
