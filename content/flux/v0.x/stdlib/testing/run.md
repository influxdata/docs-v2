---
title: testing.run() function
description: >
  `testing.run()` executes a specified test case.
menu:
  flux_0_x_ref:
    name: testing.run
    parent: testing
    identifier: testing/run
weight: 101

introduced: 0.20.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/testing/testing.flux#L315-L317

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`testing.run()` executes a specified test case.



##### Function type signature

```js
(case: () => {A with want: stream[C], input: B, fn: (<-: B) => stream[C]}) => stream[{C with _diff: string}] where C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### case
({{< req >}})
Test case to run.




## Examples

### Define and execute a test case

```js
import "csv"
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

testing.run(case: _sum)
```

