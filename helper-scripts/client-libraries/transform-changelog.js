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

// Section headings collapsed to a single bullet in the synced release notes.
// Upstream CHANGELOGs include maintenance sections (for example `### CI`)
// whose individual items are noise for docs readers, but dropping the
// section entirely can leave a release with no visible content at all —
// which reads as "the sync forgot this release" rather than "this release
// was maintenance-only". Instead, each matching heading (and everything
// under it: list items, paragraph text, nested subheadings) is collapsed to
// one bullet, `- <replacement>`, in place of the section. Matching is
// case-insensitive and tolerates leading `#` markers, so `'CI'` and
// `'### CI'` both match a `### CI` heading.
export const DEFAULT_EXCLUDE_HEADINGS = ['CI'];

function normalizeLine(line) {
  // Avoid trailing whitespace diffs and markdown-formatters drifting output.
  return line.replace(/[\t ]+$/g, '');
}

// Returns the ATX heading level (number of leading `#`) for a heading line,
// or null when the line is not a heading.
function getHeadingLevel(line) {
  const match = line.match(/^(#{1,6})\s/);
  return match ? match[1].length : null;
}

// Normalizes a heading label (from an exclude entry or a heading line) to a
// comparison key: strips leading `#` markers and surrounding whitespace,
// then lowercases.
function normalizeHeadingKey(value) {
  return String(value).replace(/^#+/, '').trim().toLowerCase();
}

// Builds a lookup from normalized heading key to replacement bullet text.
// Entries may be plain strings (heading label; replacement defaults to
// `<label> updates`) or `{ heading, replacement }` objects for a custom
// bullet.
function buildExcludeMap(excludeHeadings) {
  const map = new Map();
  for (const entry of excludeHeadings) {
    const heading = typeof entry === 'string' ? entry : entry.heading;
    const label = heading.replace(/^#+/, '').trim();
    const replacement =
      typeof entry === 'string'
        ? `${label} updates`
        : (entry.replacement ?? `${label} updates`);
    const key = normalizeHeadingKey(heading);
    if (key) map.set(key, replacement);
  }
  return map;
}

function isUnreleasedHeading(line) {
  return (
    UNRELEASED_HEADING_RE.test(line) || UNRELEASED_VERSION_HEADING_RE.test(line)
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

export function transformChangelog(rawChangelog, meta, options = {}) {
  const excludeHeadings = options.excludeHeadings ?? DEFAULT_EXCLUDE_HEADINGS;
  const excludeMap = buildExcludeMap(excludeHeadings);

  const lines = rawChangelog.split('\n');
  const outLines = [];

  let skippingUnreleased = false;
  let skippingExcluded = false;
  let excludedLevel = 0;
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

    if (skippingExcluded) {
      const level = getHeadingLevel(line);
      // A heading at the same or higher level (fewer or equal `#`) ends the
      // excluded section; deeper headings and body text stay collapsed into
      // the replacement bullet already emitted.
      if (level !== null && level <= excludedLevel) {
        skippingExcluded = false;
        // The replacement bullet isn't a heading, so restore the blank-line
        // separator markdown expects before the next heading.
        if (outLines[outLines.length - 1] !== '') {
          outLines.push('');
        }
      } else {
        continue;
      }
    }

    if (isUnreleasedHeading(line)) {
      skippingUnreleased = true;
      continue;
    }

    const headingLevel = getHeadingLevel(line);
    const replacement =
      headingLevel !== null ? excludeMap.get(normalizeHeadingKey(line)) : null;
    if (replacement) {
      outLines.push(`- ${replacement}`);
      skippingExcluded = true;
      excludedLevel = headingLevel;
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
