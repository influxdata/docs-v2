import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatRelative } from '../../assets/js/notifications/format-relative.js';

const now = Date.UTC(2026, 0, 15, 12, 0, 0);
const iso = (msAgo) => new Date(now - msAgo).toISOString();

test('under a minute = Just now', () => {
  assert.equal(formatRelative(iso(30_000), now), 'Just now');
});
test('minutes', () => {
  assert.equal(formatRelative(iso(5 * 60_000), now), '5m ago');
});
test('hours', () => {
  assert.equal(formatRelative(iso(3 * 3_600_000), now), '3h ago');
});
test('yesterday', () => {
  assert.equal(formatRelative(iso(30 * 3_600_000), now), 'Yesterday');
});
test('days', () => {
  assert.equal(formatRelative(iso(3 * 86_400_000), now), '3 days ago');
});
test('over a week = short date', () => {
  const out = formatRelative(iso(10 * 86_400_000), now);
  assert.match(out, /Jan\s5/);
});
test('missing input returns empty string', () => {
  assert.equal(formatRelative(undefined, now), '');
  assert.equal(formatRelative(null, now), '');
});
