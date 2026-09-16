import fs from 'fs';
import path from 'path';

export const ROOT_AGENTS_LIMIT = 120;
export const INSTRUCTION_LIMIT = 100;
export const SKILL_LIMIT = 160;

export function lineCount(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  if (!text) return 0;
  return text.endsWith('\n')
    ? text.split('\n').length - 1
    : text.split('\n').length;
}

export function lineLimitError(filePath, limit, root = process.cwd()) {
  const count = lineCount(filePath);
  return count > limit
    ? `${path.relative(root, filePath)} has ${count} lines; limit is ${limit}`
    : null;
}
