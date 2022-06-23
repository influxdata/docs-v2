---
title: testing.loadStorage() function
description: >
  loadStorage loads annotated CSV test data as if it were queried from InfluxDB.
  This function ensures tests behave correctly in both the Flux and InfluxDB test suites.
menu:
  flux_ref:
    name: testing.loadStorage
    parent: testing
tags: <comma-delimited list of tag strings>
introduced: <metadata-introduced>
deprecated: <metadata-deprecated>
---
​
`testing.loadStorage(csv:string) => [{A with _time:time, _time:time, _stop:time, _start:time, _measurement:C, _measurement:C, _field:B, _field:B}]` loadStorage loads annotated CSV test data as if it were queried from InfluxDB.
This function ensures tests behave correctly in both the Flux and InfluxDB test suites.
​
## Function Requirements
- Test data requires the _field, _measurement, and _time columns

- `csv` is the annotated CSV data to load
​
##### Function type signature
```js
testing.loadStorage(csv:string) => [{A with _time:time, _time:time, _stop:time, _start:time, _measurement:C, _measurement:C, _field:B, _field:B}]
```
​
## Parameters
​

### 
​

​

​

## Examples
​
