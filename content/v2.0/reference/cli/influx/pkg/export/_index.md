---
title: influx pkg export
description: The 'influx pkg' command exports existing resources as an InfluxDB template.
menu:
  v2_0_ref:
    parent: influx pkg
weight: 101
related:
  - /v2.0/influxdb-templates/create/
---

The `influx pkg export` command exports existing resources as an InfluxDB template.
_For detailed examples of exporting InfluxDB templates, see
[Create an InfluxDB template](/v2.0/influxdb-templates/create/)._

## Usage
```
influx pkg export [flags]
influx pkg export [command]
```

## Available subcommands
| Subcommand                                        | Description                                           |
|:----------                                        |:-----------                                           |
| [all](/v2.0/reference/cli/influx/pkg/export/all/) | Export all resources in an organization as a template |

## Flags

| Flag                 | Description                                                                      | Input Type |
|:----                 |:-----------                                                                      |:---------- |
| `--buckets`          | Comma-separated list of bucket IDs                                               | string     |
| `--checks`           | Comma-separated list of check IDs                                                | string     |
| `--dashboards`       | Comma-separated list of dashboard IDs                                            | string     |
| `--endpoints`        | Comma-separated list of notification endpoint IDs                                | string     |
| `-f`, `--file`       | Template output file. Defaults to stdout. Use `.yml` or `.json` file extensions. | string     |
| `-h`, `--help`       | Help for the `export` command                                                    |            |
| `--labels`           | Comma-separated list of label IDs                                                | string     |
| `--resource-type`    | Resource type associated with all IDs via stdin                                  | string     |
| `--rules`            | Comma-separated list of notification rule IDs                                    | string     |
| `--tasks`            | Comma-separated list of task IDs                                                 | string     |
| `--telegraf-configs` | Comma-separated list of Telegraf configuration IDs                               | string     |
| `--variables`        | Comma-separated list of variable IDs                                             | string     |

{{% cli/influx-global-flags %}}
