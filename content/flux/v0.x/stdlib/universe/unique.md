---
title: unique() function
description: The `unique()` function returns all records containing unique values in a specified column.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/unique
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/unique/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/unique/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/unique/
menu:
  flux_0_x_ref:
    name: unique
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
introduced: 0.7.0
---

The `unique()` function returns all records containing unique values in a specified column.
Group keys, record columns, and values are **not** modified.

```js
unique(column: "_value")
```

{{% warn %}}
#### Empty tables
`unique()` drops empty tables.
{{% /warn %}}

## Parameters

### column {data-type="string"}
Column to search for unique values.
Defaults to `"_value"`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
```js
from("example-bucket")
 |> range(start: -15m)
 |> filter(fn: (r) => r._measurement == "syslog")
 |> unique(column: "message")
```
