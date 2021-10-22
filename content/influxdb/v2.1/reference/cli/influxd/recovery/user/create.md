---
title: influxd recovery user create
description: The `influxd recovery user create` command ...
menu:
  influxdb_2_1_ref:
    parent: influxd recovery user
weight: 401
---

Create new user

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