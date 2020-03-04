---
title: influx auth create
description: The 'influx auth create' creates an authorization in InfluxDB.
menu:
  v2_0_ref:
    name: influx auth create
    parent: influx auth
weight: 201
---

The `influx auth create` creates an authorization in InfluxDB.

## Usage
```
influx auth create [flags]
```

## Flags
| Flag                 | Description                                                    | Input type  | {{< cli/mapped >}} |
|:----                 |:-----------                                                    |:----------: |:------------------ |
| `-h`, `--help`       | Help for the `create` command                                  |             |                    |
| `-o`, `--org`        | **(Required)** Organization name                               | string      | `INFLUX_ORG`       |
| `--org-id`           | Organization ID                                                | string      | `INFLUX_ORG_ID`    |
| `--read-bucket`      | Bucket ID                                                      | stringArray |                    |
| `--read-buckets`     | Grants permission to read organization buckets                 |             |                    |
| `--read-dashboards`  | Grants permission to read dashboards                           |             |                    |
| `--read-orgs`        | Grants permission to read organizations                        |             |                    |
| `--read-tasks`       | Grants permission to read tasks                                |             |                    |
| `--read-telegrafs`   | Grants permission to read Telegraf configurations              |             |                    |
| `--read-user`        | Grants permission to read organization users                   |             |                    |
| `-u`, `--user`       | Username                                                       | string      |                    |
| `--write-bucket`     | Bucket ID                                                      | stringArray |                    |
| `--write-buckets`    | Grants permission to create and update organization buckets    |             |                    |
| `--write-dashboards` | Grants permission to create and update dashboards              |             |                    |
| `--write-orgs`       | Grants permission to create and update organizations           |             |                    |
| `--write-tasks`      | Grants permission to create and update tasks                   |             |                    |
| `--write-telegrafs`  | Grants permission to create and update Telegraf configurations |             |                    |
| `--write-user`       | Grants permission to create and update organization users      |             |                    |

{{% cli/influx-global-flags %}}
