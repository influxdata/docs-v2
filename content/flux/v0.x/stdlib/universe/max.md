---
title: max() function
description: The `max()` function selects record with the highest _value from the input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/max  
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/max/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/max/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/max/
menu:
  flux_0_x_ref:
    name: max
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#max, InfluxQL – MAX()
introduced: 0.7.0
---

The `max()` function selects record with the highest `_value` from the input table.

```js
max(column: "_value")
```

{{% warn %}}
#### Empty tables
`max()` drops empty tables.
{{% /warn %}}

## Parameters

### column {data-type="string"}
The column to use to calculate the maximum value.
Default is `"_value"`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

```js
import "sampledata"

sampledata.int()
  |> max()
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:30Z | t1  |     17 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |     19 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
