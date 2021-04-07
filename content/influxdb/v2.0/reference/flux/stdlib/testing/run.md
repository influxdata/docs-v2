---
title: testing.run() function
description: The `testing.run()` function executes a specified test case.
menu:
  influxdb_2_0_ref:
    name: testing.run
    parent: Testing
weight: 301
---

The `testing.run()` function executes a specified test case.

_**Function type:** Test_  

```js
import "testing"

testing.run(
  case: exampleTestCase
)
```

## Parameters

### case
Test case to run.

_**Data type:** Function_

## Examples

##### Define and execute a test case
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

testing.run(case: _sum)
```
