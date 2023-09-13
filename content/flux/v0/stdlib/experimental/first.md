---
title: experimental.first() function
description: >
  `experimental.first()` returns the first record with a non-null value in the `_value` column
  for each input table.
menu:
  flux_v0_ref:
    name: experimental.first
    parent: experimental
    identifier: experimental/first
weight: 101
flux/v0.x/tags: [transformations, selectors]
introduced: 0.112.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L1119-L1119

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.first()` returns the first record with a non-null value in the `_value` column
for each input table.

`experimental.first()` drops empty tables.

##### Function type signature

```js
(<-tables: stream[{A with _value: B}]) => stream[{A with _value: B}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Return the first non-null value in each input table

```js
import "experimental"
import "sampledata"

sampledata.int(includeNull: true)
    |> experimental.first()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z |         | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z |         | t1   |
| 2021-01-01T00:00:40Z |         | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z |         | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z |         | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:10Z | 4       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
