---
title: influx-meta convert
description: >
  The `influx-meta convert` command converts metadata snapshots between binary
  and JSON formats.
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

The `influx-meta convert` command converts metadata snapshots between binary
and JSON formats.

## Usage

```sh
influx-meta convert [flags]
```

## Flags

| Flag | Description |
| :--- | :---------- |
| `--host` | Address and port of the meta node _(default: `localhost:8091`)_ |
| `--config` | Config file path _(default: `$HOME/.influx-meta.yaml`)_ |
