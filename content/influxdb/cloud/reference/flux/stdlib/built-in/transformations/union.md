---
title: union() function
description: The `union()` function concatenates two or more input streams into a single output stream.
aliases:
  - /influxdb/cloud/reference/flux/functions/transformations/union
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/union/
menu:
  influxdb_cloud_ref:
    name: union
    parent: built-in-transformations
weight: 402
related:
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/join/
---

The `union()` function concatenates two or more input streams into a single output stream.
In tables that have identical schemas and group keys, contents of the tables will be concatenated in the output stream.
The output schemas of the `union()` function is the union of all input schemas.

`union()` does not preserve the sort order of the rows within tables.
A sort operation may be added if a specific sort order is needed.

_**Function type:** Transformation_  
_**Output data type:** Record_

```js
union(tables: [table1, table2])
```

## Parameters

### tables
Specifies the streams to union together.
There must be at least two streams.

_**Data type:** Array of streams_

## Examples
```js
bucket1 = from(bucket: "example-bucket-1")
  |> range(start: -5m)
  |> filter(fn: (r) => r._field == "usage_guest" or r._field == "usage_guest_nice")

bucket2 = from(bucket: "example-bucket-2")
  |> range(start: -5m)
  |> filter(fn: (r) => r._field == "usage_guest" or r._field == "usage_idle")

union(tables: [bucket1, bucket2])
```

## union() versus join()
`union()` merges separate streams of tables into a single stream of tables and
groups rows of data based on existing [group keys](/influxdb/cloud/reference/glossary/#group-key).
`union()` does not modify individual rows of data.
`join()` creates new rows based on common values in one or more specified columns.
Output rows also contain the differing values from each of the joined streams.

Given two streams of tables, `t1` and `t2`, the results of `join()` and `union()`
are illustrated below:

{{< svg "/static/svgs/join-vs-union.svg" >}}
