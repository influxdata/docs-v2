---
title: influxctl token list
description: >
  The `influxctl token list` command lists all database tokens in an InfluxDB cluster.
menu:
  influxdb_clustered:
    parent: influxctl token
weight: 301
---

The `influxctl token list` command lists all database tokens in an InfluxDB Cloud
Dedicated cluster.

The `--format` option lets you print the output in other formats.
By default, the 'table' format is used, but the 'json' format is
available for programmatic parsing by other tooling.

## Usage

```sh
influxctl token list [--format=table|json]
```

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
|      | `--format` | Output format (`table` _(default)_ or `json`) |
| `-h` | `--help`   | Output command help                           |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb/clustered/reference/cli/influxctl/#global-flags)._
{{% /caption %}}
