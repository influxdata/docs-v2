---
title: influxctl token list
description: >
  The `influxctl token list` command lists all database tokens in an InfluxDB
  cluster.
menu:
  influxdb_clustered:
    parent: influxctl token
weight: 301
---

The `influxctl token list` command lists all database tokens in an InfluxDB cluster.

## Usage

```sh
influxctl token list [--format=table|json]
```

## Flags

| Flag |            | Description                                           |
| :--- | :--------- | :---------------------------------------------------- |
|      | `--format` | Output format (`table` or `json`, default is `table`) |
| `-h` | `--help`   | Output command help                                   |
