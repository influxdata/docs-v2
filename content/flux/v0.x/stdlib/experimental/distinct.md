---
title: experimental.distinct() function
description: >
  The `experimental.distinct()` function returns unique values from the `_value` column.
menu:
  flux_0_x_ref:
    name: experimental.distinct
    parent: experimental
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/distinct/
  - /influxdb/cloud/reference/flux/stdlib/experimental/distinct/
related:
  - /flux/v0.x/stdlib/universe/distinct/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#distinct, InfluxQL – DISTINCT()
introduced: 0.112.0
flux/v0.x/tags: [transformations, selectors]
---

The `experimental.distinct()` function returns unique values from the `_value` column.
The `_value` of each output record is set to a distinct value in the specified column.
`null` is considered a distinct value.
_`experimental.distinct()` is a [selector function](/flux/v0.x/function-types/#selectors)._

```js
import "experimental"

experimental.distinct()
```

#### Output schema
`experimental.distinct()` outputs a single table for each input table and does
the following:

- Outputs a single record for each distinct value.
- Drops all columns **not** in the group key.

{{% warn %}}
#### Empty tables
`experimental.distinct()` drops empty tables.
{{% /warn %}}

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data (`<-`).

## Examples

#### Return distinct values for each input table
```js
import "experimental"

data
	|> experimental.distinct()
```

{{< flex >}}
{{% flex-content "two-thirds" %}}
##### Input data
| _time                | _field | _value |
|:-----                |:------ | ------:|
| 2021-01-01T00:00:00Z | ver    | v1     |
| 2021-01-01T00:01:00Z | ver    | v1     |
| 2021-01-01T00:02:00Z | ver    | v2     |
| 2021-01-01T00:03:00Z | ver    |        |
| 2021-01-01T00:04:00Z | ver    | v3     |
| 2021-01-01T00:05:00Z | ver    | v3     |
{{% /flex-content %}}
{{% flex-content "third" %}}
##### Output data
| _value |
| ------:|
| v1     |
| v2     |
|        |
| v3     |
{{% /flex-content %}}
{{< /flex >}}

