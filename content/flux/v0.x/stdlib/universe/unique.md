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
{{% flux/sample-example-intro %}}

```js
import "sampledata"

sampledata.int()
  |> unique()
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
| tag | _time                | _value |
| :-- | :------------------- | -----: |
| t1  | 2021-01-01T00:00:00Z |     -2 |
| t1  | 2021-01-01T00:00:10Z |     10 |
| t1  | 2021-01-01T00:00:20Z |      7 |
| t1  | 2021-01-01T00:00:30Z |     17 |
| t1  | 2021-01-01T00:00:40Z |     15 |
| t1  | 2021-01-01T00:00:50Z |      4 |

| tag | _time                | _value |
| :-- | :------------------- | -----: |
| t2  | 2021-01-01T00:00:00Z |     19 |
| t2  | 2021-01-01T00:00:10Z |      4 |
| t2  | 2021-01-01T00:00:20Z |     -3 |
| t2  | 2021-01-01T00:00:40Z |     13 |
| t2  | 2021-01-01T00:00:50Z |      1 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
