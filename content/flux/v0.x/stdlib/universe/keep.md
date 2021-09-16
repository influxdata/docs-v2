---
title: keep() function
description: The `keep()` function returns a table containing only the specified columns.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/keep
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/keep/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/keep/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/keep/
menu:
  flux_0_x_ref:
    name: keep
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

The `keep()` function returns a table containing only the specified columns, ignoring all others.
Only columns in the group key that are also specified in the `keep()` function will be kept in the resulting group key.
_It is the inverse of [`drop`](/flux/v0.x/stdlib/universe/drop)._

```js
keep(columns: ["col1", "col2"])

// OR

keep(fn: (column) => column =~ /inodes*/)
```

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/flux/v0.x/spec/data-model/#match-parameter-names).
{{% /note %}}

### columns {data-type="array of strings"}

Columns that should be included in the resulting table.
Cannot be used with `fn`.

### fn {data-type="function"}

A predicate function which takes a column name as a parameter (`column`) and returns
a boolean indicating whether or not the column should be included in the resulting table.
Cannot be used with `columns`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Keep a list of columns](#keep-a-list-of-columns)
- [Keep columns matching a predicate](#keep-columns-matching-a-predicate)

#### Keep a list of columns

```js
import "sampledata"

sampledata.int()
  |> keep(columns: ["_time", "_value"])
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
| _time                | _value |
| :------------------- | -----: |
| 2021-01-01T00:00:00Z |     -2 |
| 2021-01-01T00:00:10Z |     10 |
| 2021-01-01T00:00:20Z |      7 |
| 2021-01-01T00:00:30Z |     17 |
| 2021-01-01T00:00:40Z |     15 |
| 2021-01-01T00:00:50Z |      4 |
| 2021-01-01T00:00:00Z |     19 |
| 2021-01-01T00:00:10Z |      4 |
| 2021-01-01T00:00:20Z |     -3 |
| 2021-01-01T00:00:30Z |     19 |
| 2021-01-01T00:00:40Z |     13 |
| 2021-01-01T00:00:50Z |      1 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Keep columns matching a predicate

```js
import "sampledata"

sampledata.int()
  |> keep(fn: (column) => column =~ /^_?t/)
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
| _time                | tag |
| :------------------- | :-- |
| 2021-01-01T00:00:00Z | t1  |
| 2021-01-01T00:00:10Z | t1  |
| 2021-01-01T00:00:20Z | t1  |
| 2021-01-01T00:00:30Z | t1  |
| 2021-01-01T00:00:40Z | t1  |
| 2021-01-01T00:00:50Z | t1  |

| _time                | tag |
| :------------------- | :-- |
| 2021-01-01T00:00:00Z | t2  |
| 2021-01-01T00:00:10Z | t2  |
| 2021-01-01T00:00:20Z | t2  |
| 2021-01-01T00:00:30Z | t2  |
| 2021-01-01T00:00:40Z | t2  |
| 2021-01-01T00:00:50Z | t2  |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
