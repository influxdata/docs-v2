---
title: influx export stack
description: >
  The `influx export stack` command exports all resources associated with a stack as an InfluxDB template.
menu:
  influxdb_2_0_ref:
    parent: influx export
weight: 201
aliases:
  - /influxdb/v2.0/reference/cli/influx/pkg/export/stack
related:
  - /influxdb/v2.0/reference/cli/influx/#patterns-and-conventions, influx CLI patterns and conventions
---

The `influx export stack` command exports all resources associated with a stack as a template.
All `metadata.name` fields remain the same.

## Usage
```
influx export stack <stack_id> [flags]
```

## Flags
| Flag |                   | Description                                                                      | Input Type | {{< cli/mapped >}}   |
|:---- |:---               |:-----------                                                                      |:---------- |:------------------   |
| `-c` | `--active-config` | CLI configuration to use for command                                             | string     |                      |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)            | string     |`INFLUX_CONFIGS_PATH` |
| `-f` | `--file`          | Template output file. Defaults to stdout. Use `.yml` or `.json` file extensions. | string     |                      |
| `-h` | `--help`          | Help for the `export stack` command                                              |            |                      |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)                       | string     | `INFLUX_HOST`        |
| `-o` | `--org`           | Organization name that owns the resources                                        | string     | `INFLUX_ORG`         |
|      | `--org-id`        | Organization ID that owns the resources                                          | string     | `INFLUX_ORG_ID`      |
|      | `--skip-verify`   | Skip TLS certificate verification                                                |            |                      |
| `-t` | `--token`         | Authentication token                                                             | string     | `INFLUX_TOKEN`       |

## Examples

{{< cli/influx-creds-note >}}

##### Export a stack as a template
```sh
influx export stack $STACK_ID
```
