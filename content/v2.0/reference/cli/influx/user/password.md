---
title: influx user password
description: The `influx user password` command updates the password for a user in InfluxDB.
menu:
  v2_0_ref:
    name: influx user password
    parent: influx user
weight: 201
related:
  - /v2.0/users/change-password/
---

The `influx user password` command updates the password for a user in InfluxDB.

## Usage
```
influx user password [flags]
```

## Flags
| Flag |                 | Description                                                | Input type  | {{< cli/mapped >}} |
|:---- |:---             |:-----------                                                |:----------: |:------------------ |
| `-h` | `--help`        | Help for the `password` command                            |             |                    |
|      | `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string      | `INFLUX_HOST`      |
| `-i` | `--id`          | User ID                                                    | string      |                    |
| `-n` | `--name`        | Username                                                   | string      |                    |
|      | `--skip-verify` | Skip TLS certificate verification                          |             |                    |
| `-t` | `--token`       | Authentication token                                       | string      | `INFLUX_TOKEN`     |
