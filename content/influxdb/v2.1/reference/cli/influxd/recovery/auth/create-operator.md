---
title: influxd recovery auth create-operator
description: The `influxd recovery auth create-operator` command ...
menu:
  influxdb_2_1_ref:
    parent: influxd recovery auth
weight: 401
---

Create new operator token for a user

{{% note %}}
This command can only be executed when the InfluxDB server (`influxd`) is not running.
{{% /note %}}

## Usage
```sh
influxd recovery auth create-operator [flags]
```

## Flags
| Flag |               | Description                                                    | Input Type |
| :--- | :------------ | :------------------------------------------------------------- | :--------: |
|      | `--bolt-path` | Path to the BoltDB file (default `~/.influxdbv2/influxd.bolt`) |   string   |
| `-h` | `--help`      | Help for `create-operator`                                     |            |
|      | `--org`       | Organization name                                              |   string   |
|      | `--username`  | Username to assign the operator token to                       |   string   |