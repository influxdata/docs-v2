---
title: influx pkg export all
description: >
  The 'influx pkg' command exports all existing resources for an organization as a package.
menu:
  v2_0_ref:
    parent: influx pkg export
weight: 201
---

The `influx pkg export all` command exports all existing resources for an
organization as a package.

## Usage
```
influx pkg export all [flags]
```

## Flags
| Flag           | Description                                                                                   | Input Type      | {{< cli/mapped >}} |
|:----           |:-----------                                                                                   |:----------      |:------------------ |
| `-f`, `--file` | Package output file. Defaults to stdout. Use `.yml` or `.json` file extensions.               | string          |                    |
| `--filter`     | Filter exported resources by labelName or resourceKind (format: `--filter=labelName=example`) | list of strings |
| `-h`, `--help` | Help for the `export` command                                                                 |                 |                    |
| `-o`, `--org`  | The name of the organization that owns the resources                                          | string          | `INFLUX_ORG`       |
| `--org-id`     | The ID of the organization that owns the resources                                            | string          | `INFLUX_ORG_ID`    |

{{% cli/influx-global-flags %}}
