---
title: tickscript.join() function
description: >
  `tickscript.join()` merges two input streams into a single output stream
  based on specified columns with equal values and appends a new measurement name.
menu:
  flux_v0_ref:
    name: tickscript.join
    parent: contrib/bonitoo-io/tickscript
    identifier: contrib/bonitoo-io/tickscript/join
weight: 301
flux/v0/tags: [transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/tickscript/tickscript.flux#L488-L492

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`tickscript.join()` merges two input streams into a single output stream
based on specified columns with equal values and appends a new measurement name.

This function is comparable to [Kapacitor JoinNode](/kapacitor/latest/nodes/join_node/).

##### Function type signature

```js
(measurement: A, tables: B, ?on: [string]) => stream[{C with _measurement: A}] where B: Record, C: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### tables
({{< req >}})
Map of two streams to join.



### on

List of columns to join on. Default is `["_time"]`.



### measurement
({{< req >}})
Measurement name to use in results.




## Examples

### Join two streams of data

```js
import "array"
import "contrib/bonitoo-io/tickscript"

metrics =
    array.from(
        rows: [
            {_time: 2021-01-01T00:00:00Z, host: "host1", _value: 1.2},
            {_time: 2021-01-01T01:00:00Z, host: "host1", _value: 0.8},
            {_time: 2021-01-01T02:00:00Z, host: "host1", _value: 3.2},
            {_time: 2021-01-01T00:00:00Z, host: "host2", _value: 8.4},
            {_time: 2021-01-01T01:00:00Z, host: "host2", _value: 7.3},
            {_time: 2021-01-01T02:00:00Z, host: "host2", _value: 7.9},
        ],
    )
        |> group(columns: ["host"])

states =
    array.from(
        rows: [
            {_time: 2021-01-01T00:00:00Z, host: "host1", _value: "dead"},
            {_time: 2021-01-01T01:00:00Z, host: "host1", _value: "dead"},
            {_time: 2021-01-01T02:00:00Z, host: "host1", _value: "alive"},
            {_time: 2021-01-01T00:00:00Z, host: "host2", _value: "alive"},
            {_time: 2021-01-01T01:00:00Z, host: "host2", _value: "alive"},
            {_time: 2021-01-01T02:00:00Z, host: "host2", _value: "alive"},
        ],
    )
        |> group(columns: ["host"])

tickscript.join(
    tables: {metric: metrics, state: states},
    on: ["_time", "host"],
    measurement: "example-m",
)

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| *_measurement | _time                | _value_metric  | _value_state  | *host |
| ------------- | -------------------- | -------------- | ------------- | ----- |
| example-m     | 2021-01-01T00:00:00Z | 1.2            | dead          | host1 |
| example-m     | 2021-01-01T01:00:00Z | 0.8            | dead          | host1 |
| example-m     | 2021-01-01T02:00:00Z | 3.2            | alive         | host1 |

| *_measurement | _time                | _value_metric  | _value_state  | *host |
| ------------- | -------------------- | -------------- | ------------- | ----- |
| example-m     | 2021-01-01T00:00:00Z | 8.4            | alive         | host2 |
| example-m     | 2021-01-01T01:00:00Z | 7.3            | alive         | host2 |
| example-m     | 2021-01-01T02:00:00Z | 7.9            | alive         | host2 |

{{% /expand %}}
{{< /expand-wrapper >}}
