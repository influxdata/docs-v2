---
title: testing.inspect() function
description: >
  `testing.inspect()` returns information about a test case.
menu:
  flux_0_x_ref:
    name: testing.inspect
    parent: testing
    identifier: testing/inspect
weight: 101

introduced: 0.18.0
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/testing/inspect/
  - /influxdb/cloud/reference/flux/stdlib/testing/inspect/
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/testing/testing.flux#L237-L249

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`testing.inspect()` returns information about a test case.



##### Function type signature

```js
(
    case: () => {A with want: stream[C], input: B, fn: (<-: B) => stream[C]},
) => {
    want: stream[C],
    input: B,
    got: stream[C],
    fn: (<-: B) => stream[C],
    diff: stream[{C with _diff: string}],
} where C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### case
({{< req >}})
Test case to inspect.




## Examples

### Define and inspect a test case

```js
import "testing"

inData =
    "
#datatype,string,long,string,dateTime:RFC3339,string,double
#group,false,false,true,false,true,false
#default,_result,,,,,
,result,table,_measurement,_time,_field,_value
,,0,m,2021-01-01T00:00:00Z,t,1.2
,,0,m,2021-01-02T00:00:00Z,t,1.4
,,0,m,2021-01-03T00:00:00Z,t,2.2
"

outData =
    "
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,string,string,double
#group,false,false,true,true,true,true,false
#default,_result,,,,,,
,result,table,_start,_stop,_measurement,_field,_value
,,0,2021-01-01T00:00:00Z,2021-01-03T01:00:00Z,m,t,4.8
"

t_sum = (table=<-) =>
    table
        |> range(start: 2021-01-01T00:00:00Z, stop: 2021-01-03T01:00:00Z)
        |> sum()

test _sum = () => ({input: csv.from(csv: inData), want: csv.from(csv: outData), fn: t_sum})

testing.inpsect(case: _sum)// Returns: {
//     fn: (<-table: [{_time: time | t10997}]) -> [t10996],
//     input: fromCSV -> range -> map,
//     want: fromCSV -> yield,
//     got: fromCSV -> range -> map -> range -> sum -> yield,
//     diff: ( fromCSV; fromCSV -> range -> map -> range -> sum;  ) -> diff -> yield
// }

```

