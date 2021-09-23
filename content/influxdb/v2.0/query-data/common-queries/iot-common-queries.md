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
- [Record data points with added context](#record-data-points-with-added-context)
- [Group aggregate on value change(s)](#group-aggregate-on-value-changes)

All scenarios below use the `machineProduction` sample dataset provided by the [InfluxDB `sample` package](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/sample/).
For more information, see [Sample data](/influxdb/cloud/reference/sample-data/).

## Calculate time in state

In this scenario, we look at whether a production line is running smoothly (`state`=`OK`) and what percentage of time the production line is running smoothly or not (`state`=`NOK`). If no points are recorded during the interval (`state`=`NaN`), you may opt to retrieve the last state prior to the interval. 


To visualize the time in state, see the [Mosaic visualization](#mosaic-visualization).

To calculate the percentage of time machines in a production line spend in each state:

1. Import the [`contrib/tomhollingworth/events` package](/{{< latest "flux" >}}/stdlib/contrib/tomhollingworth/events/).
1. Query the `state` field.
2. Use `events.duration()` to return the amount of time (in a specified unit) between each data point and store it in the `duration` column.
3. Group columns by the status value column (in this case `_value`), `_start`, `_stop`, and other relevant dimensions.
4. Sum the `duration` column to calculated the total amount of time spent in each state.
5. Pivot the summed durations into the `_value` column
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

The query above focuses on a specific time range to narrow down on one occasion where the state of the production line changes. The `range` function selects the time range, and within that time range, the `filter` function focuses only on the `state` field and `machinery` measurement out of the other variables. The `state` is stored as a field, and then the `fieldKey` is stored as a value. 

In the table below, the next three functions display the column values and the duration of the values.

| table | _value | duration | 
| ----- | ------ | -------- | 
| 0     | NOK    | 22       | 
| 1     | OK     | 172      | 

 The `events.duration()` function calculates the time between the start and end of the record and associates the duration with the start of the recording. Within it, the `duration` column creates a value for each unique column and `sum` calculates the variables in that column, which gives it the value. The `group` function defines the column values that will appear in our table. 

 To move the values into one column, the `pivot` function aligns the columns together. `rowKey` is the anchor for each point that hinges into a single row. `columnKey`, once the other tables are going to be pinned on the table, will take `_value` to create a new column, and `valueColumn` populates that new columns.

To recieve the percentage of time the state is OK or not OK, you use the `map` function. 


| table | NOK               | OK                 | 
| ----- | ----------------- | ------------------ | 
| 0     | 11.34020618556701 | 88.65979381443299  | 

Given the output data in the table above, the `map` function above does the following:

1. Adds the `NOK` and `OK` values to calculate `totalTime`. 
2. Divides `NOK` by `totalTime`, and then multiplies the quotient by 100. 
3. Divides `OK` by `totalTime`, and then multiplies the quotient by 100. 

The results 88.66% of time is in the true state and 11.34% of time is in the false state.

#### Mosaic visualization 

The [mosaic visualization](/influxdb/v2.0/visualize-data/visualization-types/mosaic/) displays state changes over time. In this example, the mosaic visualization displayed different colored tiles based on the `state` field. 

```js
from(bucket: "machine")
  |> range(start: 2021-08-01T00:00:00Z, stop: 2021-08-02T00:30:00Z)
  |> filter(fn: (r) => r._measurement == "machinery")
  |> filter(fn: (r) => r._field == "state")
  |> aggregateWindow(every: v.windowPeriod, fn: last, createEmpty: false)
```
When visualizing data, it is possible to have more data points than available pixels.
Use `aggregateWindow` with the `every` parameter set to `v.windowPeriod` to divide data
into time windows that span a single pixel.
Use `last` as the aggregate `fn` to return the last value in each time window.
Set `createEmpty` to `false` so results  won't include empty time windows. 


## Calculate time weighted average

Calculate the time-weighted average by using the linearly interpolated integral of values in a table.

### Example: Calculate oil temperature 

For example, to calculate oil temperature over a given interval using the machine-production sample data.  


The total temperature considers both the total hours in the day and the temperature of the different batches. A time-weighted average requires time to be shown in decimal form. 

Minutes will be divided by 60 and seconds will be divided by 3600 to get a decimal form of the hour. Depending on what your time is, the hour and the quotient of the minutes and the seconds will be added to recieve your time in decimals.  

To recieve the average oil temperature, the temperature (in the `_value` column) is multiplied by the time period (as a decimal), divided by the total time. In this example, the average oil temperature for the time range is calculated across four different stations in a production line. 

#### Flux query to calculate time-weighted average

```js
from(bucket: "machine")
  |> range(start: 2021-08-01T00:00:00Z, stop: 2021-08-01T00:00:30Z)
  |> filter(fn: (r) =>
    r._measurement == "machinery" and r._field == "oil_temp"
  )
|> timeWeightedAvg(unit: 5s)
```

In this example, the `_value` in the table below shows output data from the `temperature` field in the `machinery` measurement. The function `timeWeightedAvg` takes the average of the temperature every 5 seconds. For the following output data:

| stationID | _start                   | _stop                    | _value             |
|:-----     | -----                    | -----                    |             ------:|
| g1        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:30.000Z | 40.25396118491921  |
| g2        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:30.000Z | 40.6               |
| g3        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:30.000Z | 41.384505595567866 |
| g4        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:30.000Z | 41.26735518634935  |

Given the output data in the table above, the `timeWeightedAverage` function does the following:

1. Uses the input table integral as the time weighting factor and multiplies it against the aggregate value. 
2. Converts the unit duration to get the nanosecond duration. 
3. Completes the calculation `r with _value: r._value * float(v: uint(v: unit)) / float(v: int(v: r._stop) - int(v: r._start`. 

Through all four stations, the `timeWeightedAverages` are 40.25, 40.6, 41.38, 41.27, respectively.  

## Calculate value between events

Calculate the value between events by getting the average value during a specific time range. 

The following scenario queries data starting when the four production lines starts and ends. The following query  calculates the average oil temperature value during that period.

{{% note %}}
If you have a retention period on your bucket, you need to update your Cloud to the [usage-based plan](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan) in order for the query to work.
{{% /note %}}

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

In this example, the `_value` in the table below shows the average `oil_temp` from our specific batch start and stop. To recieve the following output data, the `mean()` function calculates the average value between that time range for every individual batch. 

| stationID | _start                   | _stop                    | _value             |
|:-----     | -----                    | -----                    |             ------:|
| g1        | 2021-08-01T01:00:00.000Z | 2021-08-02T00:00:00.000Z | 40                 |
| g2        | 2021-08-01T01:00:00.000Z | 2021-08-02T00:00:00.000Z | 40.6               |
| g3        | 2021-08-01T01:00:00.000Z | 2021-08-02T00:00:00.000Z | 41.379999999999995 |
| g4        | 2021-08-01T01:00:00.000Z | 2021-08-02T00:00:00.000Z | 41.2               |

In order to get the values above, you can view the values before it has been averaged by removing `mean()` in the query. 

| table | stationID | _start                   | _stop                    | _value |
|:----- | -----     | -----                    | -----                    | ------:|
| 0     | g1        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 39.1   |
| 0     | g1        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 40.3   |
| 0     | g1        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 40.6   |
| 1     | g3        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 41.4   |
| 1     | g3        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 41.36  |
| 2     | g4        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 41.2   |
| 3     | g2        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 40.6   |

Given the output data in the table above, the `mean()` function does the following:

1. Groups `_value` by stationID. 
2. Calculates the sum of the values with the same group. 
3. Divides the sum by the number of values in the group. 

Through all four stations, the `means()` are 40, 40.6, 41.38, 41.2, respectively.  

## Record data points with added context

Equipment speed measurements are recorded periodically (float), as is the production order number (string), but not as a field set – as separate streams. I would like to query the equipment speed measurements either in their raw form or aggregated on windows, but I would like to also have the result set include the production order number that was active at that point in time. Example of using `experimental.join` and how to ensure the timestamps align along with the tag keys... But, need to figure out what ties the two streams together?

## Group aggregate on value change(s)

Group together aggregates for one or more measurements over a given interval. 

The following scenario groups together data by one or more context values that creates changes in the state. 

{{% note %}}
If you have a retention period on your bucket, you need to update your Cloud to the [usage-based plan](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan) in order for the query to work.
{{% /note %}}

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

The example above groups together different fields to see their values in relation to a state change. 

The query filters the `pressure` and `pressure_target`fields to determine the state `needsMaintenance`. 

The `aggregateWindow`applies an aggregate every 12 hours to get the average value by appling `fn: mean`. 

 To move the values into one column, the `pivot` function aligns the columns together. The `rowKey` function is the anchor for each point that hinges into a single row. In this query, every row is distinguished by different timestamps. `columnKey`, once the other tables are going to be pinned on the table, will take `_field` to create a new column, and `valueColumn` populates that new columns.

 The first `map` function takes the difference from `pressure` and `pressure_target`. In order to see the fields' relation to the state change, the second `map` function states that if the absolute value of the difference between `pressure` and `pressure_target` is greater than or equal to 15, than it needs maintenance or `true`. If it is lesser than 15, it is marked as false. 

 Given the query above, the output is as shown: 

| _time                    | needsMaintenance | pressure           | pressure_target    | pressureDiff        | stationID |
|:-----                    | -----            | -----              | -----              | -----               |    ------:|
| 2021-08-01T12:00:00.000Z | false            | 101.83929080014092 | 104.37786394078252 | -2.5385731406416028 | g1        |
| 2021-08-02T00:00:00.000Z | false            | 96.04368008245874  | 102.27698650674662 | -6.233306424287889  | g1        |
| 2021-08-01T12:00:00.000Z | false            | 101.62490431541765 | 104.83915260886623 | -3.214248293448577  | g2        |
| 2021-08-02T00:00:00.000Z | false            | 94.52039415465273  | 105.90869375273046	| -11.388299598077722 | g2        |
| 2021-08-01T12:00:00.000Z | false            |	92.23774168403503  | 104.81867444768653 | -12.580932763651504	| g3        |
| 2021-08-02T00:00:00.000Z | true             | 89.20867846153847  | 108.2579185520362  | -19.049240090497733	| g3        |
| 2021-08-01T12:00:00.000Z | false            | 94.40834093349847  | 107.6827757125155  | -13.274434779017028 | g4        |
| 2021-08-02T00:00:00.000Z | true             | 88.61785638936534  | 108.25471698113208 | -19.636860591766734 | g4        |

The table reveals that the `pressureDiff` value `-19.636860591766734` from station g4 and `-19.049240090497733` from station g3 are higher than 15, therefore there is a change in state that marks the `needMaintenance` value as "true" and would require that station to need work to turn that value back to `false`. 