---
title: Flux testing package
list_title: Testing package
description: >
  The Flux testing package provides functions that test piped-forward data in specific ways.
  Import the `testing` package.
aliases:
  - /influxdb/v2.0/reference/flux/functions/testing/
  - /influxdb/v2.0/reference/flux/stdlib/testing/
  - /influxdb/cloud/reference/flux/stdlib/testing/
menu:
  flux_0_x_ref:
    name: testing
    parent: Standard library
weight: 11
flux/v0.x/tags: [testing, functions, package]
---

Flux testing functions test piped-forward data in specific ways and return errors if the tests fail.
Import the `testing` package:

```js
import "testing"
```

## Options
The `testing` package includes the following options:

```js
import "testing"

option testing.load = (tables=<-) => tables
option testing.loadMem = (csv) => c.from(csv: csv)
option testing.loadStorage = (csv) => c.from(csv: csv)
    |> range(start: 1800-01-01T00:00:00Z, stop: 2200-12-31T11:59:59Z)
    |> map(
        fn: (r) => ({r with
            _field: if exists r._field then r._field else die(msg: "test input table does not have _field column"),
            _measurement: if exists r._measurement then r._measurement else die(msg: "test input table does not have _measurement column"),
            _time: if exists r._time then r._time else die(msg: "test input table does not have _time column"),
        }),
    )
```

### load {data-type="function"}
Function option that loads tests data from a stream of tables.
Default is:

```js
(tables=<-) => tables
```

### loadMem {data-type="function"}
Function option that loads annotated CSV test data from memory to emulate query
results returned by Flux.
Default is:

```js
(csv) => c.from(csv: csv)
```

### loadStorage {data-type="function"}
Function option that loads annotated CSV test data as if queried from InfluxDB.
Ensures tests behave correctly in both the Flux and InfluxDB test suites.
Default is:

```js
(csv) => c.from(csv: csv)
    |> range(start: 1800-01-01T00:00:00Z, stop: 2200-12-31T11:59:59Z)
    |> map(
        fn: (r) => ({r with
            _field: if exists r._field then r._field else die(msg: "test input table does not have _field column"),
            _measurement: if exists r._measurement then r._measurement else die(msg: "test input table does not have _measurement column"),
            _time: if exists r._time then r._time else die(msg: "test input table does not have _time column"),
        }),
    )
```

## Functions
{{< children type="functions" show="pages" >}}
