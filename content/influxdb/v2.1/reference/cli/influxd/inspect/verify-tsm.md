---
title: influxd inspect verify-tsm
description: >
  The `influxd inspect verify-tsm` command analyzes a set of TSM files for inconsistencies
  between the TSM index and the blocks.
influxdb/v2.1/tags: [tsm, inspect]
menu:
  influxdb_2_1_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect verify-tsm` command verifies the integrity of TSM files.

## Usage
```sh
influxd inspect verify-tsm [flags]
```

## Flags
| Flag |                 | Description                                                                        | Input Type |
| :--- | :-------------- | :--------------------------------------------------------------------------------- | :--------: |
|      | `--check-utf8`  | Verify series keys are valid UTF-8 (skips block checksum verification).            |            |
|      | `--engine-path` | Storage engine directory path (default "/Users/scottanderson/.influxdbv2/engine"). |   string   |
| `-h` | `--help`        | Help for `verify-tsm`.                                                             |            |
| `-v` | `--verbose`     | Enable verbose logging.                                                            |            |
