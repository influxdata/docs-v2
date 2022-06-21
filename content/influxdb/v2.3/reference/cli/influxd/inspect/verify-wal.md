---
title: influxd inspect verify-wal
description: >
  The `influxd inspect verify-wal` command analyzes the Write-Ahead Log (WAL)
  to check if there are any corrupt files.
influxdb/v2.3/tags: [wal, inspect]
menu:
  influxdb_2_3_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect verify-wal` command analyzes the Write-Ahead Log (WAL)
to check if there are any corrupt files.
If it finds corrupt files, the command returns the names of those files.
It also returns the total number of entries in each scanned WAL file.

## Usage
```sh
influxd inspect verify-wal [flags]
```

## Output details
`influxd inspect verify-wal` outputs the following for each file:

- The file name.
- The first position of any identified corruption or "clean" if no corruption is found.

After the verification is complete, it returns a summary with:

- The number of WAL files scanned.
- The number of WAL entries scanned.
- A list of files found to be corrupt.

## Flags
| Flag |              | Description                                                   | Input Type |
| :--- | :----------- | :------------------------------------------------------------ | :--------: |
| `-h` | `--help`     | Help for the `verify-wal` command.                            |            |
| `-v` | `--verbose`  | Enable verbose logging.                                       |            |
|      | `--wal-path` | Path to WAL directory (default is `~/.influxdbv2/engine/wal`) |   string   |
