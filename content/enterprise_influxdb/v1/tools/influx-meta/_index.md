---
title: influx-meta CLI
description: >
  Use the `influx-meta` CLI to export and edit metadata in a live InfluxDB
  Enterprise v1 cluster.
draft: true
cascade:
  draft: true
menu:
  enterprise_influxdb_v1:
    weight: 12
    parent: Tools
    name: influx-meta
---

<!-- DRAFT — DO NOT PUBLISH.
     influx-meta is an internal InfluxData engineering/support tool, not shipped
     in the InfluxDB Enterprise release. Keep draft: true on this page.
     See https://github.com/influxdata/docs-v2/issues/6842 for context. -->

The `influx-meta` CLI lets you export and edit metadata in a live InfluxDB
Enterprise cluster.

> [!Caution]
> Use `influx-meta` with great caution.
> Commands in this tool directly modify cluster metadata and can cause data loss
> if used incorrectly.
> Before running any command, ensure no concurrent metadata-modifying operations
> are in progress (such as anti-entropy repairs or `influxd-ctl` operations).

## Usage

```
influx-meta <command> [flags]
```

## Commands

| Command | Description |
| :------ | :---------- |
| [cleanup-shards](/enterprise_influxdb/v1/tools/influx-meta/cleanup-shards/) | Clean up orphaned shards and empty shard groups in a live cluster. _v1.12.3+_ |
| [convert](/enterprise_influxdb/v1/tools/influx-meta/convert/) | Convert metadata snapshots between binary and JSON. _v1.12.0+_ |
| [export](/enterprise_influxdb/v1/tools/influx-meta/export/) | Export metadata from a live cluster to JSON. _v1.12.0+_ |
| [fix-shard-owners](/enterprise_influxdb/v1/tools/influx-meta/fix-shard-owners/) | Remove invalid shard owners. _v1.12.0+_ |
| [import](/enterprise_influxdb/v1/tools/influx-meta/import/) | Import metadata from JSON to a live cluster. _v1.12.0+_ |
| [make-node-active](/enterprise_influxdb/v1/tools/influx-meta/make-node-active/) | Put a data node in active mode. _v1.12.0+_ |
| [make-node-passive](/enterprise_influxdb/v1/tools/influx-meta/make-node-passive/) | Put a data node in passive mode. _v1.12.0+_ |
| [renumber-shard-groups](/enterprise_influxdb/v1/tools/influx-meta/renumber-shard-groups/) | Renumber shard groups starting at 1. _v1.12.0+_ |
| [set-shard-group](/enterprise_influxdb/v1/tools/influx-meta/set-shard-group/) | Set the next shard group ID. _v1.12.0+_ |

## Global flags

| Flag | Description |
| :--- | :---------- |
| `--host` | Address and port of the meta node _(default: `localhost:8091`)_ |
| `--config` | Config file path _(default: `$HOME/.influx-meta.yaml`)_ |
