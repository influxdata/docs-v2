/**
 * Default configuration for docs CLI commands
 *
 * Repository keys match product keys in data/products.yml
 * Private repository URLs/paths should NOT be added here - users configure those locally.
 */

export const DEFAULT_CONFIG = {
  // Repository definitions
  // Keys align with data/products.yml product keys
  repositories: {
    // InfluxDB 3 products
    influxdb3_core: {
      url: 'https://github.com/influxdata/influxdb',
      description: 'InfluxDB 3 Core',
    },
    influxdb3_enterprise: {
      // Private repository - users configure path locally
      description: 'InfluxDB 3 Enterprise',
    },
    influxdb3_cloud_serverless: {
      description: 'InfluxDB Cloud Serverless',
    },
    influxdb3_cloud_dedicated: {
      description: 'InfluxDB Cloud Dedicated',
    },
    influxdb3_clustered: {
      description: 'InfluxDB Clustered',
    },
    influxdb3_explorer: {
      description: 'InfluxDB 3 Explorer',
    },

    // InfluxDB OSS (v1/v2)
    influxdb: {
      url: 'https://github.com/influxdata/influxdb',
      description: 'InfluxDB OSS (v1/v2)',
    },
    influxdb_cloud: {
      description: 'InfluxDB Cloud (TSM)',
    },

    // Telegraf
    telegraf: {
      url: 'https://github.com/influxdata/telegraf',
      description: 'Telegraf',
    },
    telegraf_controller: {
      description: 'Telegraf Controller',
    },

    // Other tools
    chronograf: {
      url: 'https://github.com/influxdata/chronograf',
      description: 'Chronograf',
    },
    kapacitor: {
      url: 'https://github.com/influxdata/kapacitor',
      description: 'Kapacitor',
    },
    enterprise_influxdb: {
      description: 'InfluxDB Enterprise v1',
    },
    flux: {
      url: 'https://github.com/influxdata/flux',
      description: 'Flux',
    },

    // Plugins and extensions
    influxdb3_plugins: {
      url: 'https://github.com/influxdata/influxdb3_plugins',
      description: 'InfluxDB 3 processing engine plugins',
    },

    // CLI and client libraries
    influx_cli: {
      url: 'https://github.com/influxdata/influx-cli',
      description: 'InfluxDB CLI',
    },
    influxdb3_python: {
      url: 'https://github.com/influxdata/influxdb3-python',
      description: 'Python client for InfluxDB 3',
    },
    influxdb3_go: {
      url: 'https://github.com/influxdata/influxdb3-go',
      description: 'Go client for InfluxDB 3',
    },
    influxdb_client_js: {
      url: 'https://github.com/influxdata/influxdb-client-js',
      description: 'JavaScript client library',
    },

    // Documentation
    docs_v2: {
      url: 'https://github.com/influxdata/docs-v2',
      description: 'Official InfluxData documentation',
    },
  },

  // Release notes configuration
  releaseNotes: {
    // Output format: 'integrated' (single list) or 'separated' (by repo)
    outputFormat: 'integrated',

    // Include PR links in commit messages
    // Note: Release notes for private repos won't contain PR links
    includePrLinks: true,

    // Primary repository for release notes (when using separated format)
    primaryRepo: 'influxdb3_core',

    // Template settings for separated format
    separatedTemplate: {
      primaryLabel: 'Core Changes',
      secondaryLabel: 'Additional Changes',
      secondaryIntro:
        'All core updates are included above. Additional repository-specific changes:',
    },
  },

  // Editor configuration
  editor: {
    // Default editor (overridden by VISUAL, EDITOR env vars, or --editor flag)
    default: null,

    // Whether to wait for editor to close by default
    wait: false,
  },

  // Content scaffolding defaults
  scaffolding: {
    // Default AI tool for scaffolding
    ai: 'claude',

    // Whether to follow external links by default
    followExternal: false,
  },
};
