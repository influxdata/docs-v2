---
title: influxd recovery auth list
description: >
  The `influxd recovery auth list` command lists authorizations and data 
  associated with each authorization stored on disk.
menu:
  influxdb_2_1_ref:
    parent: influxd recovery auth
weight: 401
---

The `influxd recovery org list` command lists authorizations stored on disk and 
outputs data associated with each authorization.

{{% note %}}
This command can only be executed when the InfluxDB server (`influxd`) is not running.
{{% /note %}}

## Usage
```sh
influxd recovery auth list [flags]
```

## Flags
| Flag |               | Description                                                    | Input Type |
| :--- | :------------ | :------------------------------------------------------------- | :--------: |
|      | `--bolt-path` | Path to the BoltDB file (default `~/.influxdbv2/influxd.bolt`) |   string   |
| `-h` | `--help`      | Help for `list`                                                |            |