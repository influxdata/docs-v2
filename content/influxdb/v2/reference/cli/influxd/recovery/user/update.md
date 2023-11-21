---
title: influxd recovery user update
description: >
  The `influxd recovery user update` command lets you change your password if you forget your credentials.
menu:
  influxdb_v2:
    parent: influxd recovery user
weight: 401
---

Use `influxd recovery user update` to update a password. Useful when you forget your username and need to update your credentials. To retrieve all usernames in the system, use [`influxd recovery user list`](/influxdb/v2/reference/cli/influxd/recovery/user/list/) or use [`influxd recovery user create`](/influxdb/v2/reference/cli/influxd/recovery/user/create/) to create new user for recovery purposes.

{{% note %}}
This command can only be executed when the InfluxDB server (`influxd`) is not running.
{{% /note %}}

## Usage
```sh
influxd recovery user update [flags]
```

## Flags
| Flag |                      | Description                                                   | Input Type |
| :--- | :------------------- | :------------------------------------------------------------ | :--------: |
|      | `--bolt-path`        | Path to the BoltDB file (default `~.influxdbv2/influxd.bolt`) |   string   |
| `-h` | `--help`             | Help for `update`                                             |            |
|      | `--id` or `username` | Enter the ID or name for an existing user                     |   string   |
|      | `--password`         | New password for the specified user                           |   string   |

## Examples

##### Update a user password

```sh
influxd recovery user update \
  --username example-username \
  --password ExAmPL3-paS5W0rD
```