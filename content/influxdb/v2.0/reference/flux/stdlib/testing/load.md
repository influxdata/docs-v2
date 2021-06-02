---
title: testing.load() function
description: >
  The `testing.load()` function loads tests data from a stream of tables.
menu:
  influxdb_2_0_ref:
    name: testing.load
    parent: Testing
weight: 301
introduced: 0.112.0
---

The `testing.load()` function loads tests data from a stream of tables.

_**Function type:** Test_  

```js
import "testing"

testing.load()
```

## Examples

##### Load a raw stream of tables in a test case
The following test uses [`array.from()`](/influxdb/v2.0/reference/flux/stdlib/array/from/)
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

testing.diff(got, want)
```
