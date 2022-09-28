---
title: influxd recovery auth create-operator
description: >
  The `influxd recovery auth create-operator` command creates new
  [Operator token](/influxdb/v2.1/security/tokens/#operator-token) directly on disk
  for a specified user.
menu:
  influxdb_2_1_ref:
    parent: influxd recovery auth
weight: 401
---

The `influxd recovery auth create-operator` command creates a new
[Operator token](/influxdb/v2.1/security/tokens/#operator-token) directly on disk
for a specified user.

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
|      | `--org`       | ({{< req >}}) Organization name                                |   string   |
|      | `--username`  | ({{< req >}}) Username to assign the operator token to         |   string   |

## Examples

##### Generate a new operator token
```sh
influxd \
  --org example-org \
  --username example-user
```