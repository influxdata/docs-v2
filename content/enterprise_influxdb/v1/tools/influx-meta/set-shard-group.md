---
title: influx-meta set-shard-group
description: >
  The `influx-meta set-shard-group` command sets the next shard group ID.
menu:
  enterprise_influxdb_v1:
    parent: influx-meta
weight: 201
metadata: v1.12.0+
---

The `influx-meta set-shard-group` command sets the next shard group ID.

## Usage

```sh
influx-meta set-shard-group [flags]
```

## Flags

| Flag | Description |
| :--- | :---------- |
| `--host` | Address and port of the meta node _(default: `localhost:8091`)_ |
| `--config` | Config file path _(default: `$HOME/.influx-meta.yaml`)_ |
