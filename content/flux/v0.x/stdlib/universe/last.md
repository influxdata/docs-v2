---
title: last() function
description: The `last()` function selects the last non-null record from an input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/last
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/last/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/last/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/last/
menu:
  flux_0_x_ref:
    name: last
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/first-last/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#last, InfluxQL – LAST()
introduced: 0.7.0
---

The `last()` function selects the last non-null record from an input table.
_`last()` is a [selector function](/flux/v0.x/function-types/#selectors)._

```js
last(column: "_value")
```

{{% warn %}}
#### Empty tables
`last()` drops empty tables.
{{% /warn %}}

## Parameters

### column {data-type="string"}
Column used to verify the existence of a value.
If this column is _null_ in the last record, `last()` returns the previous
record with a non-null value.
Default is `"_value"`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

```js
import "sampledata"

sampledata.int()
  |> last()
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| tag | _time                | _value |
| :-- | :------------------- | -----: |
| t1  | 2021-01-01T00:00:50Z |      4 |

| tag | _time                | _value |
| :-- | :------------------- | -----: |
| t2  | 2021-01-01T00:00:50Z |      1 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
