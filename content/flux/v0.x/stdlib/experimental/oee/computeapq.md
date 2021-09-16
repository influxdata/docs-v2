---
title: oee.computeAPQ() function
description: >
  The `oee.computeAPQ()` function computes availability, performance, and quality (APQ)
  and overall equipment effectiveness (OEE) using two separate input streams—production events and parts events.
menu:
  flux_0_x_ref:
    name: oee.computeAPQ
    parent: oee
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/oee/computeapq/
  - /influxdb/cloud/reference/flux/stdlib/experimental/oee/computeapq/
flux/v0.x/tags: [transformations, aggregates]
weight: 401
---

The `oee.computeAPQ()` function computes availability, performance, and quality (APQ)
and overall equipment effectiveness (OEE) using two separate input streams—[production events](#productionevents)
and [part events](#partevents).
_`oee.computeAPQ()` is an [aggregate function](/flux/v0.x/function-types/#aggregates)._

```js
import "experimental/oee"

oee.computeAPQ(
  productionEvents: exampleProductionScheme,
  partEvents: examplePartsStream,
  runningState: "running",
  plannedTime: 8h,
  idealCycleTime: 2m,
)
```

#### Output schema
For each input table, the `oee.computeAPQ` function outputs a table with a single row
and the following columns:

- **_time**: Timestamp associated with the APQ calculation.
- **availability**: Ratio of time production was in a running state.
- **oee**: Overall equipment effectiveness.
- **performance**: Ratio of production efficiency.
- **quality**: Ratio of production quality.
- **runTime**: Total nanoseconds spent in the running state.

## Parameters

### productionEvents {data-type="stream of tables"}
({{< req >}})
Production events stream that contains the production state or start and stop events.
Each row must contain the following columns:

- **_stop**: Right time boundary timestamp (typically assigned by `range()` or `window()`).
- **_time**: Timestamp of the production event.
- **state**: String that represents start or stop events or the production state.
  Use [`runningState`](#runningstate) to specify which value in the `state`
  column represents a running state.

### partEvents {data-type="stream of tables"}
({{< req >}})
Part events that contains the running totals of parts produced and parts that do not meet quality standards.
Each row must contain the following columns:

- **_stop**: Right time boundary timestamp (typically assigned by
  [`range()`](/flux/v0.x/stdlib/universe/range/)
  or [`window()`](/flux/v0.x/stdlib/universe/window/)).
- **_time**: Timestamp of the parts event.
- **partCount:** Cumulative total of parts produced.
- **badCount** Cumulative total of parts that do not meet quality standards.

### runningState {data-type="string"}
({{< req >}})
State value that represents a running state.

### plannedTime {data-type="duration, int"}
({{< req >}})
Total time that equipment is expected to produce parts.

{{% note %}}
Integer values represent nanoseconds.
{{% /note %}}

### idealCycleTime {data-type="duration, int"}
({{< req >}})
Ideal minimum time to produce one part.

{{% note %}}
Integer values represent nanoseconds.
{{% /note %}}

## Examples

The following example uses two streams of data ([productionData](#productiondata)
and [partsData](#partsdata)) and `oee.APQ()` to calculate the APQ and OEE of an
eight hour production window.

#### Input data

##### productionData
| _start               | _stop                | _time                | state   |
|:------               |:-----                |:-----                |:-----:  |
| 2021-01-01T00:00:00Z | 2021-01-01T08:00:01Z | 2021-01-01T00:00:00Z | running |
| 2021-01-01T00:00:00Z | 2021-01-01T08:00:01Z | 2021-01-01T04:03:53Z | stopped |
| 2021-01-01T00:00:00Z | 2021-01-01T08:00:01Z | 2021-01-01T04:24:53Z | running |
| 2021-01-01T00:00:00Z | 2021-01-01T08:00:01Z | 2021-01-01T08:00:00Z | running |

##### partsData
| _start               | _stop                | _time                | partCount | badCount |
|:------               |:-----                |:-----                | ---------:| --------:|
| 2021-01-01T00:00:00Z | 2021-01-01T08:00:01Z | 2021-01-01T00:00:00Z | 0         | 0        |
| 2021-01-01T00:00:00Z | 2021-01-01T08:00:01Z | 2021-01-01T04:03:53Z | 673       | 5        |
| 2021-01-01T00:00:00Z | 2021-01-01T08:00:01Z | 2021-01-01T04:24:53Z | 673       | 5        |
| 2021-01-01T00:00:00Z | 2021-01-01T08:00:01Z | 2021-01-01T08:00:00Z | 1298      | 13       |

#### Query

```js
import "experimental/oee"

productionData = // ...
partsData = // ...

oee.computeAPQ(
  productionEvents: productionData,
  partEvents: partsData,
  runningState: "running",
  plannedTime: 8h,
  idealCycleTime: 21s
)
|> drop(columns: ["_start","_stop"])
```

#### Output data

| _time                | availability  | oee    | performance  | quality  | runTime        |
|:-----                | ------------: | ---:   | -----------: | -------: | -------:       |
| 2021-01-01T08:00:01Z | 0.9563        | 0.9370 | 0.9897       | 0.9899   | 27541000000000 |
