---
title: bottom() function
description: The `bottom()` function sorts a table by columns and keeps only the bottom n records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/bottom
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/bottom/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/bottom/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/bottom/
menu:
  flux_0_x_ref:
    name: bottom
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#bottom, InfluxQL – BOTTOM()
introduced: 0.7.0
---

The `bottom()` function sorts a table by columns and keeps only the bottom `n` records.
_`bottom()` is a [selector function](/flux/v0.x/function-types/#selectors)._

```js
bottom(n:10, columns: ["_value"])
```

{{% warn %}}
#### Empty tables
`bottom()` drops empty tables.
{{% /warn %}}

## Parameters

### n {data-type="int"}
Number of records to return.

### columns {data-type="array of strings"}
List of columns by which to sort.
Sort precedence is determined by list order (left to right).
Default is `["_value"]`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

#### Return rows with the two lowest values
```js
import "sampledata"

sampledata.int()
  |> bottom(n:2)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample set="int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t1  |     -2 |
| 2021-01-01T00:00:50Z | t1  |      4 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:20Z | t2  |     -3 |
| 2021-01-01T00:00:50Z | t2  |      1 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

## Function definition
```js
// _sortLimit is a helper function, which sorts and limits a table.
_sortLimit = (n, desc, columns=["_value"], tables=<-) =>
  tables
    |> sort(columns:columns, desc:desc)
    |> limit(n:n)

bottom = (n, columns=["_value"], tables=<-) =>
  _sortLimit(n:n, columns:columns, desc:false)
```
