---
title: influx server-config
description: The `influx server-config` command displays the runtime server configuration.
menu:
  influxdb_v2:
    name: influx server-config
    parent: influx
weight: 101
influxdb/v2/tags: [config]
cascade:
  related:
    - /influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
    - /influxdb/v2/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
  metadata: [influx CLI 2.3.0+, InfluxDB 2.0.0+]
aliases:
  - /influxdb/v2/reference/cli/influxd/print-config/
---

The `influx server-config` command displays the InfluxDB runtime [server configuration](/influxdb/v2/reference/config-options/).

{{% note %}}
To display the server configuration, you must use an [operator token](/influxdb/v2/security/tokens/#operator-token).
{{% /note %}}

## Usage
```
influx server-config [flags]
influx server-config [command]
```

## Examples
```sh
# Show the server configuration.
influx server-config

# Show the server configuration as YAML.
influx server-config --yaml
```

## Flags
| Flag |          | Description                   |
|:---- |:---      |:-----------                   |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `list` command                                           |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers                          | string     |                       |
| `-i` | `--id`            | Organization ID                                                       | string     | `INFLUX_ORG`          |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`          | Organization name                                                     | string     | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |
|      | `--toml` | Output configuration as TOML instead of JSON |
|      | `--yaml` | Output configuration as YAML instead of JSON |
