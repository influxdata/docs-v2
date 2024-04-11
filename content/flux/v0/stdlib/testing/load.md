---
title: testing.load() function
description: >
  `testing.load()` loads test data from a stream of tables.
menu:
  flux_v0_ref:
    name: testing.load
    parent: testing
    identifier: testing/load
weight: 101

introduced: 0.112.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/testing/testing.flux#L197-L197

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`testing.load()` loads test data from a stream of tables.



##### Function type signature

```js
(<-tables: A) => A
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Load a raw stream of tables in a test case

The following test uses `array.from()` to create two streams of tables to
compare in the test.

```js
import "testing"
import "array"

got =
    array.from(
        rows: [
            {_time: 2021-01-01T00:00:00Z, _measurement: "m", _field: "t", _value: 1.2},
            {_time: 2021-01-01T01:00:00Z, _measurement: "m", _field: "t", _value: 0.8},
            {_time: 2021-01-01T02:00:00Z, _measurement: "m", _field: "t", _value: 3.2},
        ],
    )

want =
    array.from(
        rows: [
            {_time: 2021-01-01T00:00:00Z, _measurement: "m", _field: "t", _value: 1.2},
            {_time: 2021-01-01T01:00:00Z, _measurement: "m", _field: "t", _value: 0.8},
            {_time: 2021-01-01T02:00:00Z, _measurement: "m", _field: "t", _value: 3.1},
        ],
    )

testing.load(tables: got)
    |> testing.diff(want: want)

```

