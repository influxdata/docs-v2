---
title: testing.load() function
description: >
  The `testing.load()` function loads tests data from a stream of tables.
menu:
  flux_0_x_ref:
    name: testing.load
    parent: testing
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/testing/load/
  - /influxdb/cloud/reference/flux/stdlib/testing/load/
weight: 301
flux/v0.x/tags: [tests, inputs, transformations]
introduced: 0.112.0
---

The `testing.load()` function loads tests data from a stream of tables.

```js
import "testing"

testing.load()
```

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

##### Load a raw stream of tables in a test case
The following test uses [`array.from()`](/flux/v0.x/stdlib/array/from/)
to create two streams of tables to compare in the test.

```js
import "testing"
import "array"

got = array.from(rows: [
  {_time: 2021-01-01T00:00:00Z, _measurement: "m", _field: "t", _value: 1.2},
  {_time: 2021-01-01T01:00:00Z, _measurement: "m", _field: "t", _value: 0.8},
  {_time: 2021-01-01T02:00:00Z, _measurement: "m", _field: "t", _value: 3.2}
])

want = array.from(rows: [
  {_time: 2021-01-01T00:00:00Z, _measurement: "m", _field: "t", _value: 1.2},
  {_time: 2021-01-01T01:00:00Z, _measurement: "m", _field: "t", _value: 0.8},
  {_time: 2021-01-01T02:00:00Z, _measurement: "m", _field: "t", _value: 3.1}
])

testing.diff(
  got: testing.load(tables: got),
  want: testing.load(tables: want)
)
```
