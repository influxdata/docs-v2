---
title: influxd recovery auth list
description: The `influxd recovery auth list` command ...
menu:
  influxdb_2_1_ref:
    parent: influxd recovery auth
weight: 401
---

List authorizations

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