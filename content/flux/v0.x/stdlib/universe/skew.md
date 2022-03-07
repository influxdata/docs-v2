---
title: skew() function
description: The `skew()` function outputs the skew of non-null records as a float.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/skew
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/skew/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/skew/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/skew/
menu:
  flux_0_x_ref:
    name: skew
    parent: universe
weight: 102
related:
  - /flux/v0.x/stdlib/experimental/skew/
flux/v0.x/tags: [aggregates, transformations]
introduced: 0.7.0
---

The `skew()` function outputs the skew of non-null records as a float.
_`skew()` is an [aggregate function](/flux/v0.x/function-types/#aggregates)._

_**Output data type:** Float_

```js
skew(column: "_value")
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
    |> skew()
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
| tag |               _value |
| :-- | -------------------: |
| t1  | -0.22375476930534782 |

| tag |               _value |
| :-- | -------------------: |
| t2  | -0.01972080701262574 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
