---
title: influx user list
description: The `influx user list` lists users in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx user list
    parent: influx user
weight: 201
aliases:
  - /influxdb/v2.0/reference/cli/influx/user/find
canonical: /{{< latest "influxdb" "v2" >}}/reference/cli/influx/user/list/
---

The `influx user list` command lists users in InfluxDB.

## Usage
```
influx user list [flags]
```

#### Command aliases
`list`, `ls`, `find`

## Flags
| Flag |                   | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---               |:-----------                                                           |:----------: |:------------------    |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string      |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`          | Help for the `list` command                                           |             |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string      | `INFLUX_HOST`         |
| `-i` | `--id`            | User ID                                                               | string      |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |             | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`          | Username                                                              | string      |                       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |             |                       |
| `-t` | `--token`         | Authentication token                                                  | string      | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

- [List all users](#list-all-users)
- [List a specific user by username](#list-a-specific-user-by-username)
- [List a specific user by ID](#list-a-specific-user-by-id)

##### List all users
```sh
influx user list
```

##### List a specific user by username
```sh
influx user list --name example-username
```

##### List a specific user by ID
```sh
influx user list --id 0Xx0oox00XXoxxoo1
```