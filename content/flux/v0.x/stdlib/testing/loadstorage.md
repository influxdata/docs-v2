---
title: testing.loadStorage() function
description: >
  The `testing.loadStorage()` function loads annotated CSV test data as if it were queried from InfluxDB.
  This function ensures tests behave correctly in both the Flux and InfluxDB test suites.
menu:
  flux_0_x_ref:
    name: testing.loadStorage
    parent: testing
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/testing/loadstorage/
  - /influxdb/cloud/reference/flux/stdlib/testing/loadstorage/
weight: 301
flux/v0.x/tags: [tests, inputs]
introduced: 0.20.0
---

The `testing.loadStorage()` function loads [annotated CSV](/influxdb/cloud/reference/syntax/annotated-csv/)
test data as if it were queried from InfluxDB.
This function ensures tests behave correctly in both the Flux and InfluxDB test suites.
Test data requires the following columns:

- `_field`
- `_measurement`
- `_time` 

```js
import "testing"

testing.loadStorage(
  csv: csvData
)
```

## Parameters

### csv {data-type="string"}
[Annotated CSV](/influxdb/cloud/reference/syntax/annotated-csv/) data to load.

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

testing.loadStorage(csv: csvData)
```
