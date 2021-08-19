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

{{% note %}}
These examples use [air sensor sample data](/influxdb/v2.0/reference/sample-data/#air-sensor-sample-data).
{{% /note %}}

Use the following queries to retrieve information about your IoT sensors:
- [Record time in state](#record-time-in-state)
- [Calculate time weighted average](#calculate-time-weighted-average)
- [Calculate value between events](#calculate-value-between-events)
- [Record data points with added context](#record-data-points-with-added-context)
- [Group aggregate on value change(s)](#group-aggregate-on-value-changes)

## Record time in state

Find the percentage of total time a state is “true” or "false" or "null" over a given interval. If no points are recorded during the interval, you may opt to retrieve the last state prior to the interval.

To visualize the time in state, see the [Mosaic visualization](#mosaic-visualization).

The following example queries data from the air sensor sample data and calculates the percentage of times any amount of carbon monoxide was in the air. Air with any amount of carbon monoxide would be "true" while air with no amount of carbon monoxide would be "false." 

To find percentage of total time, the state is "true" or "false", make sure the data includes the following: 
- `monitor` measurement 
- **`unit-exposure_used` field**: used exposure memory in bytes
- **`unit-expsoure_total` field**: total exposure memory in bytes

```js
from(bucket: "air-sensor")
  |> range(start: 2020-01-01T00:00:00Z)
  |> filter(fn: (r) => r._measurement == "airSensors" and r._field =~ /mem_/ )
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> map(fn: (r) => ({
    _time: r._time,
    _measurement: r._measurement,
    _field: "mem_used_percent",
    _value: float(v: r.mem_used) / float(v: r.mem_total) * 100.0
  }))
  lastReported =
  from(bucket: "example-bucket")
    |> range(start: -1m)
    |> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_idle")
    |> last()
    |> findRecord(fn: (key) => true, idx: 0) 
```

##### Mosaic visualization 

The following query displays the change in air quality over time. A mosaic visualization displays state changes over time. In this example, the mosaic visualization displayed different colored tiles based on the changes of hazardous materials in the air. 

```js
from(bucket: "monitor-exposure")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r._measurement == "sensor_1")
  |> filter(fn: (r) => r._field == "unit-exposure")
  |> aggregateWindow(every: v.windowPeriod, fn: last, createEmpty: false)
```

For more information about mosaic visualizations, see [here](/influxdb/cloud/visualize-data/visualization-types/mosaic/). 

## Calculate time weighted average

Calculate the time-weighted average by using the linearly interpolated integral of values in a table to calculate the average over time.

#### Example: Calculate hazardous exposure

For example, you may want to calculate temperature. 

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

Events are recorded for when a day starts and ends. I would like to calculate the average temperature value during that period.
If each day is identified with a tag, it means that the start and end is the only range when data will be collected for this series and ultimately the data will age out. If we have many days recorded, we should be able to use tags to correctly calculate this. But, an example detailing this out would be useful.

## Record data points with added context

Equipment speed measurements are recorded periodically (float), as is the production order number (string), but not as a field set – as separate streams. I would like to query the equipment speed measurements either in their raw form or aggregated on windows, but I would like to also have the result set include the production order number that was active at that point in time. Example of using experimental.join and how to ensure the timestamps align along with the tag keys... But, need to figure out what ties the two streams together?

## Group aggregate on value change(s)

Aggregates can be "grouped by" one or more measurements over given interval, and by one or more context values that might change state (production order number, crew, machine state, etc.)