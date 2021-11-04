---
title: influxd recovery user list
description: >
  The `influxd recovery user list` command lists users stored on disk and 
  outputs data associated with each user.
menu:
  influxdb_2_1_ref:
    parent: influxd recovery user
weight: 401
---

The `influxd recovery user list` command lists users stored on disk and 
outputs data associated with each user.

{{% note %}}
This command can only be executed when the InfluxDB server (`influxd`) is not running.
{{% /note %}}

## Usage
```sh
influxd recovery user list [flags]
```

## Flags
| Flag |               | Description                                                   | Input Type |
| :--- | :------------ | :------------------------------------------------------------ | :--------: |
|      | `--bolt-path` | Path to the BoltDB file (default `~.influxdbv2/influxd.bolt`) |   string   |
| `-h` | `--help`      | Help for `list`                                               |            |