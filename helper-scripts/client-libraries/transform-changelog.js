const VERSION_HEADING_RE =
  /^##\s+v?\[?(\d+\.\d+\.\d+(?:[-+][\w.]+)?)\]?\s*[-(\s]+\s*(\d{4}-\d{2}-\d{2})\)?\s*$/;
const UNRELEASED_HEADING_RE = /^##\s+\[?Unreleased\]?\s*$/i;
const CHANGELOG_H1_RE = /^#\s+Changelog\s*$/i;
const ANY_H2_RE = /^##\s+/;

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
      if (ANY_H2_RE.test(line) && !UNRELEASED_HEADING_RE.test(line)) {
        skippingUnreleased = false;
      } else {
        continue;
      }
    }

    if (UNRELEASED_HEADING_RE.test(line)) {
      skippingUnreleased = true;
      continue;
    }

    const match = line.match(VERSION_HEADING_RE);
    if (match) {
      const [, version, date] = match;
      if (latestVersion === null) {
        latestVersion = version;
        latestReleaseDate = date;
      }
      outLines.push(`## v${version} {date="${date}"}`);
    } else {
      outLines.push(line);
    }
  }

  const body = outLines.join('\n');
  const result = { body, latestVersion, latestReleaseDate };

  if (meta) {
    result.page = renderPage(body, { ...meta, latestVersion, latestReleaseDate });
  }

  return result;
}

function renderPage(body, meta) {
  const frontmatter = [
    '---',
    `title: ${meta.displayName} release notes`,
    `description: Release notes for the ${meta.displayName} ${meta.language} client library for InfluxDB 3.`,
    meta.latestVersion !== null ? `latest_version: ${meta.latestVersion}` : null,
    meta.latestReleaseDate !== null
      ? `latest_release_date: ${meta.latestReleaseDate}`
      : null,
    `source_repo: https://github.com/${meta.repo}`,
    `source_file: CHANGELOG.md`,
    `generated: true`,
    '---',
  ]
    .filter((line) => line !== null)
    .join('\n');

  const comment =
    '<!-- Generated from CHANGELOG.md. Edit upstream and re-sync; do not edit here. -->';

  return `${frontmatter}\n\n${comment}\n\n${body.trimStart()}`;
}
