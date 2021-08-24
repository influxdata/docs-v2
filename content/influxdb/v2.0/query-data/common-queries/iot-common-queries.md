---
title: IoT sensor common queries
description: >
  Find common queries used for IoT sensors.
influxdb/v2.0/tags: [queries]
menu:
  influxdb_2_0:
    name: IoT common queries
    parent: Common queries
weight: 205
---

Use the following queries to retrieve information about your IoT sensors:
- [Record time in state](#record-time-in-state)
- [Calculate time weighted average](#calculate-time-weighted-average)
- [Calculate value between events](#calculate-value-between-events)
- [Record data points with added context](#record-data-points-with-added-context)
- [Group aggregate on value change(s)](#group-aggregate-on-value-changes)

## Record time in state

Find the percentage of total time a state is a “true”, "false", or "null" over a given interval. If no points are recorded during the interval, you may opt to retrieve the last state prior to the interval.

The following example queries data from the air sensor sample data and calculates the percentage of time the carbon monoxide levels reaches 150ppm. Air that is equal or higher than 150ppm is "true" while air with lower amounts of carbon monoxide would be "false." 

To visualize the time in state, see the [Mosaic visualization](#mosaic-visualization).

```js
import "contrib/tomhollingworth/events"
import "influxdata/influxdb/sample"

coThreshold = 3.0

sample.data(set: "airSensor")
  |> range(start: 2021-08-23T09:34:58Z, stop: 2021-08-25T10:35:24Z)
  |> filter(fn: (r) => r._field == "state")
  |> map(fn: (r) => ({ r with alert: if r._value >= coThreshold then true else false }))
  |> events.duration(unit: 1s, columnName: "duration",)
  |> group(columns: ["alert", "_start", "_stop", "sensor_id"])
  |> sum(column: "duration")
  |> pivot(rowKey:["_stop"], columnKey: ["alert"], valueColumn: "duration")
  |> map(fn: (r) => ({ r with true: if exists r.true then r.true else 0, false: if exists r.false then r.false else 0}))
  |> map(fn: (r) => { 
    totalTime =  float(v: r.false + r.true)
    return {sensor_id: r.sensor_id, noAlert: float(v: r.false) / totalTime * 100.0 , alert: float(v: r.true) / totalTime * 100.0 }
  })
```

from(bucket: "machine")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "machinery")
  |> filter(fn: (r) => r["_field"] == "state")
  |> events.duration(unit: 1h, columnName: "duration",)
  |> group(columns: ["_value", "_start", "_stop", "station_id"])
  |> sum(column: "duration")
  |> pivot(rowKey:["_stop"], columnKey: ["alert"], valueColumn: "duration")
  |> map(fn: (r) => ({ r with true: if exists r.true then r.true else 0, false: if exists r.false then r.false else 0}))
  |> map(fn: (r) => { 
    totalTime =  float(v: r.false + r.true)
    return {sensor_id: r.sensor_id, noAlert: float(v: r.false) / totalTime * 100.0 , alert: float(v: r.true) / totalTime * 100.0 }
  })

In this example, the `filter` function narrows down the air sensor sample data to only include an instance where the CO levels have crossed the threshold, and the `map` function gives the data a "true" and "false" state. A Boolean value is created by querying `  |> map(fn: (r) => ({ r with true: if exists r.true then r.true else 0, false: if exists r.false then r.false else 0}))`. 
The `group` function creates a notification for when the data crosses the threshold. 
The `sum` function drops all duration not included in the group key. 
The percent of the state over the total interval is the sum of the duration of true and false states, divided by the total time, multiplied by 100. 

| table | alert             | noAlert            | sensor_id |
| ----- | ----------------- | ------------------ | --------- |
| 0     | 97.61332864158622 | 2.3866713584137815 | TLM0200   |

Given the input data in the table above, the example function above does the following:

1. Turns TLM0200 into true and false statements for when the levels are higher or lower than 150ppm. 
2. Sums the true and false states to calculate the total time.
3. Divides the value in step 2 by the total hours of exposure, and then multiplies the quotient by 100.

The results are 95.28% of time is in the true state and 4.72% of time is in the false state.

##### Mosaic visualization 

The following query displays the change of "false" to "true". A mosaic visualization displays state changes over time. In this example, the mosaic visualization displayed different colored tiles based on the changes of carbon monoxide in the air. 

```js
sample.data(set: "airSensor")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r._measurement == "airSensor")
  |> filter(fn: (r) => r._field == "co")
  |> aggregateWindow(every: v.windowPeriod, fn: last, createEmpty: false)
```

For more information about mosaic visualizations, see [here](/influxdb/cloud/visualize-data/visualization-types/mosaic/). 

## Calculate time weighted average

Calculate the time-weighted average by using the linearly interpolated integral of values in a table to calculate the average over time.

#### Example: Calculate air temperature 

For example, you want to calculate temperature over a given interval.  

The total exposure considers both the total hours in the day and temperature for specified periods throughout the day. A time-weighted average is equal to the sum of units of exposure (in the `_value` column) multiplied by the time period (as a decimal), divided by the total time.

##### Flux query to calculate time-weighted average

```js
from(bucket: "air-sensor")
  |> range(start: -8h)
  |> filter(fn: (r) =>
    r._measurement == "airSensors"
    r._field == "temperature"
  )
  |> timeWeightedAvg(unit: 2h)
```

In this example, the `_value` in the table below shows input data from the `temperature` field in the `airSensors` measurement. A person is exposed to `1.0` unit of substance in the first `2hr` interval, with increasing exposure by `.5` unit every subsequent `2hr` period. For the following input data:

| _time                | _value |
|:-----                | ------:|
| 2021-01-01T00:09:00Z | 1.0    |
| 2021-01-01T00:11:00Z | 1.5    |
| 2021-01-01T00:01:00Z | 2.0    |
| 2021-01-01T00:03:00Z | 2.5    |
| 2021-01-01T00:05:00Z | 3.0    |

Given the input data in the table above, the example function above does the following:

1. Multiplies each value by its time-weighting interval: `1.0x2, 1.5x2, 2.0x2, 2.5x2, 3.0x2`
2. Sums the values in step 1 to calculate the total weighted exposure: `2.0 + 3.0 + 4.0 + 5.0 + 6.0 = 20.0`
3. Divides the value in step 2 by the total hours of exposure: `20.0/8 = 2.5` and returns:

   | _value |
   | :----: |
   |  2.5   |

## Calculate value between events

Calculate the value between events by 

The following example queries data starting with when a day starts and ends. The following query would calculate the average temperature value during that period.

If each day is identified with a tag, it means that the start and end is the only range when data will be collected for this series and ultimately the data will age out. If we have many days recorded, we should be able to use tags to correctly calculate this. But, an example detailing this out would be useful.

## Record data points with added context

Equipment speed measurements are recorded periodically (float), as is the production order number (string), but not as a field set – as separate streams. I would like to query the equipment speed measurements either in their raw form or aggregated on windows, but I would like to also have the result set include the production order number that was active at that point in time. Example of using experimental.join and how to ensure the timestamps align along with the tag keys... But, need to figure out what ties the two streams together?

## Group aggregate on value change(s)

Aggregates can be "grouped by" one or more measurements over given interval, and by one or more context values that might change state (production order number, crew, machine state, etc.)