---
title: experimental.mode() function
description: >
  `experimental.mode()` computes the mode or value that occurs most often in the `_value` column
  in each input table.
menu:
  flux_v0_ref:
    name: experimental.mode
    parent: experimental
    identifier: experimental/mode
weight: 101
flux/v0/tags: [transformations, aggregates]
introduced: 0.107.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L812-L812

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.mode()` computes the mode or value that occurs most often in the `_value` column
in each input table.

`experimental.mode` only considers non-null values.
If there are multiple modes, it returns all modes in a sorted table.
If there is no mode, it returns _null_.

#### Supported types
- string
- float
- int
- uint
- bool
- time

##### Function type signature

```js
(<-tables: stream[{A with _value: B}]) => stream[{A with _value: B}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Compute the mode of input tables

```js
import "experimental"
import "sampledata"

sampledata.int()
    |> experimental.mode()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| *tag | _value  |
| ---- | ------- |
| t1   |         |

| *tag | _value  |
| ---- | ------- |
| t2   | 19      |

{{% /expand %}}
{{< /expand-wrapper >}}
