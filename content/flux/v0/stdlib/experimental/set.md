---
title: experimental.set() function
description: >
  `experimental.set()` sets multiple static column values on all records.
menu:
  flux_v0_ref:
    name: experimental.set
    parent: experimental
    identifier: experimental/set
weight: 101
flux/v0.x/tags: [transformations]
introduced: 0.40.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L248-L248

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.set()` sets multiple static column values on all records.

If a column already exists, the function updates the existing value.
If a column does not exist, the function adds it with the specified value.

##### Function type signature

```js
(<-tables: stream[B], o: A) => stream[C] where A: Record, B: Record, C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### o
({{< req >}})
Record that defines the columns and values to set.

The key of each key-value pair defines the column name.
The value of each key-value pair defines the column value.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Set values for multiple columns

```js
import "experimental"

data
    |> experimental.set(o: {_field: "temperature", unit: "°F", location: "San Francisco"})

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _field  | _value  |
| -------------------- | ------- | ------- |
| 2019-09-16T12:00:00Z | temp    | 71.2    |
| 2019-09-17T12:00:00Z | temp    | 68.4    |
| 2019-09-18T12:00:00Z | temp    | 70.8    |


#### Output data

| _time                | _field      | _value  | unit  | location      |
| -------------------- | ----------- | ------- | ----- | ------------- |
| 2019-09-16T12:00:00Z | temperature | 71.2    | °F    | San Francisco |
| 2019-09-17T12:00:00Z | temperature | 68.4    | °F    | San Francisco |
| 2019-09-18T12:00:00Z | temperature | 70.8    | °F    | San Francisco |

{{% /expand %}}
{{< /expand-wrapper >}}
