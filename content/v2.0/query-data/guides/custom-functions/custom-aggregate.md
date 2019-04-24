---
title: Create custom aggregate functions
description: Create your own custom aggregate functions in Flux using the `reduce()` function.
v2.0/tags: [functions, custom, flux, aggregates]
menu:
  v2_0:
    name: Custom aggregate functions
    parent: Create custom functions
weight: 301
---

Flux provides a number of built-in [aggregate functions](/v2.0/reference/flux/functions/built-in/transformations/aggregates/)
that aggregate data in specific ways.
However, these built-in functions may not meet your specific needs.
The [`reduce()` function](/v2.0/reference/flux/functions/built-in/transformations/aggregates/reduce/)
function provides a way to create custom aggregate functions in Flux.

## Aggregate function characteristics
Aggregate functions all have the same basic characteristics:

- They operate on individual input tables and aggregate a table's records into a single record.
- The output table has the same group key as the input table.

## How reduce() works
The `reduce()` function operates on one row at a time using the function defined in
the [`fn` parameter](/v2.0/reference/flux/functions/built-in/transformations/aggregates/reduce/#fn).
The function maps keys to specific values using two objects specified by the
following parameters:

| Parameter     | Description                                                              |
|:---------:    |:-----------                                                              |
| `r`           | An object that represents the row or record.                             |
| `accumulator` | An object that contains values used in each row's aggregate calculation. |

The `reduce()` function's [`identity` parameter](/v2.0/reference/flux/functions/built-in/transformations/aggregates/reduce/#identity)
defines the initial `accumulator` object.

##### Example reduce() function
```js
|> reduce(fn: (r, accumulator) => ({
    sum: r._value + accumulator.sum,
    product: r._value * accumulator.product
  })
  identity: {sum: 0.0, product: 1.0}
)
```

After processing a row, `reduce()` produces an output object and uses it as the
`accumulator` object when processing the next row.

{{% note %}}
Because `reduce()` uses the output object as the accumulator when processing the next row,
keys mapped in the `reduce()` function must match the `identity` object's keys.
{{% /note %}}

This cycle repeats until `reduce()` processes all records in the table.
When it processes the last record, it outputs a table containing a single record
with columns for each mapped key.

### Reduce process example
The example `reduce()` function [above](#example-reduce-function), which produces
a sum and product of all values in a table, would work as follows:

##### Sample table
```txt
                  _time   _value
-----------------------  -------
2019-04-23T16:10:49.00Z      1.6
2019-04-23T16:10:59.00Z      2.3
2019-04-23T16:11:09.00Z      0.7
2019-04-23T16:11:19.00Z      1.2
2019-04-23T16:11:29.00Z      3.8
```

#### Processing the first row
`reduce()` uses the row data to define `r` and the `identity` object to define `accumulator`.

```
Input Objects
-------------
r: { _time: 2019-04-23T16:10:49.00Z, _value: 1.6 }
accumulator: { sum: 0.0, product: 1.0 }

Mappings
--------
sum: 1.6 + 0.0
product: 1.6 * 1.0

Output Object
-------------
{ sum: 1.6, product: 1.6 }
```

#### Processing the second row
`reduce()` uses the output object from the first row as the `accumulator` object
when processing the second row:

```
Input Objects
-------------
r: { _time: 2019-04-23T16:10:59.00Z, _value: 2.3 }
accumulator: { sum: 1.6, product: 1.6 }

Mappings
--------
sum: 2.3 + 1.6
product: 2.3 * 1.6

Output Object
-------------
{ sum: 3.9, product: 3.68 }
```

#### Processing all other rows
The cycle continues until all other rows are processed.
Using the [sample table](#sample-table), the final output object would be:

##### Final output object
```txt
{ sum: 9.6, product: 11.74656 }
```

And the output table would look like:

##### Output table
```txt
 sum    product
----  ---------
 9.6   11.74656
```

{{% note %}}
Because `_time` is not part of the group key and is not mapped in the `reduce()` function,
it is dropped from the output table.
{{% /note %}}

## Custom aggregate function examples
The following examples apply the principles outlined in [Creating custom functions](/v2.0/query-data/guides/custom-functions)
to create custom aggregate functions using the `reduce()` function.


### Custom averaging function
This example illustrates how to create a custom aggregate function that averages values in a table.
However, the built-in [`mean()` function](/v2.0/reference/flux/functions/built-in/tranformations/aggregates/mean/)
does the same thing and is much more performant.

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
      // Define the initial accumulator object
      identity: {
        count: 1.0,
        sum:   0.0,
        avg:   0.0
      }
      fn: (r, accumulator) => ({
        // Increment the counter on each reduce loop
        count: accumulator.count + 1.0,
        // Add the _value to the existing sum
        sum:   accumulator.sum + r._value,
        // Divide the existing sum by the existing count for a new average
        avg:   accumulator.sum / accumulator.count
      })
    )
    // Drop the sum and count columns since they are no longer needed
    |> drop(columns: ["sum", "count"])
    // Set the _field column of the output table to whatever
    // is provided in the outputField parameter
    |> set(key: "_field", value: outputField)
    // Rename to avg column to _value
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
      }
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
Built-in aggregate functions only operated on one column.
To aggregate multiple columns at once, use the `reduce()` function to create a custom aggregate function.

The following function expects input tables to have `c1_value` and `c2_value` columns
and generates the average for each.

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
      }
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
This example aggregates gross and net profit.
It expects `profit` and `expenses` columns in the input tables.

```js
profitSummary = (tables=<-) =>
  tables
    |> reduce(
      identity: {
        gross: 0.0,
        net:   0.0
      }
      fn: (r, accumulator) => ({
        gross: accumulator.gross + r.profit,
        net:   accumulator.net + r.profit - r.expenses
      })
    )
```
