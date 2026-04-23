// Single source of truth for the v3 client libraries synced by this tooling.
// Each entry describes one upstream client repo and the corresponding output
// path inside content/shared/.

export const CLIENTS = [
  {
    slug: 'python',
    displayName: 'influxdb3-python',
    language: 'Python',
    repo: 'InfluxCommunity/influxdb3-python',
    sourceFile: 'CHANGELOG.md',
    outputPath:
      'content/shared/influxdb-client-libraries-reference/v3/release-notes/python.md',
  },
  {
    slug: 'go',
    displayName: 'influxdb3-go',
    language: 'Go',
    repo: 'InfluxCommunity/influxdb3-go',
    sourceFile: 'CHANGELOG.md',
    outputPath:
      'content/shared/influxdb-client-libraries-reference/v3/release-notes/go.md',
  },
  {
    slug: 'javascript',
    displayName: 'influxdb3-js',
    language: 'JavaScript',
    repo: 'InfluxCommunity/influxdb3-js',
    sourceFile: 'CHANGELOG.md',
    outputPath:
      'content/shared/influxdb-client-libraries-reference/v3/release-notes/javascript.md',
  },
  {
    slug: 'csharp',
    displayName: 'influxdb3-csharp',
    language: 'C#',
    repo: 'InfluxCommunity/influxdb3-csharp',
    sourceFile: 'CHANGELOG.md',
    outputPath:
      'content/shared/influxdb-client-libraries-reference/v3/release-notes/csharp.md',
  },
  {
    slug: 'java',
    displayName: 'influxdb3-java',
    language: 'Java',
    repo: 'InfluxCommunity/influxdb3-java',
    sourceFile: 'CHANGELOG.md',
    outputPath:
      'content/shared/influxdb-client-libraries-reference/v3/release-notes/java.md',
  },
];

export function getClient(slug) {
  const client = CLIENTS.find((c) => c.slug === slug);
  if (!client) {
    throw new Error(
      `Unknown client slug: ${slug}. Valid slugs: ${CLIENTS.map((c) => c.slug).join(', ')}`
    );
  }
  return client;
}
