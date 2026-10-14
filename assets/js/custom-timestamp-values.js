const timestampPattern =
  /\b\d{4}-\d{2}-\d{2}(?!\d)|(?<![\w.])\d{10}(?:\d{3}){0,3}(?![\w.])/g;
const secondsPerDay = 86400n;
const millisecondsPerDay = 86400000n;

function timestampValue(token) {
  if (token.includes('-')) {
    const milliseconds = Date.parse(`${token}T00:00:00Z`);
    if (
      !Number.isFinite(milliseconds) ||
      new Date(milliseconds).toISOString().slice(0, 10) !== token
    ) {
      return null;
    }
    return { day: BigInt(milliseconds) / millisecondsPerDay };
  }
  const unitsPerSecond = 10n ** BigInt(token.length - 10);
  const value = BigInt(token);
  return { day: value / unitsPerSecond / secondsPerDay, value, unitsPerSecond };
}

export function timestampDays(text) {
  return Array.from(text.matchAll(timestampPattern))
    .map(([token]) => timestampValue(token)?.day)
    .filter((day) => day !== undefined);
}

// Returns the most common day, so unrelated dates (such as log output) in a
// block don't move the sample data. Ties resolve to the earliest day.
export function sampleDay(days) {
  const counts = new Map();
  days.forEach((day) => counts.set(day, (counts.get(day) || 0) + 1));
  let anchor;
  counts.forEach((count, day) => {
    const best = counts.get(anchor) || 0;
    if (count > best || (count === best && day < anchor)) anchor = day;
  });
  return anchor;
}

export function shiftTimestampText(text, days) {
  return text.replace(timestampPattern, (token) => {
    const timestamp = timestampValue(token);
    if (!timestamp) return token;
    if ('value' in timestamp) {
      return String(
        timestamp.value + days * secondsPerDay * timestamp.unitsPerSecond
      );
    }
    return new Date(Number((timestamp.day + days) * millisecondsPerDay))
      .toISOString()
      .slice(0, 10);
  });
}
