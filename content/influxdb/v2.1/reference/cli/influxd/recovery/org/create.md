---
title: influxd recovery org create
description: >
  The `influxd recovery org create` command creates a new organization directly
  on disk for recovery purposes.
menu:
  influxdb_2_1_ref:
    parent: influxd recovery org
weight: 401
---

The `influxd recovery org create` command creates a new organization directly
on disk for recovery purposes.

{{% note %}}
This command can only be executed when the InfluxDB server (`influxd`) is not running.
{{% /note %}}

## Usage
```sh
influxd recovery org create [flags]
```

## Flags
| Flag |               | Description                                                    | Input Type |
| :--- | :------------ | :------------------------------------------------------------- | :--------: |
|      | `--bolt-path` | Path to the BoltDB file (default `~/.influxdbv2/influxd.bolt`) |   string   |
| `-h` | `--help`      | Help for `create`                                              |            |
|      | `--org`       | Organization name                                              |   string   |

## Examples

##### Create a new organization directly on disk
```sh
influxd recovery org create --org example-org
```