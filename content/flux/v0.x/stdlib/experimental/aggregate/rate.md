---
title: aggregate.rate() function
description: >
  The `aggregate.rate()` function calculates the rate of change per windows of time.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/aggregate/rate/
  - /influxdb/cloud/reference/flux/stdlib/experimental/aggregate/rate/
menu:
  flux_0_x_ref:
    name: aggregate.rate
    parent: aggregate
weight: 301
flux/v0.x/tags: [transformations, aggregate]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/rate/
introduced: 0.61.0
---

The `aggregate.rate()` function calculates the rate of change per windows of time
for each input table.

```js
import "experimental/aggregate"

aggregate.rate(
  every: 1m,
  groupColumns: ["column1", "column2"],
  unit: 1s
)
```

`aggregate.rate()` requires that input data have `_start` and `_stop` columns to
calculate windows of time to operate on. Use [`range()`](/flux/v0.x/stdlib/universe/range/)
to assign `_start` and `_stop` values.

## Parameters

### every {data-type="duration"}
({{< req >}}) Duration of time windows.

### groupColumns {data-type="array of strings"}
List of columns to group by. Default is `[]`.

### unit {data-type="duration"}
The time duration to use when calculating the rate. Default is `1s`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

### Calculate the average rate of change in sample data
{{% flux/sample-example-intro %}}

```js
import "experimental/aggregate"
import "sampledata"

data = sampledata.int()
  |> range(start: sampledata.start, stop: sampledata.stop)

data  
  |> aggregate.rate(
    every: 30s,
    unit: 1s,
    groupColumns: ["tag"]
  )
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
##### Input data
{{% flux/sample set="int" includeRange=true %}}

##### Output data
| _start              | _stop               | _time               | tag | _value |
| :------------------ | :------------------ | :------------------ | :-- | -----: |
| 2021-01-01T00:00:00 | 2021-01-01T00:01:00 | 2021-01-01T00:00:30 | t1  |    1.2 |
| 2021-01-01T00:00:00 | 2021-01-01T00:01:00 | 2021-01-01T00:01:00 | t1  |    1.0 |

| _start              | _stop               | _time               | tag | _value |
| :------------------ | :------------------ | :------------------ | :-- | -----: |
| 2021-01-01T00:00:00 | 2021-01-01T00:01:00 | 2021-01-01T00:00:30 | t2  |        |
| 2021-01-01T00:00:00 | 2021-01-01T00:01:00 | 2021-01-01T00:01:00 | t2  |    2.2 |
{{% /expand %}}
{{< /expand-wrapper >}}

## Function definition
```js
package aggregate

import "experimental"

rate = (tables=<-, every, groupColumns=[], unit=1s) =>
  tables
    |> derivative(nonNegative:true, unit:unit)
    |> aggregateWindow(every: every, fn : (tables=<-, column) =>
      tables
        |> mean(column: column)
        |> group(columns: groupColumns)
        |> experimental.group(columns: ["_start", "_stop"], mode:"extend")
        |> sum()
    )
```

_**Used functions:**_  
[aggregateWindow()](/flux/v0.x/stdlib/universe/aggregatewindow/)  
[derivative()](/flux/v0.x/stdlib/universe/derivative/)  
[experimental.group()](/flux/v0.x/stdlib/experimental/group/)  
[group()](/flux/v0.x/stdlib/universe/group/)  
[mean()](/flux/v0.x/stdlib/universe/mean/)  
[sum()](/flux/v0.x/stdlib/universe/sum/)  
