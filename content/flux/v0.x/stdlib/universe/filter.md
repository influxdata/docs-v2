---
title: filter() function
description: >
  `filter()` filters data based on conditions defined in a predicate function (`fn`).
menu:
  flux_0_x_ref:
    name: filter
    parent: universe
    identifier: universe/filter
weight: 101
flux/v0.x/tags: [transformations, filters]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L673-L675

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`filter()` filters data based on conditions defined in a predicate function (`fn`).

Output tables have the same schema as the corresponding input tables.

##### Function type signature

```js
(<-tables: stream[A], fn: (r: A) => bool, ?onEmpty: string) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### fn
({{< req >}})
Single argument predicate function that evaluates `true` or `false`.

Records representing each row are passed to the function as `r`.
Records that evaluate to `true` are included in output tables.
Records that evaluate to _null_ or `false` are excluded from output tables.

### onEmpty

Action to take with empty tables. Default is `drop`.

**Supported values**:
- **keep**: Keep empty tables.
- **drop**: Drop empty tables.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Filter based on InfluxDB measurement, field, and tag](#filter-based-on-influxdb-measurement-field-and-tag)
- [Keep empty tables when filtering](#keep-empty-tables-when-filtering)
- [Filter values based on thresholds](#filter-values-based-on-thresholds)

### Filter based on InfluxDB measurement, field, and tag

```js
from(bucket: "example-bucket")
    |> range(start: -1h)
    |> filter(
        fn: (r) => r._measurement == "cpu" and r._field == "usage_system" and r.cpu == "cpu-total",
    )

```


### Keep empty tables when filtering

```js
import "sampledata"
import "experimental/table"

sampledata.int()
    |> filter(fn: (r) => r._value > 18, onEmpty: "keep")

```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

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

| _time  | _value  | *tag |
| ------ | ------- | ---- |


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Filter values based on thresholds

```js
import "sampledata"

sampledata.int()
    |> filter(fn: (r) => r._value > 0 and r._value < 10)

```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

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

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
