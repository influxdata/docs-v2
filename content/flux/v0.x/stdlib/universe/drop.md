---
title: drop() function
description: The `drop()` function removes specified columns from a table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/drop
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/drop/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/drop/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/drop/
menu:
  flux_0_x_ref:
    name: drop
    parent: universe
weight: 102
related:
  - /flux/v0.x/stdlib/universe/keep/
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

The `drop()` function removes specified columns from a table.
Columns are specified either through a list or a predicate function.
When a dropped column is part of the group key, it will be removed from the key.
If a specified column is not present in a table, it will return an error.

```js
drop(columns: ["col1", "col2"])

// OR

drop(fn: (column) => column =~ /usage*/)
```

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/flux/v0.x/spec/data-model/#match-parameter-names).
{{% /note %}}

### columns {data-type="array of strings"}
Columns to removed from input tables.
_Mutually exclusive with `fn`._

### fn {data-type="function"}
[Predicate function](/flux/v0.x/get-started/syntax-basics/#predicate-functions)
with a `column` parameter that returns a boolean value indicating whether or not
the column should be removed from input tables.
_Mutually exclusive with `columns`._

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Drop a list of columns](#drop-a-list-of-columns)
- [Drop columns matching a predicate](#drop-columns-matching-a-predicate)

#### Drop a list of columns

```js
import "sampledata"

sampledata.int()
  |> drop(columns: ["_time", "tid"])
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
| _value |
| -----: |
|     -2 |
|     10 |
|      7 |
|     17 |
|     15 |
|      4 |
|     19 |
|      4 |
|     -3 |
|     19 |
|     13 |
|      1 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Drop columns matching a predicate

```js
import "sampledata"

sampledata.int()
  |> drop(fn: (column) => column =~ /^t/)
```

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
