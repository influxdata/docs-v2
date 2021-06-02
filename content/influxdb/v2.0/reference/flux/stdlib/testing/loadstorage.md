---
title: testing.loadStorage() function
description: >
  The `testing.loadStorage()` function loads annotated CSV test data as if it were queried from InfluxDB.
  This function ensures tests behave correctly in both the Flux and InfluxDB test suites.
menu:
  influxdb_2_0_ref:
    name: testing.loadStorage
    parent: Testing
weight: 301
---

The `testing.loadStorage()` function loads [annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/)
test data as if it were queried from InfluxDB.
This function ensures tests behave correctly in both the Flux and InfluxDB test suites.
Test data requires the following columns:

- `_field`
- `_measurement`
- `_time`

_**Function type:** Test_  

```js
import "testing"

testing.loadStorage(
  csv: csvData
)
```

## Parameters

### csv
[Annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/) data to load.

_**Data type:** String_

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
