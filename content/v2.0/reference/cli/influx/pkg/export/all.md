---
title: influx pkg export all
description: >
  The 'influx pkg' command exports all resources in an organization as an InfluxDB template.
menu:
  v2_0_ref:
    parent: influx pkg export
weight: 201
related:
  - /v2.0/influxdb-templates/create/
---

The `influx pkg export all` command exports all resources in an
organization as an InfluxDB template.
_For detailed examples of exporting InfluxDB templates, see
[Create an InfluxDB template](/v2.0/influxdb-templates/create/)._

## Usage
```
influx pkg export all [flags]
```

## Flags
| Flag           | Description                                                                                     | Input Type      | {{< cli/mapped >}} |
|:----           |:-----------                                                                                     |:----------      |:------------------ |
| `-f`, `--file` | Template output file. Defaults to stdout. Use `.yml` or `.json` file extensions.                | string          |                    |
| `--filter`     | Specify resources to export by labelName or resourceKind (format: `--filter=labelName=example`) | list of strings |
| `-h`, `--help` | Help for the `export` command                                                                   |                 |                    |
| `-o`, `--org`  | Organization name that owns the resources                                                       | string          | `INFLUX_ORG`       |
| `--org-id`     | Organization ID that owns the resources                                                         | string          | `INFLUX_ORG_ID`    |

{{% cli/influx-global-flags %}}
