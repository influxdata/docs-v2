---
title: testing.loadMem() function
description: >
  The `testing.loadMem()` function loads annotated CSV test data from memory to
  emulate query results returned by Flux.
menu:
  flux_0_x_ref:
    name: testing.loadMem
    parent: testing
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/testing/loadmem/
  - /influxdb/cloud/reference/flux/stdlib/testing/loadmem/
weight: 301
flux/v0.x/tags: [tests, inputs]
introduced: 0.20.0
---

The `testing.loadMem()` function loads [annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/)
test data from memory to emulate query results returned by Flux.

_**Function type:** Test_  

```js
import "testing"

testing.loadMem(
  csv: csvData
)
```

## Parameters

### csv
[Annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/) data to load.

## Examples

```js
import "testing"

csvData = "
#datatype,string,long,string,dateTime:RFC3339,string,double
#group,false,false,true,false,true,false
#default,_result,,,,,
,result,table,_measurement,_time,_field,_value
,,0,m,2021-01-01T00:00:00Z,t,1.2
,,0,m,2021-01-02T00:00:00Z,t,1.4
,,0,m,2021-01-03T00:00:00Z,t,2.2
"

testing.loadMem(csv: csvData)
```
