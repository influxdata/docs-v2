---
title: sum() function
description: The `sum()` function computes the sum of non-null records in a specified column.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/sum
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/sum/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/sum/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/sum/
menu:
  flux_0_x_ref:
    name: sum
    parent: universe
weight: 102
flux/v0.x/tags: [aggregates, transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#sum, InfluxQL – SUM()
  - /flux/v0.x/stdlib/experimental/sum
introduced: 0.7.0
---

The `sum()` function computes the sum of non-null records in a specified column.
_`sum()` is an [aggregate function](/flux/v0.x/function-types/#aggregates)._

```js
sum(column: "_value")
```

## Parameters

### column {data-type="string"}
The column on which to operate.
Default is `"_value"`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

```js
import "sampledata"

sampledata.int()
    |> sum()
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| tag | _value |
| :-- | -----: |
| t1  |     51 |

| tag | _value |
| :-- | -----: |
| t2  |     53 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
