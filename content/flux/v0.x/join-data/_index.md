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

Use the Flux [`join` package](/flux/v0.x/stdlib/join/) to join two data sets based on common values.
Learn how join two data sets using the following join methods:

{{< flex >}}
{{< flex-content "quarter" >}}
<a href="#perform-an-inner-join">
  <p style="text-align:center"><strong>Inner join</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="inner small center" >}}
</a>
{{< /flex-content >}}
{{< flex-content "quarter" >}}
<a href="#perform-a-left-outer-join">
  <p style="text-align:center"><strong>Left outer join</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="left small center" >}}
</a>
{{< /flex-content >}}
{{< flex-content "quarter" >}}
<a href="#perform-a-right-outer-join">
  <p style="text-align:center"><strong>Right outer join</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="right small center" >}}
</a>
{{< /flex-content >}}
{{< flex-content "quarter" >}}
<a href="#perform-a-full-outer-join">
  <p style="text-align:center"><strong>Full outer join</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="full small center" >}}
</a>
{{< /flex-content >}}
{{< /flex >}}

- [How join functions work](#how-join-functions-work)
  - [Input streams](#input-streams)
  - [Join predicate function (on)](#join-predicate-function-on)
  - [Join output function (as)](#join-output-function-as)
- [Perform join operations](#perform-join-operations)
  {{< children type="anchored-list" filterOut="Troubleshoot join operations" >}}
- [Troubleshoot join operations](#troubleshoot-join-operations)

## How join functions work

All functions in the `join` package join _two_ streams of tables together based 
on common values in each input stream.

- [Input streams](#input-streams)
- [Join predicate function (on)](#join-predicate-function-on)
- [Join output function (as)](#join-output-function-as)

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
  _Both input streams should have the same group key._
  If they don't, your join operation may not find any matching tables and will
  return unexpected output.
  Use [`group()`](/flux/v0.x/stdlib/universe/group/) to regroup each input
  stream before joining them together.

  {{% note %}}
Only tables with the same [group key instance](/flux/v0.x/get-started/data-model/#example-group-key-instances)
are joined.
  {{% /note %}}

### Join predicate function (on)

Each function in the `join` package requires the `on` parameter which is the
**join predicate**—a [predicate function](/flux/v0.x/get-started/syntax-basics/#predicate-functions)
that compares values from each input stream (represented by `l` (left) and `r` (right))
and returns `true` or `false`.
Rows that return `true` when compared are joined.
Rows that return `false` when compared are not.

```js
(l, r) => l.column == r.column
```

{{% note %}}
Only tables that share the same group key instance are evaluated by the join predicate.
Because of this, **both input streams should have the same [group key](/flux/v0.x/get-started/data-model/#group-key)**.
{{% /note %}}

### Join output function (as)

All functions in the `join` package _(except [`join.time()`](/flux/v0.x/stdlib/join/time/))_
require the `as` parameter, which defines the output schema of the join.
The `as` parameter returns a new record using values from
joined rows–left (`l`) and right (`r`).

```js
(l, r) => ({l with name: r.name, location: r.location})
```

{{% note %}}
#### Do not modify group key columns

Do not modify group key columns. The `as` function must return the same group key as both input streams. 
Otherwise, you'll receive an error.
{{% /note %}}

## Perform join operations

The `join` package supports the following join types and special use cases:

{{< children type="anchored-list" filterOut="Troubleshoot join operations" >}}

{{< children readmore=true filterOut="Troubleshoot join operations" >}}

## Troubleshoot join operations

For information unexpected behaviors and errors when using the `join` package,
see [Troubleshoot join operations](/flux/v0.x/join-data/troubleshoot-joins/).
