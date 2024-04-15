---
title: pivot() function
description: >
  `pivot()` collects unique values stored vertically (column-wise) and aligns them
  horizontally (row-wise) into logical sets.
menu:
  flux_v0_ref:
    name: pivot
    parent: universe
    identifier: universe/pivot
weight: 101
flux/v0/tags: [transformations]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2047-L2055

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`pivot()` collects unique values stored vertically (column-wise) and aligns them
horizontally (row-wise) into logical sets.

### Output data
The group key of the resulting table is the same as the input tables,
excluding columns found in the `columnKey` and `valueColumn` parameters.
These columns are not part of the resulting output table and are dropped from
the group key.

Every input row should have a 1:1 mapping to a particular row and column
combination in the output table. Row and column combinations are determined
by the `rowKey` and `columnKey` parameters. In cases where more than one
value is identified for the same row and column pair, the last value
encountered in the set of table rows is used as the result.

The output is constructed as follows:

- The set of columns for the new table is the `rowKey` unioned with the group key,
  but excluding the columns indicated by the `columnKey` and the `valueColumn`.
- A new column is added to the set of columns for each unique value
  identified by the `columnKey` parameter.
- The label of a new column is the concatenation of the values of `columnKey`
  using `_` as a separator. If the value is null, "null" is used.
- A new row is created for each unique value identified by the
  `rowKey` parameter.
- For each new row, values for group key columns stay the same, while values
  for new columns are determined from the input tables by the value in
  `valueColumn` at the row identified by the `rowKey` values and the new
  column’s label. If no value is found, the value is set to `null`.
- Any column that is not part of the group key or not specified in the
  `rowKey`, `columnKey`, and `valueColumn` parameters is dropped.

##### Function type signature

```js
(<-tables: stream[A], columnKey: [string], rowKey: [string], valueColumn: string) => stream[B] where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### rowKey
({{< req >}})
Columns to use to uniquely identify an output row.



### columnKey
({{< req >}})
Columns to use to identify new output columns.



### valueColumn
({{< req >}})
Column to use to populate the value of pivoted `columnKey` columns.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Align fields into rows based on time](#align-fields-into-rows-based-on-time)
- [Associate values to tags by time](#associate-values-to-tags-by-time)

### Align fields into rows based on time

```js
data
    |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *_measurement | *_field | _value  |
| -------------------- | ------------- | ------- | ------- |
| 1970-01-01T00:00:01Z | m1            | f1      | 1       |
| 1970-01-01T00:00:01Z | m1            | f2      | 2       |
| 1970-01-01T00:00:01Z | m1            | f3      |         |
| 1970-01-01T00:00:02Z | m1            | f1      | 4       |
| 1970-01-01T00:00:02Z | m1            | f2      | 5       |
| 1970-01-01T00:00:02Z | m1            | f3      | 6       |
| 1970-01-01T00:00:03Z | m1            | f1      |         |
| 1970-01-01T00:00:03Z | m1            | f2      | 7       |
| 1970-01-01T00:00:04Z | m1            | f3      | 8       |


#### Output data

| _time                | *_measurement | f1  | f2  | f3  |
| -------------------- | ------------- | --- | --- | --- |
| 1970-01-01T00:00:01Z | m1            | 1   | 2   |     |
| 1970-01-01T00:00:02Z | m1            | 4   | 5   | 6   |
| 1970-01-01T00:00:03Z | m1            |     | 7   |     |
| 1970-01-01T00:00:04Z | m1            |     |     | 8   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Associate values to tags by time

```js
import "sampledata"

sampledata.int()
    |> pivot(rowKey: ["_time"], columnKey: ["tag"], valueColumn: "_value")

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time                | t1  | t2  |
| -------------------- | --- | --- |
| 2021-01-01T00:00:00Z | -2  | 19  |
| 2021-01-01T00:00:10Z | 10  | 4   |
| 2021-01-01T00:00:20Z | 7   | -3  |
| 2021-01-01T00:00:30Z | 17  | 19  |
| 2021-01-01T00:00:40Z | 15  | 13  |
| 2021-01-01T00:00:50Z | 4   | 1   |

{{% /expand %}}
{{< /expand-wrapper >}}
