---
title: influxd recovery
description: >
  The `influxd recovery` command and subcommands provide tools for recovering
  operator access to InfluxDB by directly modifying authorization, organization,
  and user data stored on disk.
menu:
  influxdb_2_1_ref:
    parent: influxd
weight: 201
---

The `influxd recovery` command and subcommands provide tools for recovering
operator access to InfluxDB by directly modifying authorization, organization,
and user data stored on disk.

## Usage
```sh
influxd recovery [flags]
influxd recovery [command]
```

## Subcommands
| Subcommand                                                  | Description                                    |
| :---------------------------------------------------------- | :--------------------------------------------- |
| [auth](/influxdb/v2.1/reference/cli/influxd/recovery/auth/) | Manage on-disk authorization data for recovery |
| [org](/influxdb/v2.1/reference/cli/influxd/recovery/org/)   | Manage on-disk organization data for recovery  |
| [user](/influxdb/v2.1/reference/cli/influxd/recovery/user/) | Manage on-disk user data for recovery          |

## Flags
| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Help for `recovery` |