---
title: influx-meta fix-shard-owners
description: >
  The `influx-meta fix-shard-owners` command removes invalid shard owners from
  cluster metadata.
menu:
  enterprise_influxdb_v1:
    parent: influx-meta
weight: 201
metadata: v1.12.0+
---

The `influx-meta fix-shard-owners` command removes invalid shard owners from
cluster metadata.

## Usage

```sh
influx-meta fix-shard-owners [flags]
```

## Flags

| Flag | Description |
| :--- | :---------- |
| `--host` | Address and port of the meta node _(default: `localhost:8091`)_ |
| `--config` | Config file path _(default: `$HOME/.influx-meta.yaml`)_ |
