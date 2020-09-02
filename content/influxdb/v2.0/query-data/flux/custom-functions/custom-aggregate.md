---
title: Create custom aggregate functions
description: Create your own custom aggregate functions in Flux using the `reduce()` function.
influxdb/v2.0/tags: [functions, custom, flux, aggregates]
menu:
  influxdb_2_0:
    name: Custom aggregate functions
    parent: Custom functions
weight: 301
aliases:
  - /influxdb/v2.0/query-data/guides/custom-functions/custom-aggregate/
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/reduce/
---

To aggregate your data, use the Flux
[built-in aggregate functions](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/)
or create custom aggregate functions using the
[`reduce()`function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/reduce/).

## Aggregate function characteristics
Aggregate functions all have the same basic characteristics:

- They operate on individual input tables and transform all records into a single record.
- The output table has the same [group key](/influxdb/v2.0/query-data/get-started/#group-keys) as the input table.

## How reduce() works
The `reduce()` function operates on one row at a time using the function defined in
the [`fn` parameter](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/reduce/#fn).
The `fn` function maps keys to specific values using two [records](/influxdb/v2.0/query-data/get-started/syntax-basics/#records)
specified by the following parameters:

| Parameter     | Description                                                             |
|:---------:    |:-----------                                                             |
| `r`           | A record that represents the row or record.                             |
| `accumulator` | A record that contains values used in each row's aggregate calculation. |

{{% note %}}
The `reduce()` function's [`identity` parameter](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/reduce/#identity)
defines the initial `accumulator` record.
{{% /note %}}

### Example reduce() function
The following example `reduce()` function produces a sum and product of all values
in an input table.

```js
|> reduce(fn: (r, accumulator) => ({
    sum: r._value + accumulator.sum,
    product: r._value * accumulator.product
  }),
  identity: {sum: 0.0, product: 1.0}
)
```

To illustrate how this function works, take this simplified table for example:

| _time                | _value |
|:-----                | ------:|
| 2019-04-23T16:10:49Z | 1.6    |
| 2019-04-23T16:10:59Z | 2.3    |
| 2019-04-23T16:11:09Z | 0.7    |
| 2019-04-23T16:11:19Z | 1.2    |
| 2019-04-23T16:11:29Z | 3.8    |

###### Input records
The `fn` function uses the data in the first row to define the `r` record.
It defines the `accumulator` record using the `identity` parameter.

```js
r           = { _time: 2019-04-23T16:10:49.00Z, _value: 1.6 }
accumulator = { sum  : 0.0, product : 1.0 }
```

###### Key mappings
It then uses the `r` and `accumulator` records to populate values in the key mappings:
```js
// sum: r._value + accumulator.sum
sum: 1.6 + 0.0

// product: r._value * accumulator.product
product: 1.6 * 1.0
```

###### Output record
This produces an output record with the following key value pairs:

```js
{ sum: 1.6, product: 1.6 }
```

The function then processes the next row using this **output record** as the `accumulator`.

{{% note %}}
Because `reduce()` uses the output record as the `accumulator` when processing the next row,
keys mapped in the `fn` function must match keys in the `identity` and `accumulator` records.
{{% /note %}}

###### Processing the next row
```js
// Input records for the second row
r           = { _time: 2019-04-23T16:10:59.00Z, _value: 2.3 }
accumulator = { sum  : 1.6, product : 1.6 }

// Key mappings for the second row
sum: 2.3 + 1.6
product: 2.3 * 1.6

// Output record of the second row
{ sum: 3.9, product: 3.68 }
```

It then uses the new output record as the `accumulator` for the next row.
This cycle continues until all rows in the table are processed.

##### Final output record and table
After all records in the table are processed, `reduce()` uses the final output record
to create a transformed table with one row and columns for each mapped key.

###### Final output record
```js
{ sum: 9.6, product: 11.74656 }
```

###### Output table
| sum | product  |
| --- | -------- |
| 9.6 | 11.74656 |

{{% note %}}
#### What happened to the \_time column?
The `reduce()` function only keeps columns that are:

1. Are part of the input table's [group key](/influxdb/v2.0/query-data/get-started/#group-keys).
2. Explicitly mapped in the `fn` function.

It drops all other columns.
Because `_time` is not part of the group key and is not mapped in the `fn` function,
it isn't included in the output table.
{{% /note %}}

## Custom aggregate function examples
To create custom aggregate functions, use principles outlined in
[Creating custom functions](/influxdb/v2.0/query-data/flux/custom-functions)
and the `reduce()` function to aggregate rows in each input table.

### Create a custom average function
This example illustrates how to create a function that averages values in a table.
_This is meant for demonstration purposes only.
The built-in [`mean()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/mean/)
does the same thing and is much more performant._

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Comments](#)
[No Comments](#)
{{% /code-tabs %}}

{{% code-tab-content %}}

```js
average = (tables=<-, outputField="average") =>
  tables
    |> reduce(
      // Define the initial accumulator record
      identity: {
        count: 1.0,
        sum:   0.0,
        avg:   0.0
      },
      fn: (r, accumulator) => ({
        // Increment the counter on each reduce loop
        count: accumulator.count + 1.0,
        // Add the _value to the existing sum
        sum:   accumulator.sum + r._value,
        // Divide the existing sum by the existing count for a new average
        avg:   accumulator.sum / accumulator.count
      })
    )
    // Drop the sum and the count columns since they are no longer needed
    |> drop(columns: ["sum", "count"])
    // Set the _field column of the output table to to the value
    // provided in the outputField parameter
    |> set(key: "_field", value: outputField)
    // Rename avg column to _value
    |> rename(columns: {avg: "_value"})
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
average = (tables=<-, outputField="average") =>
  tables
    |> reduce(
      identity: {
        count: 1.0,
        sum:   0.0,
        avg:   0.0
      },
      fn: (r, accumulator) => ({
        count: accumulator.count + 1.0,
        sum:   accumulator.sum + r._value,
        avg:   accumulator.sum / accumulator.count
      })
    )
    |> drop(columns: ["sum", "count"])    
    |> set(key: "_field", value: outputField)
    |> rename(columns: {avg: "_value"})
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Aggregate multiple columns
Built-in aggregate functions only operate on one column.
Use `reduce()` to create a custom aggregate function that aggregates multiple columns.

The following function expects input tables to have `c1_value` and `c2_value`
columns and generates an average for each.

```js
multiAvg = (tables=<-) =>
  tables
    |> reduce(
      identity: {
        count:  1.0,
        c1_sum: 0.0,
        c1_avg: 0.0,
        c2_sum: 0.0,
        c2_avg: 0.0
      },
      fn: (r, accumulator) => ({
        count:  accumulator.count + 1.0,
        c1_sum: accumulator.c1_sum + r.c1_value,
        c1_avg: accumulator.c1_sum / accumulator.count,
        c2_sum: accumulator.c2_sum + r.c2_value,
        c2_avg: accumulator.c2_sum / accumulator.count
      })
    )
```

### Aggregate gross and net profit
Use `reduce()` to create a function that aggregates gross and net profit.
This example expects `profit` and `expenses` columns in the input tables.

```js
profitSummary = (tables=<-) =>
  tables
    |> reduce(
      identity: {
        gross: 0.0,
        net:   0.0
      },
      fn: (r, accumulator) => ({
        gross: accumulator.gross + r.profit,
        net:   accumulator.net + r.profit - r.expenses
      })
    )
```
