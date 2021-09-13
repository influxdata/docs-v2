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

The following scenarios are ways to retrieve information about your IoT sensors:
- [Record time in state](#record-time-in-state)
- [Calculate time weighted average](#calculate-time-weighted-average)
- [Calculate value between events](#calculate-value-between-events)
- [Record data points with added context](#record-data-points-with-added-context)
- [Group aggregate on value change(s)](#group-aggregate-on-value-changes)


## Record time in state

In this scenario, we look at whether a production line is running smoothly (`state`=`OK`) and what percentage of time the production line is running smoothly or not (`state`=`NOK`). If no points are recorded during the interval (`state`=`NaN`), you may opt to retrieve the last state prior to the interval. 

This scenario uses the machine-production sample data. To learn more about sample data, see [sample data](/influxdb/cloud/reference/sample-data/).

To visualize the time in state, see the [Mosaic visualization](#mosaic-visualization).

{{% note %}}
If you have a retention period on your bucket, you need to update your Cloud to the [usage-based plan](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan) in order for the query to work.
{{% /note %}}

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

Given the input data in the table above, the `map` function above does the following:

1. Adds the `NOK` and `OK` values to calculate `totalTime`. 
2. Divides `NOK` by `totalTime`, and then multiplies the quotient by 100. 
3. Divides `OK` by `totalTime`, and then multiplies the quotient by 100. 

The results 88.66% of time is in the true state and 11.34% of time is in the false state.

##### Mosaic visualization 

The following query displays the change of "false" to "true". A mosaic visualization displays state changes over time. In this example, the mosaic visualization displayed different colored tiles based on the changes of state. 

```js
from(bucket: "machine")
  |> range(start: 2021-08-01T00:00:00Z, stop: 2021-08-02T00:30:00Z)
  |> filter(fn: (r) => r._measurement == "machinery")
  |> filter(fn: (r) => r._field == "state")
  |> aggregateWindow(every: v.windowPeriod, fn: last, createEmpty: false)
```
At the end of the query, `aggregateWindow` is used to split up data for the UI to display. Within the agregate, `windowPeriod` divides the data into timewindows that would span a single pixel, so it becomes one point per pixel, specifically the last pixel in the entire window of time. The `createEmpty: false` function assures that the mosaic visualization won't create an empty point with a null value if there is a time window with no data. 

These features assure that the mosaic visualization is properly displayed. 

For more information about mosaic visualizations, see [here](/influxdb/cloud/visualize-data/visualization-types/mosaic/). 

## Calculate time weighted average

Calculate the time-weighted average by using the linearly interpolated integral of values in a table to calculate the average over time.

#### Example: Calculate oil temperature 

For example, you want to calculate oil temperature over a given interval using the machine-production sample data.  

{{% note %}}
If you have a retention period on your bucket, you need to update your Cloud to the [usage-based plan](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan) in order for the query to work.
{{% /note %}}

The total temperature considers both the total hours in the day and the temperature of the different batches. A time-weighted average requires time to be shown in decimal form. 

Minutes will be divided by 60 and seconds will be divided by 3600 to get a decimal form of the hour. Depending on what your time is, the hour and the quotient of the minutes and the seconds will be added to recieve your time in decimals.  

To recieve the average oil temperature, the temperature (in the `_value` column) is multiplied by the time period (as a decimal), divided by the total time. In this example, the average oil temperature for the time range is calculated across four different stations in a production line. 

##### Flux query to calculate time-weighted average

```js
from(bucket: "machine")
  |> range(start: 2021-08-01T00:00:00Z, stop: 2021-08-01T00:00:20Z)
  |> filter(fn: (r) =>
    r._measurement == "machinery" and r._field == "oil_temp"
  )
|> timeWeightedAvg(unit: 5s)
```

In this example, the `_value` in the table below shows input data from the `temperature` field in the `machinery` measurement. For the following input data:

| table | stationID | _start                   | _stop                    | _value |
|:----- | -----     | -----                    | -----                    | ------:|
| 0     | g3        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 41.4   |
| 0     | g3        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 41.36  |
| 1     | g4        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 41.2   |
| 2     | g1        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 39.1   |
| 2     | g1        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 40.3   |
| 2     | g1        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 40.6   |
| 3     | g2        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 40.6   |

In order to get the values above, you can view the values before it has been averaged by removing `timeWeightedAvg` in the table above.  

After The function `timeWeightedAvg` takes the average of the temperature every 5 seconds, you get the following output data in the table below.

| stationID | _start                   | _stop                    | _value             |
|:-----     | -----                    | -----                    |             ------:|
| g1        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 40.25396118491921  |
| g2        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 40.6               |
| g3        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 41.384505595567866 |
| g4        | 2021-08-01T01:00:00.000Z | 2021-08-01T00:00:20.000Z | 41.26735518634935  |

Given the input data in the table above, the example function does the following:

1. Multiplies each value by its time-weighting interval by station id: `39.1x0.0056, 40.3x0.0056, 40.6x0.0056`, `40.6x0.0056`, `41.4x0.0056, 41.36x0.0056`, and `41.2x0.0056` 
2. Sums the values in step 1 to calculate the total weighted exposure: `2.0 + 3.0 + 4.0 + 5.0 + 6.0 = 20.0`
3. Divides the value in step 2 by the total hours of exposure: `20.0/8 = 2.5` and returns:

   | _value |
   | :----: |
   |  2.5   |

## Calculate value between events

Calculate the value between events by getting the average value during a specific time range. 

The following scenario queries data starting when the four production lines starts and ends. The following query would calculate the average oil temperature value during that period.

{{% note %}}
If you have a retention period on your bucket, you need to update your Cloud to the [usage-based plan](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan) in order for the query to work.
{{% /note %}}

```js
batchStart = 2021-08-01T00:00:00Z
batchStop = 2021-08-02T00:00:00Z

from(bucket: "machine")
  |> range(start: batchStart, stop: batchStop)
  |> filter(fn: (r) =>
    r._measurement == "machinery" and
    r._field == "oil_temp"
  )
  |> mean()
```
In this example, the `_value` in the table below shows the average `oil_temp` from our specific batch start and stop. To recieve the following input data, the `mean()` function calculates the average value between that time range for every individual batch. 

| stationID | _start                   | _stop                    | _value             |
|:-----     | -----                    | -----                    |             ------:|
| g1        | 2021-08-01T01:00:00.000Z | 2021-08-02T00:00:00.000Z | 39.359974719346376 |
| g2        | 2021-08-01T01:00:00.000Z | 2021-08-02T00:00:00.000Z | 40.12639796196727  |
| g3        | 2021-08-01T01:00:00.000Z | 2021-08-02T00:00:00.000Z | 39.68573009329573  |
| g4        | 2021-08-01T01:00:00.000Z | 2021-08-02T00:00:00.000Z | 40.219930334526325 |

## Record data points with added context

Equipment speed measurements are recorded periodically (float), as is the production order number (string), but not as a field set – as separate streams. I would like to query the equipment speed measurements either in their raw form or aggregated on windows, but I would like to also have the result set include the production order number that was active at that point in time. Example of using experimental.join and how to ensure the timestamps align along with the tag keys... But, need to figure out what ties the two streams together?

## Group aggregate on value change(s)

Similar to Scenario 4, but I’d like to have something akin to a “group by” aggregate for one or more measurements over given interval, grouped by one or more context values that might change state (production order number, crew, machine state, etc.)
 
