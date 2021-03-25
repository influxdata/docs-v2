---
title: influxd generate simple
description: >
  The `influxd generate simple` command generates and writes a simple data set using
  reasonable defaults and CLI flags.
influxdb/v2.0/tags: [sample-data]
menu:
  influxdb_2_0_ref:
    parent: influxd generate
weight: 301
products: [oss]
---

The `influxd generate simple` command generates and writes a simple data set using
reasonable defaults and command line interface (CLI) [flags](#flags).

{{% note %}}
#### Important notes
- `influxd generate simple` cannot run while the `influxd` server is running.
  The `generate` command modifies index and Time-Structured Merge Tree (TSM) data.
- Use `influxd generate simple` for **development and testing purposes only**.
  Do not run it on a production server.
{{% /note %}}

## Usage
```sh
influxd generate simple [flags]
```

## Flags
| Flag |                | Description                                                               | Input Type |
|:---- |:---            |:-----------                                                               |:----------:|
|      | `--print`      | Print data spec and exit                                                  |            |
|      | `--org`        | Organization name                                                         | string     |
|      | `--bucket`     | Bucket name                                                               | string     |
|      | `--start-time` | Start time (`YYYY-MM-DDT00:00:00Z`) (default is 00:00:00 of one week ago) | string     |
|      | `--end-time`   | End time (`YYYY-MM-DDT00:00:00Z`) (default is 00:00:00 of current day)    | string     |
|      | `--clean`      | Clean time series data files (`none`, `tsm` or `all`) (default `none`)    | string     |
|      | `--cpuprofile` | Collect a CPU profile                                                     | string     |
|      | `--memprofile` | Collect a memory profile                                                  | string     |
| `-h` | `--help`       | Help for the `simple` command                                             |            |
