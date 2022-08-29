---
title: Join data
seotitle: Join data with Flux
description: >
  Flux supports inner, full outer, left outer, and right outer joins.
  Learn how to use the `join` package to join two data sets with common values.
menu:
  flux_0_x:
    name: Join data
weight: 8
---

- Introduction to the [`join` package](/flux/v0.x/stdlib/join/)


## How join functions work

All functions in the `join` package join _two_ streams of tables together based 
on common values in each input stream.

- [Input streams](#input-streams)
- [Join predicate](#join-predicate)
- [Join output schema](#join-output-schema)

### Input streams
Each input stream is assigned to the `left` or `right` parameter.
Input streams can be defined from any valid data source.
For more information, see:

- [Query data sources](/flux/v0.x/query-data/)
- Define ad hoc tables with [`array.from()`](/flux/v0.x/stdlib/array/from/)

#### Data requirements
To join two streams of data with the `join` package, each stream must have:

- **One or more columns with common values to join on**.  
  Columns do not need identical labels, but they do need to have comparable values.
- **Identical [group keys](/flux/v0.x/get-started/data-model/#group-key)**.  
  Functions in the `join` package use group keys to quickly determine what tables
  from each input stream should be paired and evaluated for the join operation.
  Both input streams must have the same group key.
  This likely requires using [`group()`](/flux/v0.x/stdlib/universe/group/)
  to regroup each input stream before joining them together.

### Join predicate
Each function in the `join` package requires the `on` parameter which is the
**join predicate**—a [predicate function](/flux/v0.x/get-started/syntax-basics/#predicate-functions)
that compares values from each input stream (represented by `l` and `r`) and 
returns `true` or `false`.
Rows that return `true` when compared are joined.
Rows that return `false` when compared are not.

```js
(l, r) => l.column == r.column
```

{{% note %}}
Only tables that share the same group key instance are evaluated by the join predicate.
Because of this, **both input streams must have the same [group key](/flux/v0.x/get-started/data-model/#group-key)**.
{{% /note %}}

### Join output schema
All functions in the `join` package _(except [`join.time()`](/flux/v0.x/stdlib/join/time/))_
require the `as` parameter which defines the output schema of the join.
The `as` parameter is a function that returns a a new record using values from
joined rows–left (`l`) and right (`r`).

```js
(l, r) => ({l with name: r.name, location: r.location})
```

## Join types
The `join` package supports the following join types and special use cases:

{{< children >}}

- Note on joining vs union + pivot
  - If the schemas of the two datasets are mostly different, use join.
  - If the schemas of the two datasets are identical, use `union() |> pivot()`.
