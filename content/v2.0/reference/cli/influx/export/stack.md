---
title: influx export stack
description: >
  The 'influx export stack' command exports all resources associated with a stack as an InfluxDB template.
menu:
  v2_0_ref:
    parent: influx export
weight: 201
aliases:
  - /v2.0/reference/cli/influx/pkg/export/stack
---

The `influx export stack` command exports all resources associated with a stack as a template.
All `metadata.name` fields remain the same.

## Usage
```
influx export stack <stack_id> [flags]
```

## Flags
| Flag |                 | Description                                                                      | Input Type | {{< cli/mapped >}} |
|:---- |:---             |:-----------                                                                      |:---------- |:------------------ |
| `-f` | `--file`        | Template output file. Defaults to stdout. Use `.yml` or `.json` file extensions. | string     |                    |
| `-h` | `--help`        | Help for the `export stack` command                                              |            |                    |
|      | `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`)                       | string     | `INFLUX_HOST`      |
| `-o` | `--org`         | Organization name that owns the resources                                        | string     | `INFLUX_ORG`       |
|      | `--org-id`      | Organization ID that owns the resources                                          | string     | `INFLUX_ORG_ID`    |
|      | `--skip-verify` | Skip TLS certificate verification                                                |            |                    |
| `-t` | `--token`       | Authentication token                                                             | string     | `INFLUX_TOKEN`     |

## Examples
```sh
# Export a stack as a template
influx export stack $STACK_ID
```
