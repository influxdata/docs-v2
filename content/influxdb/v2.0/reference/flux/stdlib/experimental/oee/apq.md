---
title: oee.APQ() function
description: >
  The `oee.APQ()` function computes availability, performance, quality (APQ)
  and overall equipment effectiveness (OEE).
menu:
  influxdb_2_0_ref:
    name: oee.APQ
    parent: OEE
weight: 401
---

The `oee.APQ()` function computes availability, performance, quality (APQ)
and overall equipment effectiveness (OEE).

```js
import "experimental/oee"

oee.APQ(
  runningState: "running",
  plannedTime: 8h,
  idealCycleTime: 2m
)
```

#### Required input schema
Input tables must have the following columns:

- **_stop**: Right time boundary timestamp (typically assigned by `range()` or `window()`).
- **_time**: Timestamp of the production event.
- **state**: State that represents start or stop events.
- **partCount**: Cumulative total of parts produced.
- **badCount**: Cumulative total of parts that do not meet quality standards.

#### Output schema
For each input table, the `oee.APQ` function outputs a table with a single row
and the following columns:

- **_time**: Timestamp associated with the APQ calculation.
- **availability**: Ratio of time production was in a running state.
- **oee**: Overall equipment effectiveness.
- **performance**: Ratio of production efficiency.
- **quality**: Ratio of production quality.
- **runTime**: Nanoseconds production was in a running state.

## Parameters

### runningState
({{< req >}})
State value that represents a running state.

_**Data type:** String_

### plannedTime
({{< req >}})
Total time that equipment is expected to produce parts.

_**Data type:** Duration | Integer_

{{% note %}}
Integer values represent nanoseconds.
{{% /note %}}

### idealCycleTime
({{< req >}})
Ideal minimum time to produce one part.

_**Data type:** Duration | Integer_

{{% note %}}
Integer values represent nanoseconds.
{{% /note %}}

### tables
Input data.
Default is piped-forward data.
_See [Required input schema](#required-input-schema)._

## Examples

#### Input data (productionData)
| _start               | _stop                | _time                | state   | partCount | badCount |
|:------               |:-----                |:-----                |:-----:  | ---------:| --------:|
| 2021-01-01T00:00:00Z | 2021-01-01T08:00:01Z | 2021-01-01T00:00:00Z | running | 0         | 0        |
| 2021-01-01T00:00:00Z | 2021-01-01T08:00:01Z | 2021-01-01T04:03:53Z | stopped | 673       | 5        |
| 2021-01-01T00:00:00Z | 2021-01-01T08:00:01Z | 2021-01-01T04:24:53Z | running | 673       | 5        |
| 2021-01-01T00:00:00Z | 2021-01-01T08:00:01Z | 2021-01-01T08:00:00Z | running | 1298      | 13       |

#### Query

```js
import "experimental/oee"

productionData = // ...

productionData
  |> oee.APQ(
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

