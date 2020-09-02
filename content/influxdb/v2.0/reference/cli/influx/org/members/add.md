---
title: influx org members add
description: The `influx org members add` command adds a new member to an organization in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx org members add
    parent: influx org members
weight: 301
---

The `influx org members add` command adds a new member to an organization in InfluxDB.

## Usage
```
influx org members add [flags]
```

## Flags
| Flag |                 | Description                                                | Input type  | {{< cli/mapped >}} |
|:---- |:---             |:-----------                                                |:----------: |:------------------ |
| `-h` | `--help`        | Help for the `add` command                                 |             |                    |
|      | `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string      | `INFLUX_HOST`      |
| `-i` | `--id`          | Organization ID                                            | string      | `INFLUX_ORG_ID`    |
| `-m` | `--member`      | Member ID                                                  | string      |                    |
| `-n` | `--name`        | Organization name                                          | string      | `INFLUX_ORG`       |
|      | `--skip-verify` | Skip TLS certificate verification                          |             |                    |
| `-t` | `--token`       | Authentication token                                       | string      | `INFLUX_TOKEN`     |
