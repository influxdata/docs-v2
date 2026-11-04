/**
 * Discover official plugins from the influxdb3_plugins registry index.
 */

const REGISTRY_INDEX_URL =
  'https://github.com/influxdata/influxdb3_plugins/releases/download/registry/index.json';

export async function fetchRegistryIndex(
  url = REGISTRY_INDEX_URL,
  { fetchImpl = fetch } = {}
) {
  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(
      `Fetching registry index failed: ${response.status} ${response.statusText} (${url})`
    );
  }
  return response.json();
}

export function parseRegistryIndex(
  indexJson,
  mappingConfig = { overrides: {}, exclude: [] }
) {
  const { overrides, exclude } = mappingConfig;

  const latestByName = new Map();
  const activeNames = new Set();
  for (const entry of indexJson.plugins) {
    // Retirement requires explicit confirmation from every published version.
    if (entry.yanked !== true) activeNames.add(entry.name);
    const existing = latestByName.get(entry.name);
    if (!existing || entry.published_at > existing.published_at) {
      latestByName.set(entry.name, entry);
    }
  }

  const excluded = [...latestByName.keys()].filter((name) =>
    exclude.includes(name)
  );

  const discovered = [...latestByName.values()]
    .filter((entry) => !exclude.includes(entry.name))
    .map((entry) => {
      const slug = entry.name.replaceAll('_', '-');
      const stubSlug = overrides[entry.name]?.stub_slug ?? slug;
      return { ...entry, slug, stubSlug };
    });

  return {
    plugins: discovered.filter((plugin) => activeNames.has(plugin.name)),
    retired: discovered.filter((plugin) => !activeNames.has(plugin.name)),
    excluded,
  };
}

export function partitionDiscoveredPlugins(discoveredPlugins, mappedNames) {
  const mappedSet = new Set(mappedNames);
  return {
    mapped: discoveredPlugins.filter((plugin) => mappedSet.has(plugin.name)),
    unmapped: discoveredPlugins.filter((plugin) => !mappedSet.has(plugin.name)),
  };
}
