---
title: tickscript.groupBy() function
description: >
  `tickscript.groupBy()` groups results by the `_measurement` column and other specified columns.
menu:
  flux_v0_ref:
    name: tickscript.groupBy
    parent: contrib/bonitoo-io/tickscript
    identifier: contrib/bonitoo-io/tickscript/groupBy
weight: 301
flux/v0.x/tags: [transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/tickscript/tickscript.flux#L431-L435

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`tickscript.groupBy()` groups results by the `_measurement` column and other specified columns.

This function is comparable to [Kapacitor QueryNode .groupBy](/kapacitor/latest/nodes/query_node/#groupby).

**Note**: To group by time intervals, use `window()` or `tickscript.selectWindow()`.

##### Function type signature

```js
(<-tables: stream[A], columns: [string]) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### columns
({{< req >}})
List of columns to group by.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Group by host and region

```js
import "contrib/bonitoo-io/tickscript"

data
    |> tickscript.groupBy(columns: ["host", "region"])

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _measurement  | host  | region  | _field  | _value  |
| -------------------- | ------------- | ----- | ------- | ------- | ------- |
| 2021-01-01T00:00:00Z | m             | h1    | east    | foo     | 1.2     |
| 2021-01-01T00:01:00Z | m             | h1    | east    | foo     | 3.4     |
| 2021-01-01T00:00:00Z | m             | h2    | east    | foo     | 2.3     |
| 2021-01-01T00:01:00Z | m             | h2    | east    | foo     | 5.6     |
| 2021-01-01T00:00:00Z | m             | h3    | west    | foo     | 1.2     |
| 2021-01-01T00:01:00Z | m             | h3    | west    | foo     | 3.4     |
| 2021-01-01T00:00:00Z | m             | h4    | west    | foo     | 2.3     |
| 2021-01-01T00:01:00Z | m             | h4    | west    | foo     | 5.6     |


#### Output data

| _time                | *_measurement | *host | *region | _field  | _value  |
| -------------------- | ------------- | ----- | ------- | ------- | ------- |
| 2021-01-01T00:00:00Z | m             | h1    | east    | foo     | 1.2     |
| 2021-01-01T00:01:00Z | m             | h1    | east    | foo     | 3.4     |

| _time                | *_measurement | *host | *region | _field  | _value  |
| -------------------- | ------------- | ----- | ------- | ------- | ------- |
| 2021-01-01T00:00:00Z | m             | h2    | east    | foo     | 2.3     |
| 2021-01-01T00:01:00Z | m             | h2    | east    | foo     | 5.6     |

| _time                | *_measurement | *host | *region | _field  | _value  |
| -------------------- | ------------- | ----- | ------- | ------- | ------- |
| 2021-01-01T00:00:00Z | m             | h3    | west    | foo     | 1.2     |
| 2021-01-01T00:01:00Z | m             | h3    | west    | foo     | 3.4     |

| _time                | *_measurement | *host | *region | _field  | _value  |
| -------------------- | ------------- | ----- | ------- | ------- | ------- |
| 2021-01-01T00:00:00Z | m             | h4    | west    | foo     | 2.3     |
| 2021-01-01T00:01:00Z | m             | h4    | west    | foo     | 5.6     |

{{% /expand %}}
{{< /expand-wrapper >}}
