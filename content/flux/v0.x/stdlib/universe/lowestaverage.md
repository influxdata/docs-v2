---
title: lowestAverage() function
description: The `lowestAverage()` function calculates the average of each table in the input stream returns the lowest `n` records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/lowestaverage
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/lowestaverage/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/lowestaverage/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/lowestaverage/
menu:
  flux_0_x_ref:
    name: lowestAverage
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
introduced: 0.7.0
---

The `lowestAverage()` function calculates the average of each table in the input stream returns the lowest `n` records.
It outputs a single aggregated table containing `n` records.

```js
lowestAverage(
  n:10,
  column: "_value",
  groupColumns: []
)
```

{{% warn %}}
#### Empty tables
`lowestAverage()` drops empty tables.
{{% /warn %}}

## Parameters

### n {data-type="int"}
Number of records to return.

### column {data-type="string"}
Column by which to sort.
Default is `"_value"`.

### groupColumns {data-type="array of strings"}
The columns on which to group before performing the aggregation.
Default is `[]`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
```js
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> lowestAverage(n:10, groupColumns: ["host"])
```

## Function definition
```js
// _sortLimit is a helper function, which sorts and limits a table.
_sortLimit = (n, desc, columns=["_value"], tables=<-) =>
  tables
    |> sort(columns:columns, desc:desc)
    |> limit(n:n)

// _highestOrLowest is a helper function which reduces all groups into a single
// group by specific tags and a reducer function. It then selects the highest or
// lowest records based on the column and the _sortLimit function.
// The default reducer assumes no reducing needs to be performed.
_highestOrLowest = (n, _sortLimit, reducer, column="_value", groupColumns=[], tables=<-) =>
  tables
    |> group(columns:groupColumns)
    |> reducer()
    |> group(columns:[])
    |> _sortLimit(n:n, columns:[column])

lowestAverage = (n, column="_value", groupColumns=[], tables=<-) =>
  tables
    |> _highestOrLowest(
        n:n,
        column:column,
        groupColumns:groupColumns,
        reducer: (tables=<-) => tables |> mean(column:column]),
        _sortLimit: bottom,
      )

```
