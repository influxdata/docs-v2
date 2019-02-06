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
| Flag                 | Description                                                                    | Input type  |
|:----                 |:-----------                                                                    |:----------: |
| `-h`, `--help`       | Help for the `create` command                                                  |             |
| `-o`, `--org`        | The organization name **(Required)**                                           | string      |
| `--read-bucket`      | The bucket ID                                                                  | stringArray |
| `--read-buckets`     | Grants the permission to perform read actions against organization buckets     |             |
| `--read-dashboards`  | Grants the permission to read dashboards                                       |             |
| `--read-orgs`        | Grants the permission to read organizations                                    |             |
| `--read-tasks`       | Grants the permission to read tasks                                            |             |
| `--read-telegrafs`   | Grants the permission to read telegraf configs                                 |             |
| `--read-user`        | Grants the permission to perform read actions against organization users       |             |
| `-u`, `--user`       | The user name                                                                  | string      |
| `--write-bucket`     | The bucket ID                                                                  | stringArray |
| `--write-buckets`    | Grants the permission to perform mutative actions against organization buckets |             |
| `--write-dashboards` | Grants the permission to create dashboards                                     |             |
| `--write-orgs`       | Grants the permission to create organizations                                  |             |
| `--write-tasks`      | Grants the permission to create tasks                                          |             |
| `--write-telegrafs`  | Grants the permission to create telegraf configs                               |             |
| `--write-user`       | Grants the permission to perform mutative actions against organization users   |             |

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
