---
title: influx user password
description: The `influx user password` command updates the password for a user in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx user password
    parent: influx user
weight: 201
related:
  - /influxdb/v2.0/users/change-password/
canonical: /{{< latest "influxdb" "v2" >}}/reference/cli/influx/user/password/
---

The `influx user password` command updates the password for a user in InfluxDB.

## Usage
```
influx user password [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type  | {{< cli/mapped >}}   |
|:---- |:---               |:-----------                                                           |:----------: |:------------------   |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string      |                      |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `password` command                                       |             |                      |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string      | `INFLUX_HOST`        |
| `-i` | `--id`            | User ID                                                               | string      |                      |
| `-n` | `--name`          | Username                                                              | string      |                      |
|      | `--password`      | Use `password` flag to send your password instead of typing it in     | string      |                      |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |             | `INFLUX_SKIP_VERIFY` |
| `-t` | `--token`         | Authentication token                                                  | string      | `INFLUX_TOKEN`       |

## Examples

{{< cli/influx-creds-note >}}

##### Update a user password using a username
```sh
influx user password --name example-username
# Prompts for password
```

##### Update a user password using a user ID
```sh
influx user password --id 0Xx0oox00XXoxxoo1
# Prompts for password
```
