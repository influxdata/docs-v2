// Matches h2 version headings in any of these forms:
//   ## [0.19.0] - 2026-04-23
//   ## 0.19.0 - 2026-04-23
//   ## [0.19.0] (2026-04-23)
//   ## v0.19.0 - 2026-04-23
// Captures: 1 = version (no leading v), 2 = date (YYYY-MM-DD).
const VERSION_HEADING_RE =
  /^##\s+v?\[?(\d+\.\d+\.\d+(?:[-+][\w.]+)?)\]?\s*[-(\s]+\s*(\d{4}-\d{2}-\d{2})\)?\s*$/;

export function transformChangelog(rawChangelog) {
  const lines = rawChangelog.split('\n');
  const outLines = [];

  for (const line of lines) {
    const match = line.match(VERSION_HEADING_RE);
    if (match) {
      const [, version, date] = match;
      outLines.push(`## v${version} {date="${date}"}`);
    } else {
      outLines.push(line);
    }
  }

  return { body: outLines.join('\n') };
}
