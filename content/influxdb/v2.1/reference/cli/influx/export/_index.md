---
title: influx export
description: The `influx export` command exports existing resources as an InfluxDB template.
menu:
  influxdb_2_1_ref:
    parent: influx
weight: 101
aliases:
  - /influxdb/v2.1/reference/cli/influx/pkg/export/
related:
  - /influxdb/v2.1/influxdb-templates/create/
  - /influxdb/v2.1/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/v2.1/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
---

The `influx export` command exports existing resources as an InfluxDB template.
_For detailed examples of exporting InfluxDB templates, see
[Create an InfluxDB template](/influxdb/v2.1/influxdb-templates/create/)._

## Usage

```
influx export [flags]
influx export [command]
```

## Available subcommands

| Subcommand                                                 | Description                                                |
|:----------                                                 |:-----------                                                |
| [all](/influxdb/v2.1/reference/cli/influx/export/all/)     | Export all resources in an organization as a template      |
| [stack](/influxdb/v2.1/reference/cli/influx/export/stack/) | Export all resources associated with a stack as a template |

## Flags

| Flag |                           | Description                                                                      | Input Type | {{< cli/mapped >}}    |
|:-----|:--------------------------|:---------------------------------------------------------------------------------|:-----------|:----------------------|
| `-c` | `--active-config`         | CLI configuration to use for command                                             | string     |                       |
|      | `--bucket-names`          | Comma-separated list of bucket names                                             | string     |                       |
|      | `--buckets`               | Comma-separated list of bucket IDs                                               | string     |                       |
|      | `--check-names`           | Comma-separated list of check names                                              | string     |                       |
|      | `--checks`                | Comma-separated list of check IDs                                                | string     |                       |
|      | `--configs-path`          | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)            | string     | `INFLUX_CONFIGS_PATH` |
|      | `--dashboard-names`       | Comma-separated list of dashboard names                                          | string     |                       |
|      | `--dashboards`            | Comma-separated list of dashboard IDs                                            | string     |                       |
|      | `--endpoint-names`        | Comma-separated list of notification endpoint names                              | string     |                       |
|      | `--endpoints`             | Comma-separated list of notification endpoint IDs                                | string     |                       |
| `-f` | `--file`                  | Template output file. Defaults to stdout. Use `.yml` or `.json` file extensions. | string     |                       |
| `-h` | `--help`                  | Help for the `export` command                                                    |            |                       |
|      | `--host`                  | HTTP address of InfluxDB (default `http://localhost:9999`)                       | string     | `INFLUX_HOST`         |
|      | `--http-debug`            | Inspect communication with InfluxDB servers.                                     | string     |                       |
|      | `--label-names`           | Comma-separated list of label names                                              | string     |                       |
|      | `--labels`                | Comma-separated list of label IDs                                                | string     |                       |
|      | `--resource-type`         | Resource type associated with all IDs via stdin                                  | string     |                       |
|      | `--rule-names`            | Comma-separated list of notification rule names                                  | string     |                       |
|      | `--rules`                 | Comma-separated list of notification rule IDs                                    | string     |                       |
|      | `--skip-verify`           | Skip TLS certificate verification                                                |            | `INFLUX_SKIP_VERIFY`  |
|      | `--stack-id`              | Stack ID to include resources from in export                                     | string     |                       |
|      | `--task-names`            | Comma-separated list of task names                                               | string     |                       |
|      | `--tasks`                 | Comma-separated list of task IDs                                                 | string     |                       |
|      | `--telegraf-config-names` | Comma-separated list of Telegraf configuration names                             | string     |                       |
|      | `--telegraf-configs`      | Comma-separated list of Telegraf configuration IDs                               | string     |                       |
| `-t` | `--token`                 | API token                                                                        | string     | `INFLUX_TOKEN`        |
|      | `--variable-names`        | Comma-separated list of variable names                                           | string     |                       |
|      | `--variables`             | Comma-separated list of variable IDs                                             | string     |                       |

## Examples

{{< cli/influx-creds-note >}}

- [Export buckets by ID](#export-buckets-by-id)
- [Export buckets, labels, and dashboards by ID](#export-buckets-labels-and-dashboards-by-id)
- [Export buckets, labels, and dashboards by name](#export-buckets-labels-and-dashboards-by-name)
- [Export all resources associated with a stack](#export-all-resources-associated-with-a-stack)
- [Export resources both associated and not associated with a stack](#export-resources-both-associated-and-not-associated-with-a-stack)

##### Export buckets by ID
```sh
influx export --buckets 0Xx0oox00XXoxxoo1,0Xx0oox00XXoxxoo2
```

##### Export buckets, labels, and dashboards by ID
```sh
influx export \
  --buckets 0Xx0oox00XXoxxoo1,0Xx0oox00XXoxxoo2 \
  --labels o0x0oox0Xxoxx001,o0x0oox0Xxoxx002 \
  --dashboards 0XxXooXoo0xooXo0X1,0XxXooXoo0xooXo0X2
```

##### Export buckets, labels, and dashboards by name
```sh
influx export \
  --bucket-names bucket1,bucket2,bucket3 \
  --label-names label1,label2,label3 \
  --dashboard-names dashboard1,dashboard2,dashboard3
```

##### Export all resources associated with a stack
```sh
influx export --stack-id 0Xx0oox00XXoxxoo1
```

##### Export resources both associated and not associated with a stack
```sh
influx export \
  --stack-id 0Xx0oox00XXoxxoo1 \
  --buckets o0x0oox0Xxoxx001,0XxXooXoo0xooXo0X2 \
  --dashboard-names bucket1
```
