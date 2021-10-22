---
title: influxd recovery org list
description: The `influxd recovery org list` command ...
menu:
  influxdb_2_1_ref:
    parent: influxd recovery org
weight: 401
---

List organizations

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