---
title: testing.benchmark() function
description: >
  The `testing.benchmark()` function allows for accurate benchmark tests by executing
  a test case without the additional overhead of comparing input and output tables.
menu:
  influxdb_2_0_ref:
    name: testing.benchmark
    parent: Testing
weight: 301
---

The `testing.benchmark()` function allows for accurate benchmark tests by executing
a test case without the additional overhead of comparing input and output tables.

_**Function type:** Test_  

```js
import "testing"

testing.benchmark(
  case: exampleTestCase
)
```

## Parameters

### case
Test case to benchmark.

_**Data type:** Function_

## Examples

##### Define and benchmark a test case
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
