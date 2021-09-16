---
title: experimental.unique() function
description: >
  The `experimental.unique()` function returns all records containing unique
  values in the `_value` column.
menu:
  flux_0_x_ref:
    name: experimental.unique
    parent: experimental
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/unique/
  - /influxdb/cloud/reference/flux/stdlib/experimental/unique/
related:
  - /flux/v0.x/stdlib/universe/unique/
flux/v0.x/tags: [transformations, selectors]
introduced: 0.112.0
---

The `experimental.unique()` function returns all records containing unique
values in the `_value` column.
`null` is considered a unique value.
_`experimental.unique()` is a [selector function](/flux/v0.x/function-types/#selectors)._

```js
import "experimental"
experimental.unique()
```

#### Output schema
`experimental.unique()` outputs a single table for each input table and does
the following:

- Outputs a single record for each unique value.
- Leaves group keys, columns, and values **unmodified**.

{{% warn %}}
#### Empty tables
`experimental.unique()` drops empty tables.
{{% /warn %}}

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data (`<-`).

## Examples
```js
import "experimental"
data
 |> experimental.unique()
```

{{< flex >}}
{{% flex-content %}}
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
{{% flex-content %}}
##### Output data
| _time                | _field | _value |
|:-----                |:------ | ------:|
| 2021-01-01T00:00:00Z | ver    | v1     |
| 2021-01-01T00:02:00Z | ver    | v2     |
| 2021-01-01T00:03:00Z | ver    |        |
| 2021-01-01T00:04:00Z | ver    | v3     |
{{% /flex-content %}}
{{< /flex >}}