---
title: influx org members remove
description: The `influx org members remove` command removes a member from an organization in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx org members remove
    parent: influx org members
weight: 301
aliases:
  - /v2.0/reference/cli/influx/org/members/remove/
---

The `influx org members remove` command removes a member from an organization in InfluxDB.

## Usage
```
influx org members remove [flags]
```

## Flags
| Flag |                 | Description                                                | Input type  | {{< cli/mapped >}} |
|:---- |:---             |:-----------                                                |:----------: |:------------------ |
| `-h` | `--help`        | Help for the `remove` command                              |             |                    |
|      | `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string      | `INFLUX_HOST`      |
| `-i` | `--id`          | Organization ID                                            | string      | `INFLUX_ORG_ID`    |
| `-o` | `--member`      | Member ID                                                  | string      |                    |
| `-n` | `--name`        | Organization name                                          | string      | `INFLUX_ORG`       |
|      | `--skip-verify` | Skip TLS certificate verification                          |             |                    |
| `-t` | `--token`       | Authentication token                                       | string      | `INFLUX_TOKEN`     |
