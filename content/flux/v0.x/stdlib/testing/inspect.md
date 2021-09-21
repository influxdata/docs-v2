---
title: testing.inspect() function
description: >
  The `testing.inspect()` function returns information about a test case.
menu:
  flux_0_x_ref:
    name: testing.inspect
    parent: testing
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/testing/inspect/
  - /influxdb/cloud/reference/flux/stdlib/testing/inspect/
weight: 301
flux/v0.x/tags: [tests, transformations]
introduced: 0.18.0
---

The `testing.inspect()` function returns information about a test case.

```js
import "testing"

testing.inspect(
  case: exampleTestCase
)
```

## Parameters

### case {data-type="function"}
Test case to inspect.

## Examples

##### Define and inspect a test case
```js
import "testing"

inData = "
#datatype,string,long,string,dateTime:RFC3339,string,double
#group,false,false,true,false,true,false
#default,_result,,,,,
,result,table,_measurement,_time,_field,_value
,,0,m,2021-01-01T00:00:00Z,t,1.2
,,0,m,2021-01-02T00:00:00Z,t,1.4
,,0,m,2021-01-03T00:00:00Z,t,2.2
"

outData = "
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,string,string,double
#group,false,false,true,true,true,true,false
#default,_result,,,,,,
,result,table,_start,_stop,_measurement,_field,_value
,,0,2021-01-01T00:00:00Z,2021-01-03T01:00:00Z,m,t,4.8
"

t_sum = (table=<-) =>
  (table
    |> range(start:2021-01-01T00:00:00Z, stop:2021-01-03T01:00:00Z)
    |> sum())

test _sum = () =>
  ({input: testing.loadStorage(csv: inData), want: testing.loadMem(csv: outData), fn: t_sum})

testing.inpsect(case: _sum)

// Returns: {
//   fn: (<-table: [{_time: time | t10997}]) -> [t10996],
//   input: fromCSV -> range -> map,
//   want: fromCSV -> yield,
//   got: fromCSV -> range -> map -> range -> sum -> yield,
//   diff: ( fromCSV; fromCSV -> range -> map -> range -> sum;  ) -> diff -> yield
// }
```
