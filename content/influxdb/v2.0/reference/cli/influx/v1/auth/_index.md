---
title: influx v1 auth
description: >
  The `influx v1 auth` subcommands provide authorization management for the InfluxDB 1.x compatibility API.
menu:
  influxdb_2_0_ref:
    name: influx v1 auth
    parent: influx v1
weight: 101
influxdb/v2.0/tags: [authorization]
---

The `influx v1 auth` subcommands provide authorization management for the
[InfluxDB 1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).

InfluxDB 2.0 {{% cloud-token-auth %}}
The [1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/) allows clients to authenticate with InfluxDB 2.0 using the InfluxDB 1.x convention of username and password.

{{% note %}}
1.x-compatible authorizations are separate from the credentials used to log
into the InfluxDB user interface.
{{% /note %}}

## Usage
```
influx v1 auth [flags]
influx v1 auth [command]
```

#### Command aliases
`auth`, `authorization`

## Commands

| Command                                                                     | Description                                  |
|:----------------------------------------------------------------------------|:---------------------------------------------|
| [create](/influxdb/v2.0/reference/cli/influx/v1/auth/create/)             | Create authorization                         |
| [delete](/influxdb/v2.0/reference/cli/influx/v1/auth/delete/)             | Delete authorization                         |
| [list](/influxdb/v2.0/reference/cli/influx/v1/auth/list/)                 | List authorizations                          |
| [set-active](/influxdb/v2.0/reference/cli/influx/v1/auth/set-active/)     | Activate an authorization                    |
| [set-inactive](/influxdb/v2.0/reference/cli/influx/v1/auth/set-inactive/) | Deactivate an authorization                  |
| [set-password](/influxdb/v2.0/reference/cli/influx/v1/auth/set-password/) | Set a password for an existing authorization |

## Flags
| Flag |          | Description                     |
|:-----|:---------|:--------------------------------|
| `-h` | `--help` | Help for the `v1 auth ` command |
