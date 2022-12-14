---
title: influxd inspect merge-schema
description: >
  The `influxd inspect merge-schema` command merges a set of schema files.
influxdb/v2.6/tags: [shards, inspect]
menu:
  influxdb_2_6_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect merge-schema` command merges a set of schema files.

## Usage
```sh
influxd inspect merge-schema [flags]
```

## Flags
| Flag  |                  | Description                                                                                  | Input Type |
| :---- | :--------------- | :------------------------------------------------------------------------------------------- | :--------: |
|      | `--conflicts-file`    |  Filename conflict data should be written to (default is"conflicts.json").                                           |  string |
| `-h`  | `--help`         | View Help for the `merge-schema` command.                                                      |            |
|      | `--schema-file`    |  Filename for the output file  (default is "schema.json").                                           |  string |