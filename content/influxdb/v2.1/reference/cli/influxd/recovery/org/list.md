---
title: influxd recovery org list
description: >
  The `influxd recovery org list` command lists organizations stored on disk and 
  outputs data associated with each organization.
menu:
  influxdb_2_1_ref:
    parent: influxd recovery org
weight: 401
---

The `influxd recovery org list` command lists organizations stored on disk and 
outputs data associated with each organization.

{{% note %}}
This command can only be executed when the InfluxDB server (`influxd`) is not running.
{{% /note %}}

## Usage
```sh
influxd recovery org list [flags]
```

## Flags
| Flag |               | Description                                                    | Input Type |
| :--- | :------------ | :------------------------------------------------------------- | :--------: |
|      | `--bolt-path` | Path to the BoltDB file (default `~/.influxdbv2/influxd.bolt`) |   string   |
| `-h` | `--help`      | Help for `list`                                                |            |