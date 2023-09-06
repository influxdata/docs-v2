---
title: influxctl cluster list
description: >
  The `influxctl cluster list` command information about all InfluxDB
  clusters associated with your account ID.
menu:
  influxdb_clustered:
    parent: influxctl cluster
weight: 301
---

The `influxctl cluster list` command returns information about all InfluxDB
clusters associated with your account ID.

The `--format` option lets you print the output in other formats.
By default, the 'table' format is used, but the 'json' format is
available for programmatic parsing by other tooling.

## Usage

```sh
influxctl cluster list
```

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
|      | `--format` | Output format (`table` _(default)_ or `json`) |
| `-h` | `--help`   | Output command help                           |
