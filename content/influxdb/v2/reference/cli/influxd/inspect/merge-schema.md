---
title: influxd inspect merge-schema
description: >
  The `influxd inspect merge-schema` command merges a set of schema files.
influxdb/v2/tags: [shards, inspect]
menu:
  influxdb_v2_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect merge-schema` command merges a set of schema files.

## Usage
```sh
influxd inspect merge-schema [flags]
```

## Flags
| Flag |                    | Description                                                   | Input Type |
| :--- | :----------------- | :------------------------------------------------------------ | :--------: |
|      | `--conflicts-file` | File to write shard conflicts to (default is `conflicts.json` |   string   |
| `-h` | `--help`           | View help for the `merge-schema` command.                     |            |
|      | `--schema-file`    | File to write schema data to (default is `schema.json`).      |   string   |
