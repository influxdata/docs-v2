---
title: influx-meta import
description: >
  The `influx-meta import` command imports metadata from JSON to a live InfluxDB
  Enterprise cluster.
menu:
  enterprise_influxdb_v1:
    parent: influx-meta
weight: 201
metadata: v1.12.0+
---

The `influx-meta import` command imports metadata from JSON to a live InfluxDB
Enterprise cluster.

## Usage

```sh
influx-meta import [flags]
```

## Flags

| Flag | Description |
| :--- | :---------- |
| `--host` | Address and port of the meta node _(default: `localhost:8091`)_ |
| `--config` | Config file path _(default: `$HOME/.influx-meta.yaml`)_ |
