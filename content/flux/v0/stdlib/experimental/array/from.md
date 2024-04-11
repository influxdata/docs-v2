---
title: array.from() function
description: >
  `array.from()` constructs a table from an array of records.
menu:
  flux_v0_ref:
    name: array.from
    parent: experimental/array
    identifier: experimental/array/from
weight: 201

deprecated: 0.103.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/array/array.flux#L57-L57

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`array.from()` constructs a table from an array of records.

{{% warn %}}
#### Deprecated
Experimental `array.from()` is deprecated in favor of
[`array.from()`](/flux/v0/stdlib/array/from).
This function is available for backwards compatibility, but we recommend using the `array` package instead.
{{% /warn %}}

Each record in the array is converted into an output row or record. All
records must have the same keys and data types.

##### Function type signature

```js
(<-rows: [A]) => stream[A] where A: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### rows

Array of records to construct a table with.




## Examples

- [Build an arbitrary table](#build-an-arbitrary-table)
- [Union custom rows with query results](#union-custom-rows-with-query-results)

### Build an arbitrary table

```js
import "experimental/array"

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
import "experimental/array"

tags = v1.tagValues(bucket: "example-bucket", tag: "host")

wildcard_tag = array.from(rows: [{_value: "*"}])

union(tables: [tags, wildcard_tag])

```

