---
title: influx export
description: The `influx export` command exports existing resources as an InfluxDB template.
menu:
  v2_0_ref:
    parent: influx
weight: 101
aliases:
  - /v2.0/reference/cli/influx/pkg/export/
  - /v2.0/reference/cli/influx/export/
related:
  - /influxdb/v2.0/influxdb-templates/create/
---

The `influx export` command exports existing resources as an InfluxDB template.
_For detailed examples of exporting InfluxDB templates, see
[Create an InfluxDB template](/v2.0/influxdb-templates/create/)._

## Usage
```
influx export [flags]
influx export [command]
```

## Available subcommands
| Subcommand                                        | Description                                                |
|:----------                                        |:-----------                                                |
| [all](/v2.0/reference/cli/influx/export/all/)     | Export all resources in an organization as a template      |
| [stack](/v2.0/reference/cli/influx/export/stack/) | Export all resources associated with a stack as a template |

## Flags

| Flag |                      | Description                                                                      | Input Type | {{< cli/mapped >}}   |
|:---- |:---                  |:-----------                                                                      |:---------- |:------------------   |
|      | `--buckets`          | Comma-separated list of bucket IDs                                               | string     |                      |
|      | `--checks`           | Comma-separated list of check IDs                                                | string     |                      |
|      | `--configs-path`     | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)            | string     |`INFLUX_CONFIGS_PATH` |
|      | `--dashboards`       | Comma-separated list of dashboard IDs                                            | string     |                      |
|      | `--endpoints`        | Comma-separated list of notification endpoint IDs                                | string     |                      |
| `-f` | `--file`             | Template output file. Defaults to stdout. Use `.yml` or `.json` file extensions. | string     |                      |
| `-h` | `--help`             | Help for the `export` command                                                    |            |                      |
|      | `--host`             | HTTP address of InfluxDB (default `http://localhost:9999`)                       | string     | `INFLUX_HOST`        |
|      | `--labels`           | Comma-separated list of label IDs                                                | string     |                      |
|      | `--resource-type`    | Resource type associated with all IDs via stdin                                  | string     |                      |
|      | `--rules`            | Comma-separated list of notification rule IDs                                    | string     |                      |
|      | `--skip-verify`      | Skip TLS certificate verification                                                |            |                      |
|      | `--stack-id`         | Stack ID to include resources from in export                                     | string     |                      |
|      | `--tasks`            | Comma-separated list of task IDs                                                 | string     |                      |
|      | `--telegraf-configs` | Comma-separated list of Telegraf configuration IDs                               | string     |                      |
| `-t` | `--token`            | Authentication token                                                             | string     | `INFLUX_TOKEN`       |
|      | `--variables`        | Comma-separated list of variable IDs                                             | string     |                      |

## Examples
```sh
# Export buckets by ID
influx export --buckets=$ID1,$ID2,$ID3

# Export buckets, labels, and dashboards by ID
influx export \
  --buckets=$BID1,$BID2,$BID3 \
  --labels=$LID1,$LID2,$LID3 \
  --dashboards=$DID1,$DID2,$DID3

# Export all resources associated with a stack
influx export --stack-id $STACK_ID

# Export resources associated with a stack and resources
# *not* associated with the stack
influx export --stack-id $STACK_ID --buckets $BUCKET_ID
```
