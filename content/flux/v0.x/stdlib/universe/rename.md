---
title: rename() function
description: The `rename()` function renames specified columns in a table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/rename
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/rename/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/rename/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/rename/
menu:
  flux_0_x_ref:
    name: rename
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

The `rename()` function renames specified columns in a table.
If a column is renamed and is part of the group key, the column name in the group key will be updated.

There are two variants:

- one which maps old column names to new column names
- one which takes a mapping function.

```js
rename(columns: {host: "server", facility: "datacenter"})

// OR

rename(fn: (column) => "{column}_new")
```

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/flux/v0.x/spec/data-model/#match-parameter-names).
{{% /note %}}

### columns {data-type="record"}

A map of columns to rename and their corresponding new names.
Cannot be used with `fn`.

### fn {data-type="function"}

A function mapping between old and new column names.
Cannot be used with `columns`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Rename specific columns](#rename-specific-columns)
- [Rename all columns using a function](#rename-all-columns-using-a-function)

#### Rename specific columns

```js
import "sampledata"

sampledata.int()
  |> rename(columns: {tag: "uid", _value: "val"})
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
| _time                | uid | val |
| :------------------- | :-- | --: |
| 2021-01-01T00:00:00Z | t1  |  -2 |
| 2021-01-01T00:00:10Z | t1  |  10 |
| 2021-01-01T00:00:20Z | t1  |   7 |
| 2021-01-01T00:00:30Z | t1  |  17 |
| 2021-01-01T00:00:40Z | t1  |  15 |
| 2021-01-01T00:00:50Z | t1  |   4 |

| _time                | uid | val |
| :------------------- | :-- | --: |
| 2021-01-01T00:00:00Z | t2  |  19 |
| 2021-01-01T00:00:10Z | t2  |   4 |
| 2021-01-01T00:00:20Z | t2  |  -3 |
| 2021-01-01T00:00:30Z | t2  |  19 |
| 2021-01-01T00:00:40Z | t2  |  13 |
| 2021-01-01T00:00:50Z | t2  |   1 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}


#### Rename all columns using a function

```js
import "sampledata"

sampledata.int()
  |> rename(fn: (column) => "${column}_new")
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
| _time_new            | tag_new | _value_new |
| :------------------- | :------ | ---------: |
| 2021-01-01T00:00:00Z | t1      |         -2 |
| 2021-01-01T00:00:10Z | t1      |         10 |
| 2021-01-01T00:00:20Z | t1      |          7 |
| 2021-01-01T00:00:30Z | t1      |         17 |
| 2021-01-01T00:00:40Z | t1      |         15 |
| 2021-01-01T00:00:50Z | t1      |          4 |

| _time_new            | tag_new | _value_new |
| :------------------- | :------ | ---------: |
| 2021-01-01T00:00:00Z | t2      |         19 |
| 2021-01-01T00:00:10Z | t2      |          4 |
| 2021-01-01T00:00:20Z | t2      |         -3 |
| 2021-01-01T00:00:30Z | t2      |         19 |
| 2021-01-01T00:00:40Z | t2      |         13 |
| 2021-01-01T00:00:50Z | t2      |          1 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
