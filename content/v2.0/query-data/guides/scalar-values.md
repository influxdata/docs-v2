---
title: Extract scalar values in Flux
description: >
  placeholder
menu:
  v2_0:
    name: Extract scalar values
    parent:  How-to guides
weight: 210
v2.0/tags: [scalar]
---

placeholder

```js
getFieldValue = (tables=<-, field) => {
  extract = tables
    |> tableFind(fn: (key) => key._field == field)
    |> getColumn(column: "_value")
  return extract[0]
}

getRowObject = (tables=<-, field) => {
  extract = tables
    |> tableFind(fn: (key) => key._field == field)
    |> getRecord(idx: 0)
  return extract
}

n_cpus = from(bucket: "default")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "system")
  |> getFieldValue(field: "n_cpus")

row = from(bucket: "default")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "system")
  |> getRowObject(field: "n_cpus")

from(bucket: "default")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "mem" and r._field == "used_percent")
  |> keep(columns: ["_time", "_field", "_value"])
  |> map(fn: (r) => ({ r with
    n_cpus: n_cpus,
    rowTime: row._time,
    rowCPUs: row._value,
    rowField: row._field
  }))
```
