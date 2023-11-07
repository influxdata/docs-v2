---
title: array.from() function
description: >
  `array.from()` constructs a table from an array of records.
menu:
  flux_v0_ref:
    name: array.from
    parent: array
    identifier: array/from
weight: 101
flux/v0/tags: [inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/array/array.flux#L48-L48

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`array.from()` constructs a table from an array of records.

Each record in the array is converted into an output row or record. All
records must have the same keys and data types.

##### Function type signature

```js
(<-rows: [A]) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### rows

Array of records to construct a table with. Default is the piped-forward array (`<-`).




## Examples

- [Build an arbitrary table](#build-an-arbitrary-table)
- [Union custom rows with query results](#union-custom-rows-with-query-results)

### Build an arbitrary table

```js
import "array"

rows = [{foo: "bar", baz: 21.2}, {foo: "bar", baz: 23.8}]

array.from(rows: rows)

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| foo  | baz  |
| ---- | ---- |
| bar  | 21.2 |
| bar  | 23.8 |

{{% /expand %}}
{{< /expand-wrapper >}}

### Union custom rows with query results

```js
import "influxdata/influxdb/v1"
import "array"

tags = v1.tagValues(bucket: "example-bucket", tag: "host")

wildcard_tag = array.from(rows: [{_value: "*"}])

union(tables: [tags, wildcard_tag])

```

