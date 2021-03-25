---
title: influxd inspect verify-tsm
description: >
  The `influxd inspect verify-tsm` command analyzes a set of TSM files for inconsistencies
  between the TSM index and the blocks.
influxdb/v2.0/tags: [tsm, inspect]
menu:
  influxdb_2_0_ref:
    parent: influxd inspect
weight: 301
draft: true
---

The `influxd inspect verify-tsm` command analyzes a set of TSM files for inconsistencies
between the TSM index and the blocks. It performs the following checks:

- Ensures CRC-32 checksums match for each block.
- Ensures the minimum and maximum timestamps in the TSM index match the decoded data.

## Usage
```sh
influxd inspect verify-tsm <pathspec>... [flags]
```

## Arguments

### pathspec
A list of files or directories in which to search for TSM files.

## Flags
| Flag |               | Description                                               | Input Type |
|:---- |:---           |:-----------                                               |:----------:|
|      | `--bucket-id` | Limit analysis to a specific bucket ID. _Optional._       | string     |
| `-h` | `--help`      | Help for the `verify-tsm` command.                        |            |
|      | `--org-id`    | Limit analysis to a specific organization ID. _Optional._ | string     |
