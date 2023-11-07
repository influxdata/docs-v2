---
title: set() function
description: >
  `set()` assigns a static column value to each row in the input tables.
menu:
  flux_v0_ref:
    name: set
    parent: universe
    identifier: universe/set
weight: 101
flux/v0/tags: [transformations]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2350-L2350

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`set()` assigns a static column value to each row in the input tables.

`set()` may modify an existing column or add a new column.
If the modified column is part of the group key, output tables are regrouped as needed.
`set()` can only set string values.

##### Function type signature

```js
(<-tables: stream[A], key: string, value: string) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### key
({{< req >}})
Label of the column to modify or set.



### value
({{< req >}})
String value to set.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Set a column to a specific string value

```js
import "sampledata"

sampledata.int()
    |> set(key: "host", value: "prod1")

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

| _time                | _value  | *tag | host  |
| -------------------- | ------- | ---- | ----- |
| 2021-01-01T00:00:00Z | -2      | t1   | prod1 |
| 2021-01-01T00:00:10Z | 10      | t1   | prod1 |
| 2021-01-01T00:00:20Z | 7       | t1   | prod1 |
| 2021-01-01T00:00:30Z | 17      | t1   | prod1 |
| 2021-01-01T00:00:40Z | 15      | t1   | prod1 |
| 2021-01-01T00:00:50Z | 4       | t1   | prod1 |

| _time                | _value  | *tag | host  |
| -------------------- | ------- | ---- | ----- |
| 2021-01-01T00:00:00Z | 19      | t2   | prod1 |
| 2021-01-01T00:00:10Z | 4       | t2   | prod1 |
| 2021-01-01T00:00:20Z | -3      | t2   | prod1 |
| 2021-01-01T00:00:30Z | 19      | t2   | prod1 |
| 2021-01-01T00:00:40Z | 13      | t2   | prod1 |
| 2021-01-01T00:00:50Z | 1       | t2   | prod1 |

{{% /expand %}}
{{< /expand-wrapper >}}
