---
title: influxd inspect check-schema
description: >
  The `influxd inspect check-schema` command checks for conflicts between shard types.
influxdb/v2/tags: [shards, inspect]
menu:
  influxdb_v2:
    parent: influxd inspect
weight: 301
---

The `influxd inspect check-schema` command checks for conflicts between shard types.

## Usage
```sh
influxd inspect check-schema [flags]
```

## Flags
| Flag |                    | Description                                                            | Input Type |
| :--- | :----------------- | :--------------------------------------------------------------------- | :--------: |
|      | `--conflicts-file` | File to write shard conflicts to (default is `conflicts.json`).        |   string   |
| `-h` | `--help`           | View help for the `check-schema` command.                              |            |
|      | `--log-level`      | Log level used for the command (`debug`, `info` (default), or `error`) |   string   |
|      | `--path`           | Directory path to `fields.idx` files (default is `./`)                 |   string   |
|      | `--schema-file`    | File to write schema data to (default is `schema.json`).               |   string   |
