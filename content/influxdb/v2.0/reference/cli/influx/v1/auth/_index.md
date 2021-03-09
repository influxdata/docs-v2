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

The `influx v1 auth` subcommands provide authorization management for the [InfluxDB 1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).

InfluxDB 2.0 requires authorization.
If you do not have authorization enabled in 1.x, you will need to enable some kind of authorization
either username and password, or [token](https://docs.influxdata.com/influxdb/cloud/reference/glossary/#token)-based authorization.

Token-based authorization is the standard method in InfluxDB 2.0.
We recommend using this method if possible.

However, the [v1 compatibility API]() provides a wrapper for using username and password so that users can continue to use 1.x clients and libraries
(that expect basic auth) with InfluxDB 2.0.
We call such authorizations _v1 compatibility authorizations_.
(Compatibility authorizations are _separate from_ the credentials used to log into the InfluxDB user interface.)

For more, see ["Manually upgrade from InfluxDB 1.x to 2.0"](/influxdb/v2.0/upgrade/v1-to-v2/manual-upgrade/).

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
