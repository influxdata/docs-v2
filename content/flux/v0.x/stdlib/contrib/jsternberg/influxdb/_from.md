---
title: influxdb._from() function
description: >
  _from allows us to reference the from function from
  within the select call which has a function parameter
  with the same name.
menu:
  flux_ref:
    name: influxdb._from
    parent: influxdb
tags: <comma-delimited list of tag strings>
introduced: <metadata-introduced>
deprecated: <metadata-deprecated>
---
​
`influxdb._from(bucket:string, start:A, ?host:string, ?org:string, ?stop:time, ?token:string) => [{B with _value:C, _time:time, _stop:time, _start:time, _measurement:string, _field:string}]` _from allows us to reference the from function from
within the select call which has a function parameter
with the same name.
​

​
##### Function type signature
```js
influxdb._from(bucket:string, start:A, ?host:string, ?org:string, ?stop:time, ?token:string) => [{B with _value:C, _time:time, _stop:time, _start:time, _measurement:string, _field:string}]
```
​
## Parameters
​


## Examples
​
