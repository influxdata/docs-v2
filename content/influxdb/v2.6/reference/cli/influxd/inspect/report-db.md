---
title: influxd inspect report-db
description: >
  The `influxd inspect report-db` command reports the cardinality for an InfluxDB bucket.
influxdb/v2.6/tags: [cardinality, inspect]
menu:
  influxdb_2_6_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect report-db` command analyzes an InfluxDB bucket and reports the cardinality of data stored in the bucket.

## Usage
```sh
influxd inspect report-db [flags]
```

## Flags
| Flag  |                  | Description                                                                                  | Input Type |
| :---- | :--------------- | :------------------------------------------------------------------------------------------- | :--------: |
|      | `--c`    |  set worker concurrency, defaults to one (the default is 1).                                           |  integer   |
|       | `--db-path`     | path to database |  string   |
|       | `--detailed`    | include counts for fields, tags |      |
|       | `--exact`    | report exact counts |     |
| `-h`  | `--help`         | View Help for the `report-db` command.                                                      |            |
|     | `--rollup`    | rollup level - t: total, b: bucket, r: retention policy, m: measurement (the default is "m")               |    string      |
