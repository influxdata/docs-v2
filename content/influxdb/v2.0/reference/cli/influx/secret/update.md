---
title: influx secret update
description: The `influx secret update` command adds and updates secrets.
menu:
  influxdb_2_0_ref:
    name: influx secret update
    parent: influx secret
weight: 101
influxdb/v2.0/tags: [secrets]
---

The `influx secret update` command adds and updates secrets.
Provide the secret key with the `-k` or `--key` flag.
You may also provide the secret value with the `-v` or `--value` flag.
If you do not provide the secret value with the `-v` or `--value` flag,
enter the value when prompted.

{{% warn %}}
Providing a secret value with the `-v` or `--value` flag may expose the secret
in your command history.
{{% /warn %}}

## Usage
```
influx secret update [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:---- |:---               |:-----------                                                           |:----------:|:------------------    |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`          | Help for the `update` command                                         |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-k` | `--key`           | ({{< req >}}) Secret key                                              | string     |                       |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                | string     | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                     | string     | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            |                       |
| `-t` | `--token`         | Authentication token                                                  | string     | `INFLUX_TOKEN`        |
| `-v` | `--value`         | ({{< req >}}) Secret value                                            | string     |                       |

## Examples

{{< cli/influx-creds-note >}}

##### Add a secret
```sh
influx secret update \
  --key EXAMPLE_KEY \
  --value EXAMPLE_VALUE
```

##### Update an existing secret
```sh
influx secret update \
  --key EXAMPLE_KEY \
  --value NEW_EXAMPLE_VALUE
```