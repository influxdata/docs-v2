---
title: influxctl token get
description: >
  The `influxctl token get` command returns information about a database token
  in an InfluxDB Cloud Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl token
weight: 301
---

The `influxctl token get` command returns information about a database token
in an InfluxDB Cloud Dedicated cluster.

The `--format` option lets you print result in other formats.
By default, the 'table' format is used, but the 'json' format is
available for programmatic parsing by other tooling.

## Usage

```sh
influxctl token get [command options] <TOKEN_ID>
```

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
|      | `--format` | Output format (`table` _(default)_ or `json`) |
| `-h` | `--help`   | Output command help                           |

## Examples

```sh
influxctl token get 000xX0Xx00xX
```
