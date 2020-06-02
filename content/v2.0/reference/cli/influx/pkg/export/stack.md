---
title: influx pkg export stack
description: >
  The 'influx pkg export stack' command exports all resources in an organization as an InfluxDB template.
menu:
  v2_0_ref:
    parent: influx pkg export
weight: 201
---

The `influx pkg export stack` command exports all resources associated with a
stack in their current state.
All `metadata.name` fields remain the same.

## Usage
```
influx pkg export stack <stack_id> [flags]
```

## Flags
| Flag           | Description                                                                      | Input Type | {{< cli/mapped >}} |
|:----           |:-----------                                                                      |:---------- |:------------------ |
| `-f`, `--file` | Template output file. Defaults to stdout. Use `.yml` or `.json` file extensions. | string     |                    |
| `-h`, `--help` | Help for the `export stack` command                                              |            |                    |
| `-o`, `--org`  | Organization name that owns the resources                                        | string     | `INFLUX_ORG`       |
| `--org-id`     | Organization ID that owns the resources                                          | string     | `INFLUX_ORG_ID`    |

{{% cli/influx-global-flags %}}
