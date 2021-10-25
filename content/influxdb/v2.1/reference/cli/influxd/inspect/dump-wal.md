---
title: influxd inspect dump-wal
description: >
  The `influxd inspect dump-wal` command outputs data from WAL files for debugging purposes.
influxdb/v2.1/tags: [wal, inspect]
menu:
  influxdb_2_1_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect dump-wal` command outputs data from Write Ahead Log (WAL)
files for debugging purposes.
Given at least one WAL file path as an argument, the tool parses and prints
out the entries in each file.

## Usage
```sh
influxd inspect dump-wal [flags]
```

## Output details
The `--find-duplicates` flag determines the `influxd inspect dump-wal` output.

**Without `--find-duplicates`**, the command outputs the following for each file:

- The file name
- For each entry in a file:
	  - The type of the entry (`[write]` or `[delete-bucket-range]`)
	  - The formatted entry contents

**With `--find-duplicates`**, the command outputs the following for each file):

- The file name
- A list of keys with timestamps in the wrong order



## Flags
| Flag |                     | Description                                                                |
|:---- |:---                 |:-----------                                                                |
|      | `--find-duplicates` | Ignore dumping entries; only report keys in the WAL that are out of order. |
| `-h` | `--help`            | Help for the `dump-wal` command.                                            |
