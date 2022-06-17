---
title: testing.benchmark() function
description: >
  `testing.benchmark()` executes a test case without comparing test output with the expected test output.
  This lets you accurately benchmark a test case without the added overhead of
  comparing test output that occurs in `testing.run()`.
menu:
  flux_0_x_ref:
    name: testing.benchmark
    parent: testing
    identifier: testing/benchmark
weight: 101

introduced: 0.49.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/testing/testing.flux#L353-L357

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`testing.benchmark()` executes a test case without comparing test output with the expected test output.
This lets you accurately benchmark a test case without the added overhead of
comparing test output that occurs in `testing.run()`.



##### Function type signature

```js
testing.benchmark = (case: () => {A with input: B, fn: (<-: B) => C}) => C
```

## Parameters

### case
({{< req >}})
Test case to benchmark.




## Examples

### Define and benchmark a test case

The following script defines a test case for the sum() function and enables
profilers to measure query performance.

```js
import "csv"
import "testing"
import "profiler"

option profiler.enabledProfilers = ["query", "operator"]

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

testing.benchmark(case: _sum)
```

