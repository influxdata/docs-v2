---
title: experimental.unique() function
description: >
  The `experimental.unique()` function returns all records containing unique
  values in the `_value` column.
menu:
  influxdb_2_0_ref:
    name: experimental.unique
    parent: Experimental
weight: 302
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/unique/
introduced: 0.112.0
---

The `experimental.unique()` function returns all records containing unique
values in the `_value` column.
`null` is considered a unique value.

_**Function type:** Selector_

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

### tables
Input data.
Default is pipe-forwarded data.

_**Data type:** String_

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
