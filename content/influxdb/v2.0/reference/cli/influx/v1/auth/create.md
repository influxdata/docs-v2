---
title: influx v1 auth create
description: >
  The `influx v1 auth create` command creates an authorization in the InfluxDB 1.x compatibility API.
menu:
  influxdb_2_0_ref:
    name: influx v1 auth create
    parent: influx v1 auth
weight: 101
influxdb/v2.0/tags: [authorization]
---

The `influx v1 auth create` command creates a legacy authorization with the [InfluxDB 1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).

## Usage
```
influx v1 auth create [flags]
```

## Flags
| Flag |                   | Description                                                                                                | Input type  | {{< cli/mapped >}}      |
|:-----|:------------------|:-------------------------------------------------------------------------------------------------------    |:-----------:|:------------------------|
| `-c` | `--active-config` | Config name to use for command                                                                             | string      | `$INFLUX_ACTIVE_CONFIG` |
|      | `--configs-path`  | Path to the influx CLI configurations (default: `~/.influxdbv2/configs`)                                   | string      | `$INFLUX_CONFIGS_PATH`  |
| `-d` | `--description`   | Token description                                                                                          | string      |                         |
| `-h` | `--help`          | Help for the `create` command                                                                              |             |                         |
|      | `--hide-headers`  | Hide the table headers (default: `false`)                                                                  |             | `$INFLUX_HIDE_HEADERS`  |
|      | `--host`          | HTTP address of InfluxDB                                                                                   | string      | `$INFLUX_HOST`          |
|      | `--json`          | Output data as JSON (default: `false`)                                                                     |             | `$INFLUX_OUTPUT_JSON`   |
|      | `--no-password`   | Don't prompt for a password (to use the token, you must set a password with `influx v1 auth set-password`) |             |                         |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                                                     | string      | `$INFLUX_ORG`           |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                                                          | string      | `$INFLUX_ORG_ID`        |
|      | `--password`      | Password to set on the authorization                                                                       |             |                         |
|      | `--read-bucket`   | Bucket ID(s) to assign read permissions to                                                                 | stringArray |                         |
|      | `--skip-verify`   | Skip TLS certificate verification                                                                          |             |                         |
| `-t` | `--token`         | Authentication token                                                                                       | string      | `$INFLUX_TOKEN`         |
|      | `--username`      | ({{< req >}}) Token username                                                                               | string      |                         |
|      | `--write-bucket`  | Bucket ID(s) to assign write permissions to                                                                | stringArray |                         |

## Examples

{{< cli/influx-creds-note >}}

##### Create a v1 authorization with read and write permissions
```sh
# Create an authorization with read and write access to bucket 00xX00o0X001
# but only read access to bucket 00xX00o0X002
influx v1 auth create \
  --read-bucket 00xX00o0X001 \
  --read-bucket 00xX00o0X002 \
  --write-bucket 00xX00o0X001 \
  --username example-user
```
