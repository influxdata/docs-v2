---
title: influx transpile
description: >
  The 'influx transpile' command transpiles an InfluxQL query to Flux source code.
menu:
  v2_0_ref:
    name: influx transpile
    parent: influx
weight: 101
v2.0/tags: [influxql, flux]
---

The `influx transpile` command transpiles an InfluxQL query to Flux source code.
The transpiled query assumes the bucket name is `<database>/<retention policy>`
and includes absolute time ranges using the provided `--now` time.

## Usage
```
influx transpile [InfluxQL query] [flags]
```

## Flags
| Flag |          | Description                                                                |
|:---- |:---      |:-----------                                                                |
| `-h` | `--help` | Help for the `transpile` command                                           |
|      | `--now`  | RFC3339Nano timestamp to use as `now()` time (default is current UTC time) |
