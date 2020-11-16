---
title: influxd inspect build-tsi
description: >
  The `influxd inspect build-tsi` command rebuilds the TSI index and, if necessary,
  the series file.
influxdb/v2.0/tags: [tsi]
menu:
  influxdb_2_0_ref:
    parent: influxd inspect
weight: 301
products: [oss]
---

The `influxd inspect build-tsi` command rebuilds the TSI index and, if necessary,
the series file.

## Usage
```sh
influxd inspect build-tsi [flags]
```

InfluxDB builds the index by reading all Time-Structured Merge tree (TSM) indexes
and Write Ahead Log (WAL) entries in the TSM and WAL data directories.
If the series file directory is missing, it rebuilds the series file.
If the TSI index directory already exists, the command will fail.

### Adjust performance
Use the following options to adjust the performance of the indexing process:

##### --max-log-file-size
`--max-log-file-size` determines how much of an index to store in memory before
compacting it into memory-mappable index files.
If you find the memory requirements of your TSI index are too high, consider
decreasing this setting.

##### --max-cache-size
`--max-cache-size` defines the maximum cache size.
The indexing process replays WAL files into a `tsm1.Cache`.
If the maximum cache size is too low, the indexing process will fail.
Increase `--max-cache-size` to account for the size of your WAL files.

##### --batch-size
`--batch-size` defines the size of the batches written into the index.
Altering the batch size can improve performance but may result in significantly
higher memory usage.

## Flags
| Flag |                       | Description                                                                                     | Input Type |
|:---- |:---                   |:-----------                                                                                     |:----------:|
|      | `--batch-size`        | The size of the batches to write to the index. Defaults to `10000`. [See above](#--batch-size). | integer    |
|      | `--concurrency`       | Number of workers to dedicate to shard index building. Defaults to `GOMAXPROCS` (8 by default). | integer    |
| `-h` | `--help`              | Help for the `build-tsi` command.                                                               |            |
|      | `--max-cache-size`    | Maximum cache size. Defaults to `1073741824`. [See above](#--max-cache-size).                   | uinteger   |
|      | `--max-log-file-size` | Maximum log file size. Defaults to `1048576`. [See above](#--max-log-file-size) .               | integer    |
|      | `--sfile-path`        | Path to the series file directory. Defaults to `~/.influxdbv2/engine/_series`.                  | string     |
|      | `--tsi-path`          | Path to the TSI index directory. Defaults to `~/.influxdbv2/engine/index`.                      | string     |
|      | `--tsm-path`          | Path to the TSM data directory. Defaults to `~/.influxdbv2/engine/data`.                        | string     |
| `-v` | `--verbose`           | Enable verbose output.                                                                          |            |
|      | `--wal-path`          | Path to the WAL data directory. Defaults to `~/.influxdbv2/engine/wal`.                         | string     |
