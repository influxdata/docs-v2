---
title: testing.benchmark() function
description: >
  The `testing.benchmark()` function executes a test case without comparing test output with the expected test output.
  This lets you accurately benchmark a test case without the added overhead of comparing
  test output that occurs in [`testing.run()`](/flux/v0.x/stdlib/testing/run/).
menu:
  flux_0_x_ref:
    name: testing.benchmark
    parent: testing
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/testing/benchmark/
  - /influxdb/cloud/reference/flux/stdlib/testing/benchmark/
weight: 301
flux/v0.x/tags: [tests, transformations]
introduced: 0.49.0
---

The `testing.benchmark()` function executes a test case without comparing test output with the expected test output.
This lets you accurately benchmark a test case without the added overhead of comparing
test output that occurs in [`testing.run()`](/flux/v0.x/stdlib/testing/run/).

```js
import "testing"

testing.benchmark(
  case: exampleTestCase
)
```

## Parameters

### case {data-type="function"}
Test case to benchmark.

## Examples

##### Define and benchmark a test case
The following script defines a test case for the `sum()` function and enables
[profilers](/flux/v0.x/stdlib/profiler/) to measure query performance.

```js
import "testing"
import "profiler"

option profiler.enabledProfilers = ["query", "operator"]

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

testing.benchmark(case: _sum)
```
