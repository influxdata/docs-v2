/**
 * Map discovered registry plugins into data/influxdb3_plugins.yml records.
 */

import yaml from 'js-yaml';

const TRIGGER_LABELS = {
  process_scheduled_call: 'scheduled',
  process_writes: 'data-write',
  process_request: 'HTTP request',
};

export function mapEntry(plugin) {
  const tags = plugin.triggers.map((trigger) => TRIGGER_LABELS[trigger]);
  return {
    name: plugin.name,
    id: plugin.stubSlug,
    description: plugin.description,
    tags,
    introduced: `v${plugin.version}`,
    database_version: plugin.dependencies.database_version,
    repository: plugin.repository,
  };
}

export function renderPluginDataYaml(entries) {
  const sorted = [...entries].sort((a, b) => a.name.localeCompare(b.name));
  return yaml.dump(sorted, { sortKeys: false, lineWidth: -1 });
}
