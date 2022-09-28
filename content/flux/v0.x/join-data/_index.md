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
related:
  - /flux/v0.x/stdlib/join/
  - /flux/v0.x/stdlib/join/inner/
  - /flux/v0.x/stdlib/join/left/
  - /flux/v0.x/stdlib/join/right/
  - /flux/v0.x/stdlib/join/full/
  - /flux/v0.x/stdlib/join/time/
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

{{% note %}}
#### When to use the join package

We recommend using the `join` package to join streams that have mostly different
schemas or that come from two separate data sources.
If you're joining data from the same data source with the same schema, using
[`union()`](/flux/v0.x/stdlib/universe/union/) and [`pivot()`](/flux/v0.x/stdlib/universe/pivot/)
to combine the data will likely be more performant.

For more information, see
[When to use union and pivot instead of join functions](/{{< latest "influxdb" >}}/query-data/flux/join/#when-to-use-union-and-pivot-instead-of-join-functions).
{{% /note %}}

- [How join functions work](#how-join-functions-work)
  - [Input streams](#input-streams)
  - [Join predicate function (on)](#join-predicate-function-on)
  - [Join output function (as)](#join-output-function-as)
- [Perform join operations](#perform-join-operations)
  {{< children type="anchored-list" filterOut="Troubleshoot join operations" >}}
- [Troubleshoot join operations](#troubleshoot-join-operations)

## How join functions work

`join` functions join _two_ streams of tables together based 
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

To join data, each input stream must have the following:

- **One or more columns with common values to join on**.  
  Columns do not need identical labels, but they do need to have comparable values.
- **Identical [group keys](/flux/v0.x/get-started/data-model/#group-key)**.  
  Functions in the `join` package use group keys to quickly determine what tables
  from each input stream should be paired and evaluated for the join operation.  
  _Both input streams should have the same group key._
  If they don't, your join operation may not find any matching tables and will
  return unexpected output.
  If the group keys of your input streams are not identical, use
  [`group()`](/flux/v0.x/stdlib/universe/group/) to regroup each input
  stream before joining them together.

  {{% note %}}
Only tables with the same [group key instance](/flux/v0.x/get-started/data-model/#example-group-key-instances)
are joined.
  {{% /note %}}

### Join predicate function (on)

`join` package functions require the `on` parameter to compare values from each input stream (represented by `l` (left) and `r` (right))
and returns `true` or `false`.
Rows that return `true` are joined.
This parameter is a [predicate function](/flux/v0.x/get-started/syntax-basics/#predicate-functions).


```js
(l, r) => l.column == r.column
```

### Join output function (as)

`join` package functions _(except [`join.time()`](/flux/v0.x/stdlib/join/time/))_
require the `as` parameter to define the output schema of the join.
The `as` parameter returns a new record using values from
joined rows–left (`l`) and right (`r`).

```js
(l, r) => ({l with name: r.name, location: r.location})
```

{{% note %}}
#### Do not modify group key columns

Do not modify group key columns. The `as` function must return the same group key as both input streams to successfully perform a join. 
{{% /note %}}

## Perform join operations

The `join` package supports the following join types and special use cases:

{{< children type="anchored-list" filterOut="Troubleshoot join operations" >}}

{{< children readmore=true filterOut="Troubleshoot join operations" >}}

## Troubleshoot join operations

For information about unexpected behaviors and errors when using the `join` package,
see [Troubleshoot join operations](/flux/v0.x/join-data/troubleshoot-joins/).
