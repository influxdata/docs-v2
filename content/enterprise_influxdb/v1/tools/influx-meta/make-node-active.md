---
title: influx-meta make-node-active
description: >
  The `influx-meta make-node-active` command puts a data node in active mode.
menu:
  enterprise_influxdb_v1:
    parent: influx-meta
weight: 201
metadata: v1.12.0+
---

The `influx-meta make-node-active` command puts a data node in active mode.

## Usage

```sh
influx-meta make-node-active [flags]
```

## Flags

| Flag | Description |
| :--- | :---------- |
| `--host` | Address and port of the meta node _(default: `localhost:8091`)_ |
| `--config` | Config file path _(default: `$HOME/.influx-meta.yaml`)_ |
