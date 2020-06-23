---
title: influx template
description: The `influx template` command summarizes the specified InfluxDB template.
menu:
  v2_0_ref:
    name: influx template
    parent: influx
weight: 101
v2.0/tags: [templates]
aliases:
  - /v2.0/reference/cli/influx/pkg/summary/
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
| [validate](/v2.0/reference/cli/influx/template/validate) | Validate a template |

## Flags
| Flag |                           | Description                                                        | Input Type | {{< cli/mapped >}}   |
|:---- |:---                       |:-----------                                                        |:---------- |:------------------   |
| `-c` | `--disable-color`         | Disable color in output                                            |            |                      |
|      | `--disable-table-borders` | Disable table borders                                              |            |                      |
| `-e` | `--encoding`              | Encoding of the input stream                                       | string     |                      |
| `-f` | `--file`                  | Template file to summarize                                         | string     |                      |
| `-h` | `--help`                  | Help for the `template` command                                    |            |                      |
|      | `--json`                  | Output data as JSON (default `false`)                              |            | `INFLUX_OUTPUT_JSON` |
| `-R` | `--recurse`               | Recurse through files in the directory specified in `-f`, `--file` |            |                      |
| `-u` | `--template-url`          | URL of template file to summarize                                  | string     |                      |

{{% cli/influx-global-flags %}}
