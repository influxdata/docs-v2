---
title: influx-meta renumber-shard-groups
description: >
  The `influx-meta renumber-shard-groups` command renumbers shard groups
  starting at 1.
menu:
  enterprise_influxdb_v1:
    parent: influx-meta
weight: 201
metadata: v1.12.0+
---

<!-- DRAFT — DO NOT PUBLISH.
     influx-meta is an internal InfluxData engineering/support tool, not shipped
     in the InfluxDB Enterprise release. Keep draft: true on this page.
     See https://github.com/influxdata/docs-v2/issues/6842 for context. -->

The `influx-meta renumber-shard-groups` command renumbers shard groups
starting at 1.

## Usage

```sh
influx-meta renumber-shard-groups [flags]
```

## Flags

| Flag | Description |
| :--- | :---------- |
| `--host` | Address and port of the meta node _(default: `localhost:8091`)_ |
| `--config` | Config file path _(default: `$HOME/.influx-meta.yaml`)_ |
