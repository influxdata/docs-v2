---
title: IoT sensor common queries
description: >
  Use Flux to address common IoT use cases that query data collected from sensors.
influxdb/v2.0/tags: [queries]
menu:
  influxdb_2_0:
    name: IoT common queries
    parent: Common queries
weight: 205
---

The following scenarios illustrate common queries used to extract information from IoT sensor data:

- [Calculate time in state](#calculate-time-in-state)
- [Calculate time weighted average](#calculate-time-weighted-average)
- [Calculate value between events](#calculate-value-between-events)
- [Determine a state within existing values](#determine-a-state-within-existing-values)

All scenarios below use the `machineProduction` sample dataset provided by the [InfluxDB `sample` package](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/sample/).
For more information, see [Sample data](/influxdb/cloud/reference/sample-data/).

## Calculate time in state

In this scenario, we look at whether a production line is running smoothly (`state`=`OK`) and what percentage of time the production line is running smoothly or not (`state`=`NOK`). If no points are recorded during the interval (`state`=`NaN`), you may opt to retrieve the last state prior to the interval. 

To visualize the time in state, see the [Mosaic visualization](#mosaic-visualization).

**To calculate the percentage of time a machine spends in each state**

1. Import the [`contrib/tomhollingworth/events` package](/{{< latest "flux" >}}/stdlib/contrib/tomhollingworth/events/).
1. Query the `state` field.
2. Use `events.duration()` to return the amount of time (in a specified unit) between each data point, and store the interval in the `duration` column.
3. Group columns by the status value column (in this case `_value`), `_start`, `_stop`, and other relevant dimensions.
4. Sum the `duration` column to calculate the total amount of time spent in each state.
5. Pivot the summed durations into the `_value` column.
6. Use `map()` to calculate the percentage of time spent in each state.

```js
import "contrib/tomhollingworth/events"
 
from(bucket: "machine")
  |> range(start: 2021-08-01T00:00:00Z, stop: 2021-08-02T00:30:00Z)
  |> filter(fn: (r) => r["_measurement"] == "machinery")
  |> filter(fn: (r) => r["_field"] == "state")
  |> events.duration(unit: 1h, columnName: "duration",)
  |> group(columns: ["_value", "_start", "_stop", "station_id"])
  |> sum(column: "duration")
  |> pivot(rowKey:["_stop"], columnKey: ["_value"], valueColumn: "duration")
  |> map(fn: (r) => {
    totalTime = float(v: r.NOK + r.OK)
    return {r with NOK: float(v: r.NOK) / totalTime * 100.0, OK: float(v: r.OK) / totalTime * 100.0}
  })
```

The query above focuses on a specific time range of state changes reported in the production line.
`range()` defines the time range to query.
`filter()` defines the field (`state`) and measurement (`machinery`) to filter by.
`events.duration()` calculates the time between points.
`group()` regroups the data by the field value, so points with `OK` and `NOK` field values are grouped
into separate tables.
`sum()` returns the sum of durations spent in each state.

The output of the query at this point is:

| _value | duration | 
| ------ | -------: | 
| NOK    | 22       | 

| _value | duration | 
| ------ | -------: | 
| OK     | 172      | 

`pivot()` creates columns for each unique value in the `_value` column, and then assigns the associated duration as the column value.
The output of the pivot operation is:

| NOK | OK  |
| :-- | :-- |
| 22  | 172 |

Given the output above, `map()` does the following:

1. Adds the `NOK` and `OK` values to calculate `totalTime`. 
2. Divides `NOK` by `totalTime`, and then multiplies the quotient by 100. 
3. Divides `OK` by `totalTime`, and then multiplies the quotient by 100.

This returns:

| NOK               | OK                 | 
| :---------------- | :----------------- | 
| 11.34020618556701 | 88.65979381443299  | 

The result shows that 88.66% of time production is in the `OK` state, and that 11.34% of time, production is in the `NOK` state.

#### Mosaic visualization 

The [mosaic visualization](/influxdb/v2.0/visualize-data/visualization-types/mosaic/) displays state changes over time. In this example, the mosaic visualization displays different colored tiles based on the `state` field. 

```js
from(bucket: "machine")
  |> range(start: 2021-08-01T00:00:00Z, stop: 2021-08-02T00:30:00Z)
  |> filter(fn: (r) => r._measurement == "machinery")
  |> filter(fn: (r) => r._field == "state")
  |> aggregateWindow(every: v.windowPeriod, fn: last, createEmpty: false)
```

When visualizing data, it is possible to have more data points than available pixels. To divide data into time windows that span a single pixel, use `aggregateWindow` with the `every` parameter set to `v.windowPeriod`.
Use `last` as the aggregate `fn` to return the last value in each time window.
Set `createEmpty` to `false` so results  won't include empty time windows. 


## Calculate time weighted average

To calculate the time-weighted average of data points, use the [`timeWeightedAvg()` function](/{{< latest "flux" >}}/stdlib/universe/timeweightedavg/).

The example below queries the `oil_temp` field in the `machinery` measurement. The `timeWeightedAvg()` function returns the time-weighted average of oil temperatures based on 5 second intervals.

```js
from(bucket: "machine")
  |> range(start: 2021-08-01T00:00:00Z, stop: 2021-08-01T00:00:30Z)
  |> filter(fn: (r) =>
    r._measurement == "machinery" and r._field == "oil_temp"
  )
  |> timeWeightedAvg(unit: 5s)
```

##### Output data

| stationID | _start                   | _stop                    | _value             |
|:-----     | -----                    | -----                    |             ------:|
| g1        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:30.000Z | 40.25396118491921  |
| g2        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:30.000Z | 40.6               |
| g3        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:30.000Z | 41.384505595567866 |
| g4        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:30.000Z | 41.26735518634935  |


## Calculate value between events

Calculate the value between events by getting the average value during a specific time range. 

The following scenario queries data starting when four production lines start and end.
The following query calculates the average oil temperature for each grinding station during that period.

```js
batchStart = 2021-08-01T00:00:00Z
batchStop = 2021-08-01T00:00:20Z

from(bucket: "machine")
  |> range(start: batchStart, stop: batchStop)
  |> filter(fn: (r) =>
    r._measurement == "machinery" and
    r._field == "oil_temp"
  )
  |> mean()
```

##### Output

| stationID | _start                   | _stop                    | _value             |
|:-----     | -----                    | -----                    |             ------:|
| g1        | 2021-08-01T01:00:00.000Z | 2021-08-02T00:00:00.000Z | 40                 |
| g2        | 2021-08-01T01:00:00.000Z | 2021-08-02T00:00:00.000Z | 40.6               |
| g3        | 2021-08-01T01:00:00.000Z | 2021-08-02T00:00:00.000Z | 41.379999999999995 |
| g4        | 2021-08-01T01:00:00.000Z | 2021-08-02T00:00:00.000Z | 41.2               |


## Determine a state with existing values

Use multiple existing values to determine a state.
The following example calculates a state based on the difference between the `pressure` and `pressure-target` fields in the machine-production sample data.
To determine a state by comparing existing fields:

1. Query the fields to compare (in this case, `pressure` and `pressure_target`).
2. (Optional) Use `aggregateWindow()` to window data into time-based windows and
    apply an aggregate function (like `mean()`) to return values that represent larger windows of time.
3. Use `pivot()` to shift field values into columns.
4. Use `map()` to compare or operate on the different field column values.
5. Use `map()` to assign a status (in this case, `needsMaintenance` based on the relationship of the field column values.
 
```js
import "math"

from(bucket: "machine")
  |> range(start: 2021-08-01T00:00:00Z, stop: 2021-08-02T00:00:00Z)
  |> filter(fn: (r) => r["_measurement"] == "machinery")
  |> filter(fn: (r) => r["_field"] == "pressure" or r["_field"] == "pressure_target")
  |> aggregateWindow(every: 12h, fn: mean)
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> map(fn: (r) => ({ r with pressureDiff: r.pressure - r.pressure_target }))
  |> map(fn: (r) => ({ r with needsMaintenance: if math.abs(x: r.pressureDiff) >= 15.0 then true else false }))
```

##### Output

| _time                    | needsMaintenance |           pressure |    pressure_target |        pressureDiff | stationID |
| :----------------------- | :--------------- | -----------------: | -----------------: | ------------------: | --------: |
| 2021-08-01T12:00:00.000Z | false            | 101.83929080014092 | 104.37786394078252 | -2.5385731406416028 |        g1 |
| 2021-08-02T00:00:00.000Z | false            |  96.04368008245874 | 102.27698650674662 |  -6.233306424287889 |        g1 |

| _time                    | needsMaintenance |           pressure |    pressure_target |        pressureDiff | stationID |
| :----------------------- | :--------------- | -----------------: | -----------------: | ------------------: | --------: |
| 2021-08-01T12:00:00.000Z | false            | 101.62490431541765 | 104.83915260886623 |  -3.214248293448577 |        g2 |
| 2021-08-02T00:00:00.000Z | false            |  94.52039415465273 | 105.90869375273046 | -11.388299598077722 |        g2 |

| _time                    | needsMaintenance |           pressure |    pressure_target |        pressureDiff | stationID |
| :----------------------- | :--------------- | -----------------: | -----------------: | ------------------: | --------: |
| 2021-08-01T12:00:00.000Z | false            |  92.23774168403503 | 104.81867444768653 | -12.580932763651504 |        g3 |
| 2021-08-02T00:00:00.000Z | true             |  89.20867846153847 |  108.2579185520362 | -19.049240090497733 |        g3 |

| _time                    | needsMaintenance |           pressure |    pressure_target |        pressureDiff | stationID |
| :----------------------- | :--------------- | -----------------: | -----------------: | ------------------: | --------: |
| 2021-08-01T12:00:00.000Z | false            |  94.40834093349847 |  107.6827757125155 | -13.274434779017028 |        g4 |
| 2021-08-02T00:00:00.000Z | true             |  88.61785638936534 | 108.25471698113208 | -19.636860591766734 |        g4 |

The table reveals that the `pressureDiff` value `-19.636860591766734` from station g4 and `-19.049240090497733` from station g3 are higher than 15, therefore there is a change in state that marks the `needMaintenance` value as "true" and would require that station to need work to turn that value back to `false`. 