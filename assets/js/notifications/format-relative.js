/*
  Relative-time formatting for notification cards. Pure (no DOM) so it is
  unit-tested with `node --test`. `now` is injectable for deterministic tests;
  callers in the browser omit it.
*/

export function formatRelative(iso, now = Date.now()) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diffSec = Math.round((now - then) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86_400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 172_800) return 'Yesterday';
  if (diffSec < 604_800) return `${Math.floor(diffSec / 86_400)} days ago`;
  return new Date(then).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}
