---
title: influxctl database list
description: >
  The `influxctl database list` command lists all databases in an InfluxDB Cloud
  Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl database
weight: 301
---

The `influxctl database list` command lists all databases in an InfluxDB Cloud
Dedicated cluster.

The `--format` option lets you print the output in other formats.
By default, the 'table' format is used, but the 'json' format is
available for programmatic parsing by other tooling.

## Usage

```sh
influxctl database list [--format=table|json]
```

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
|      | `--format` | Output format (`table` _(default)_ or `json`) |
| `-h` | `--help`   | Output command help                           |
