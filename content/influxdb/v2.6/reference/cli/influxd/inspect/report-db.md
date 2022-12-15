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
|      | `--c`    |  Worker concurrency (default is `1`).                                           |  integer   |
|       | `--db-path`     | ({{< req >}}) Path to database. |  string   |
|       | `--detailed`    | Include field and tag counts in output. |      |
|       | `--exact`    | Report exact counts. |     |
| `-h`  | `--help`         | View help for the `report-db` command.                                                      |            |
|     | `--rollup`    | Rollup level: `t` (total), `b` (bucket), `r` (retention policy), or `m` (measurement) _(default)_.               |    string      |
