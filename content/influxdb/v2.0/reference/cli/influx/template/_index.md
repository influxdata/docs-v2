---
title: influx template
description: The `influx template` command summarizes the specified InfluxDB template.
menu:
  influxdb_2_0_ref:
    name: influx template
    parent: influx
weight: 101
influxdb/v2.0/tags: [templates]
aliases:
  - /influxdb/v2.0/reference/cli/influx/pkg/summary/
---

The `influx template` command summarizes the specified InfluxDB template.

## Usage
```
influx template [flags]
influx template [command]
```

## Subcommands
| Subcommand                                               | Description         |
|:----------                                               |:-----------         |
| [validate](/influxdb/v2.0/reference/cli/influx/template/validate) | Validate a template |

## Flags
| Flag |                           | Description                                                        | Input Type | {{< cli/mapped >}}   |
|:---- |:---                       |:-----------                                                        |:---------- |:------------------   |
| `-c` | `--disable-color`         | Disable color in output                                            |            |                      |
|      | `--disable-table-borders` | Disable table borders                                              |            |                      |
| `-e` | `--encoding`              | Encoding of the input stream                                       | string     |                      |
| `-f` | `--file`                  | Path to template file (supports HTTP(S) URLs or file paths)        | string     |                      |
| `-h` | `--help`                  | Help for the `template` command                                    |            |                      |
|      | `--json`                  | Output data as JSON (default `false`)                              |            | `INFLUX_OUTPUT_JSON` |
| `-R` | `--recurse`               | Recurse through files in the directory specified in `-f`, `--file` |            |                      |
