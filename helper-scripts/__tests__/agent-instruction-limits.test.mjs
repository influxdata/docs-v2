import assert from 'assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import test from 'node:test';
import {
  INSTRUCTION_LIMIT,
  lineLimitError,
  ROOT_AGENTS_LIMIT,
  SKILL_LIMIT,
} from '../agent-instruction-limits.js';

function fixture(lines) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-limits-'));
  const file = path.join(directory, 'fixture.md');
  fs.writeFileSync(
    file,
    `${Array.from({ length: lines }, () => 'line').join('\n')}\n`
  );
  return { directory, file };
}
test('reports each canonical line-limit class', () => {
  for (const limit of [ROOT_AGENTS_LIMIT, INSTRUCTION_LIMIT, SKILL_LIMIT]) {
    const { directory, file } = fixture(limit + 1);
    assert.match(
      lineLimitError(file, limit, directory),
      new RegExp(`has ${limit + 1} lines; limit is ${limit}`)
    );
  }
});
test('does not apply entrypoint limits to a reference file', () => {
  const { directory, file } = fixture(SKILL_LIMIT + 50);
  assert.equal(lineLimitError(file, Infinity, directory), null);
});
