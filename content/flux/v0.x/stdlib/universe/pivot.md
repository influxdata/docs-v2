---
title: pivot() function
description: The `pivot()` function collects values stored vertically (column-wise) in a table and aligns them horizontally (row-wise) into logical sets.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/pivot
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/pivot/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/pivot/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/pivot/
menu:
  flux_0_x_ref:
    name: pivot
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

The `pivot()` function collects values stored vertically (column-wise) in a table
and aligns them horizontally (row-wise) into logical sets.

```js
pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
```

The group key of the resulting table is the same as the input tables, excluding columns found in the [`columnKey`](#columnkey) and [`valueColumn`](#valuecolumn) parameters.
This is because these columns are not part of the resulting output table.  

Every input row should have a 1:1 mapping to a particular row + column in the output table, determined by its values for the [`rowKey`](#rowkey) and [`columnKey`](#columnkey) parameters.
In cases where more than one value is identified for the same row + column pair, the last value
encountered in the set of table rows is used as the result.

The output is constructed as follows:

- The set of columns for the new table is the `rowKey` unioned with the group key,
  but excluding the columns indicated by the `columnKey` and the `valueColumn`.
- A new column is added to the set of columns for each unique value identified
  in the input by the `columnKey` parameter.
- The label of a new column is the concatenation of the values of `columnKey` using `_` as a separator.
  If the value is `null`, `"null"` is used.
- A new row is created for each unique value identified in the input by the `rowKey` parameter.
- For each new row, values for group key columns stay the same, while values for new columns are
  determined from the input tables by the value in `valueColumn` at the row identified by the
  `rowKey` values and the new column's label.
  If no value is found, the value is set to `null`.
- Any column that is not part of the group key or not specified in the `rowKey`,
  `columnKey` and `valueColumn` parameters is dropped.

## Parameters

### rowKey {data-type="array of strings"}
List of columns used to uniquely identify a row for the output.

### columnKey {data-type="array of strings"}
List of columns used to pivot values onto each row identified by the rowKey.

### valueColumn {data-type="string"}
Column that contains the value to be moved around the pivot.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

- [Align fields within each measurement that have the same timestamp](#align-fields-within-each-measurement-that-have-the-same-timestamp)
- [Align fields and measurements that have the same timestamp ](#align-fields-and-measurements-that-have-the-same-timestamp )
- [Align values for each tag](#align-values-for-each-tag)

#### Align fields within each measurement that have the same timestamp

```js
data
  |> pivot(
    rowKey:["_time"],
    columnKey: ["_field"],
    valueColumn: "_value"
  )
```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}
##### Input data
| _time                | _measurement | _field | _value |
| :------------------- | :----------: | :----: | :----: |
| 1970-01-01T00:00:01Z |      m1      |   f1   |  1.0   |
| 1970-01-01T00:00:01Z |      m1      |   f2   |  2.0   |
| 1970-01-01T00:00:01Z |      m1      |   f3   |        |
| 1970-01-01T00:00:01Z |      m1      |        |  3.0   |
| 1970-01-01T00:00:02Z |      m1      |   f1   |  4.0   |
| 1970-01-01T00:00:02Z |      m1      |   f2   |  5.0   |
|                      |      m1      |   f2   |  6.0   |
| 1970-01-01T00:00:02Z |      m1      |   f3   |        |
| 1970-01-01T00:00:03Z |      m1      |   f1   |        |
| 1970-01-01T00:00:03Z |      m1      |        |  7.0   |
| 1970-01-01T00:00:04Z |      m1      |   f3   |  8.0   |

##### Output data
| _time                | _measurement |  f1 |  f2 |  f3 | null |
| :------------------- | :----------: | --: | --: | --: | ---: |
| 1970-01-01T00:00:01Z |      m1      | 1.0 | 2.0 |     |  3.0 |
| 1970-01-01T00:00:02Z |      m1      | 4.0 | 5.0 |     |      |
|                      |      m1      |     | 6.0 |     |      |
| 1970-01-01T00:00:03Z |      m1      |     |     |     |  7.0 |
| 1970-01-01T00:00:04Z |      m1      |     |     | 8.0 |      |
{{% /expand %}}
{{< /expand-wrapper >}}

#### Align fields and measurements that have the same timestamp

{{% note %}}
###### Note the effects of:
- Having _null_ values in some `columnKey` values.
- Having more values for the same `rowKey` and `columnKey` value
  (the 11th row overrides the 10th, and so does the 15th with the 14th).
{{% /note %}}

```js
data
  |> pivot(
    rowKey:["_time"],
    columnKey: ["_measurement", "_field"],
    valueColumn: "_value"
  )
```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}
##### Input data
| _time                | _measurement | _field | _value |
| :------------------- | :----------: | :----: | -----: |
| 1970-01-01T00:00:01Z |      m1      |   f1   |    1.0 |
| 1970-01-01T00:00:01Z |      m1      |   f2   |    2.0 |
| 1970-01-01T00:00:01Z |              |   f3   |    3.0 |
| 1970-01-01T00:00:01Z |              |        |    4.0 |
| 1970-01-01T00:00:02Z |      m1      |   f1   |    5.0 |
| 1970-01-01T00:00:02Z |      m1      |   f2   |    6.0 |
| 1970-01-01T00:00:02Z |      m1      |   f3   |    7.0 |
| 1970-01-01T00:00:02Z |              |        |    8.0 |
|                      |      m1      |   f3   |    9.0 |
| 1970-01-01T00:00:03Z |      m1      |        |   10.0 |
| 1970-01-01T00:00:03Z |      m1      |        |   11.0 |
| 1970-01-01T00:00:03Z |      m1      |   f3   |   12.0 |
| 1970-01-01T00:00:03Z |              |        |   13.0 |
|                      |      m1      |        |   14.0 |
|                      |      m1      |        |   15.0 |

##### Output data
| _time                | m1_f1 | m1_f2 | null_f3 | null_null | m1_f3 | m1_null |
| :------------------- | ----: | ----: | ------: | --------: | ----: | ------: |
| 1970-01-01T00:00:01Z |   1.0 |   2.0 |     3.0 |       4.0 |       |         |
| 1970-01-01T00:00:02Z |   5.0 |   6.0 |         |       8.0 |   7.0 |         |
|                      |       |       |         |           |   9.0 |    15.0 |
| 1970-01-01T00:00:03Z |       |       |         |      13.0 |  12.0 |    11.0 |
{{% /expand %}}
{{< /expand-wrapper >}}

#### Align values for each tag
{{% flux/sample-example-intro %}}

```js
import "sampledata"

sampledata.int()
  |> pivot(
    rowKey: ["_time"],
    columnKey: ["tag"],
    valueColumn: "_value"
  )
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
| _time                |  t1 |  t2 |
| :------------------- | --: | --: |
| 2021-01-01T00:00:00Z |  -2 |  19 |
| 2021-01-01T00:00:10Z |  10 |   4 |
| 2021-01-01T00:00:20Z |   7 |  -3 |
| 2021-01-01T00:00:30Z |  17 |  19 |
| 2021-01-01T00:00:40Z |  15 |  13 |
| 2021-01-01T00:00:50Z |   4 |   1 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
