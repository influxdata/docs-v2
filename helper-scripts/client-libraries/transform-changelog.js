const ANY_H2_RE = /^##\s+/;

// Matches common changelog H1 variants.
const CHANGELOG_H1_RE = /^#\s+(?:Changelog|Change\s+Log)\s*$/i;

// Matches common unreleased section headers.
const UNRELEASED_HEADING_RE = /^##\s+\[?Unreleased\]?\s*$/i;
const UNRELEASED_VERSION_HEADING_RE =
  /^##\s+v?\[?(\d+\.\d+\.\d+(?:[-+][\w.]+)?)\]?\s*\[\s*unreleased\s*\]\s*$/i;

// Matches common released version heading variants.
const RELEASE_HEADING_RES = [
  // ## [0.19.0] - 2026-04-23
  // ## 0.19.0 - 2026-04-23
  // ## v0.19.0 - 2026-04-23
  /^##\s+v?\[?(\d+\.\d+\.\d+(?:[-+][\w.]+)?)\]?\s*-\s*(\d{4}-\d{2}-\d{2})\s*$/,
  // ## [0.19.0] (2026-04-23)
  // ## v2.13.0 (2026-02-14)
  /^##\s+v?\[?(\d+\.\d+\.\d+(?:[-+][\w.]+)?)\]?\s*\(\s*(\d{4}-\d{2}-\d{2})\s*\)\s*$/,
  // ## 0.19.0 [2026-04-23]
  // ## v0.19.0 [2026-04-23]
  /^##\s+v?\[?(\d+\.\d+\.\d+(?:[-+][\w.]+)?)\]?\s*\[\s*(\d{4}-\d{2}-\d{2})\s*\]\s*$/,
];

function normalizeLine(line) {
  // Avoid trailing whitespace diffs and markdown-formatters drifting output.
  return line.replace(/[\t ]+$/g, '');
}

function isUnreleasedHeading(line) {
  return (
    UNRELEASED_HEADING_RE.test(line) ||
    UNRELEASED_VERSION_HEADING_RE.test(line)
  );
}

function parseReleaseHeading(line) {
  for (const re of RELEASE_HEADING_RES) {
    const match = line.match(re);
    if (match) {
      const [, version, date] = match;
      return { version, date };
    }
  }
  return null;
}

export function transformChangelog(rawChangelog, meta) {
  const lines = rawChangelog.split('\n');
  const outLines = [];

  let skippingUnreleased = false;
  let seenFirstLine = false;
  let latestVersion = null;
  let latestReleaseDate = null;

  for (const line of lines) {
    if (!seenFirstLine && CHANGELOG_H1_RE.test(line)) {
      seenFirstLine = true;
      continue;
    }
    seenFirstLine = true;

    if (skippingUnreleased) {
      if (ANY_H2_RE.test(line) && !isUnreleasedHeading(line)) {
        skippingUnreleased = false;
      } else {
        continue;
      }
    }

    if (isUnreleasedHeading(line)) {
      skippingUnreleased = true;
      continue;
    }

    const releaseHeading = parseReleaseHeading(line);
    if (releaseHeading) {
      const { version, date } = releaseHeading;
      if (latestVersion === null) {
        latestVersion = version;
        latestReleaseDate = date;
      }
      outLines.push(normalizeLine(`## v${version} {date="${date}"}`));
    } else {
      outLines.push(normalizeLine(line));
    }
  }

  const body = outLines.join('\n');
  const result = { body, latestVersion, latestReleaseDate };

  if (meta) {
    result.page = renderPage(body);
  }

  return result;
}

function renderPage(body) {
  const comment =
    '<!-- Generated from CHANGELOG.md. Edit upstream and re-sync; do not edit here. -->';
  return `${comment}\n\n${body.trimStart()}`;
}
