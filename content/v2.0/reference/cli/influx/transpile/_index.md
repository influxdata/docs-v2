---
title: influx transpile
description: >
  The `influx transpile` command transpiles an InfluxQL query to Flux source code.
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

{{% note %}}
The provided InfluxQL query must contain a database and measurement and must be valid InfluxQL.
See the [InfluxQL documentation](https://docs.influxdata.com/influxdb/latest/query_language/) for more information.
{{% /note %}}

## Flags
| Flag |          | Description                                                                |
|:---- |:---      |:-----------                                                                |
| `-h` | `--help` | Help for the `transpile` command                                           |
|      | `--now`  | RFC3339Nano timestamp to use as `now()` time (default is current UTC time) |

## Examples
```sh
## Transpile an InfluxQL query that specifies the database,
## retention policy, and measurement.
influx transpile 'SELECT example-field FROM db.rp.measurement'

## Transpile InfluxQL query using default retention policy
influx transpile 'SELECT example-field FROM db..measurement'
```
