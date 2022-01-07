---
title: influxd recovery user create
description: >
  The `influxd recovery user create` command creates a new user directly
  on disk for recovery purposes.
menu:
  influxdb_2_1_ref:
    parent: influxd recovery user
weight: 401
---

The `influxd recovery user create` command creates a new user directly
on disk for recovery purposes.

{{% note %}}
This command can only be executed when the InfluxDB server (`influxd`) is not running.
{{% /note %}}

## Usage
```sh
influxd recovery user create [flags]
```

## Flags
| Flag |               | Description                                                   | Input Type |
| :--- | :------------ | :------------------------------------------------------------ | :--------: |
|      | `--bolt-path` | Path to the BoltDB file (default `~.influxdbv2/influxd.bolt`) |   string   |
| `-h` | `--help`      | Help for `create`                                             |            |
|      | `--password`  | Password for the new user                                     |   string   |
|      | `--username`  | Username of the new user                                      |   string   |

## Examples

##### Create a new user directly on disk
```sh
influxd recovery user create \
  --username example-username \
  --password ExAmPL3-paS5W0rD
```