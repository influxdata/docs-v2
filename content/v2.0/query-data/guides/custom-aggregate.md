---
title: Create custom aggregate functions
description: Create your own custom aggregate functions in Flux using the `reduce()` function. transform and manipulate data.
v2.0/tags: [functions, custom, flux]
menu:
  v2_0:
    name: Create custom aggregates
    parent: How-to guides
weight: 208
---

## Characteristics of an aggregate
Before creating a custom aggregate function, you must understand the characteristics of an aggregate function.

- Takes all records/rows in a table and combines them into a single row.
- Aggregates operator on input tables individually.

## How reduce() works
- You start with an identity. It's an object. The identity defines the initial values for the `accumulator` parameter in the reduce `fn`.
- The identity/accumulator object is passed through the reduce function and transformed. It outputs a new accumulator object with updated values for the same parameters.
- The new object is passed back into the reduce function.
- This cycle repeats until all records in the table have been read and modified.
- It produces a table with a single record.

## Examples

### Average
```js
average(tables=<-, outputField="average") =>
  tables
    |> reduce(
      identity: {sum: 0.0, count: 1.0, avg: 0.0}
      fn: (r, accumulator) => ({
        sum: accumulator.sum + r._value,
        count: accumulator.count + 1.0,
        avg: accumulator.sum / accumulator.count
      })
    )    
    |> set(key: "_field", value: outputField)
    |> duplicate(column: "avg", as: "_value")
```

**Note:** `accumulator.x` represents the x attribute of the accumulator object before it is passed back into the `fn`.
