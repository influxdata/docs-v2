---
title: influxd inspect check-schema
description: >
  The `influxd inspect check-schema` command checks for conflicts between shard types.
influxdb/v2.6/tags: [shards, inspect]
menu:
  influxdb_2_6_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect check-schema` command checks for conflicts between shard types.

## Usage
```sh
influxd inspect check-schema [flags]
```

## Flags
| Flag  |                  | Description                                                                                  | Input Type |
| :---- | :--------------- | :------------------------------------------------------------------------------------------- | :--------: |
|      | `--conflicts-file`    |  Filename conflict data should be written to (default is"conflicts.json").                                           |  string |
| `-h`  | `--help`         | View Help for the `check-schema` command.                                                      |            |
|     | `--log-level`    | The level of logging used througout the command (default info)   |   log level   | 
|     | `--path`    | Path under which fields.idx files are located (default ".")   |   string   |                                     |  string |
|      | `--schema-file`    |  Filename schema data should be written to (default is "schema.json").                                           |  string |