---
title: Monitor states
seotitle: Monitor states and state changes in your events and metrics with Flux.
description: Flux provides several functions to help monitor states and state changes in your data.
influxdb/v2.0/tags: [states, monitor, flux]
menu:
  influxdb_2_0:
    name: Monitor states
    parent: Query with Flux
weight: 220
aliases:
  - /influxdb/v2.0/query-data/guides/monitor-states/
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stateduration/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/statecount/
---

Flux helps you monitor states in your metrics and events:

- [Find how long a state persists](#find-how-long-a-state-persists)
- [Count the number of consecutive states](#count-the-number-of-consecutive-states)
<!-- - [Detect state changes](#detect-state-changes) -->

If you're just getting started with Flux queries, check out the following:

- [Get started with Flux](/influxdb/v2.0/query-data/get-started/) for a conceptual overview of Flux.
- [Execute queries](/influxdb/v2.0/query-data/execute-queries/) to discover a variety of ways to run your queries.

## Find how long a state persists

1. Use the [`stateDuration()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stateduration/) function to calculate how long a column value has remained the same value (or state). Include the following information:

  - **Column to search:** any tag key, tag value, field key, field value, or measurement.
  - **Value:** the value (or state) to search for in the specified column.
  - **State duration column:** a new column to store the state duration─the length of time that the specified value persists.
  - **Unit:** the unit of time (`1s` (by default), `1m`, `1h`) used to increment the state duration.

        ```js
        |> stateDuration(
           fn: (r) => r._column_to_search == "value_to_search_for",
           column: "state_duration",
           unit: 1s
         )
        ```

2. Use `stateDuration()` to search each point for the specified value:

    - For the first point that evaluates `true`, the state duration is set to `0`. For each consecutive point that evaluates `true`, the state duration increases by the time interval between each consecutive point (in specified units).
    - If the state is `false`, the state duration is reset to `-1`.

### Example query with stateDuration()

The following query searches the `doors` bucket over the past 5 minutes to find how many seconds a door has been `closed`.

```js
  from(bucket: "doors")
   |> range(start: -5m)
   |> stateDuration(
      fn: (r) =>
      r._value == "closed",
      column: "door_closed",
      unit: 1s)
```

In this example, `door_closed` is the **State duration** column. If you write data to the `doors` bucket every minute, the state duration increases by `60s` for each consecutive point where `_value` is `closed`. If `_value` is not `closed`, the state duration is reset to `0`.

#### Query results

Results for the example query above may look like this (for simplicity, we've omitted the measurement, tag, and field columns):

```sh
_time                   _value        door_closed
2019-10-26T17:39:16Z    closed        0
2019-10-26T17:40:16Z    closed        60
2019-10-26T17:41:16Z    closed        120
2019-10-26T17:42:16Z    open          -1
2019-10-26T17:43:16Z    closed        0
2019-10-26T17:44:27Z    closed        60
```

## Count the number of consecutive states

1. Use the [`stateCount()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/statecount/)
   and include the following information:

  - **Column to search:** any tag key, tag value, field key, field value, or measurement.
  - **Value:** to search for in the specified column.
  - **State count column:** a new column to store the state count─the number of
    consecutive records in which the specified value exists.

        ```js
        |> stateCount(
          fn: (r) => r._column_to_search == "value_to_search_for",
          column: "state_count"
        )
        ```

2. Use `stateCount()` to search each point for the specified value:

    - For the first point that evaluates `true`, the state count is set to `1`. For each consecutive point that evaluates `true`, the state count increases by 1.
    - If the state is `false`, the state count is reset to `-1`.

### Example query with stateCount()

The following query searches the `doors` bucket over the past 5 minutes and calculates how many points have `closed` as their `_value`.

```js
from(bucket: "doors")
  |> range(start: -5m)
  |> stateDuration(
    fn: (r) => r._value == "closed",
    column: "door_closed"
  )
```

This example stores the **state count** in the `door_closed` column. If you write data to the `doors` bucket every minute, the state count increases by `1` for each consecutive point where `_value` is `closed`. If `_value` is not `closed`, the state count is reset to `-1`.

#### Query results

Results for the example query above may look like this (for simplicity, we've omitted the measurement, tag, and field columns):

```bash
_time                   _value        door_closed
2019-10-26T17:39:16Z    closed        1
2019-10-26T17:40:16Z    closed        2
2019-10-26T17:41:16Z    closed        3
2019-10-26T17:42:16Z    open          -1
2019-10-26T17:43:16Z    closed        1
2019-10-26T17:44:27Z    closed        2
```

#### Example query to count machine state

The following query checks the machine state every minute (idle, assigned, or busy). InfluxDB searches the `servers` bucket over the past hour and counts records with a machine state of `idle`, `assigned` or `busy`.

```js
from(bucket: "servers")
  |> range(start: -1h)
  |> filter(fn: (r) =>
     r.machine_state == "idle" or
     r.machine_state == "assigned" or
     r.machine_state == "busy"
  )
  |> stateCount(fn: (r) => r.machine_state == "busy", column: "_count")
  |> stateCount(fn: (r) => r.machine_state == "assigned", column: "_count")
  |> stateCount(fn: (r) => r.machine_state == "idle", column: "_count")
```

<!--## Detect state changes

Detect state changes with the `monitor.stateChanges()` function. To use the `monitor.stateChanges()` function, set up a **check** to query data (stored in the `_monitoring` bucket > `statuses` measurement > `_level` column; see [Monitor data and send alerts](/influxdb/v2.0/monitor-alert/) for more detail.

1. In the InfluxDB user interface, click the **Monitoring and Alerting** icon from the sidebar.

    {{< nav-icon "alerts" >}}

2. If you haven't already, [create a check](/influxdb/v2.0/monitor-alert/checks/create/) that stores statuses (`CRIT`, `WARN`, `INFO`, `OK` or `ANY`) in the `_level` column. <!-- specify how to do this with monitor.check() function or in UI, with check threshold or deadman?
3. Import the InfluxDB `monitor` package.
4. In your query, the specify the check. <!--can users specify a Flux query with the `monitoring` bucket and _level field without specifying the check? does importing the monitor package create the `monitoring` bucket?
5. Use the `monitor.stateChanges()` function and include the following information:

  - `fromLevel` (optional; by default, this is set to `any`)
  - `toLevel`

### Example query with monitor.stateChanges()

```js
  import "influxdata/influxdb/monitor"

  `from ${ r._check_name}`
    monitor.stateChanges(
    fromLevel: "warn",
    toLevel: "crit")
```

<!-- ### Example query results

TBD what query results look like -->

<!--traffic lights

```from(bucket: "doors")

  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r._measurement == "doors")
  |> stateCount(fn: (r) => r._field == "door1", column: "_value")
```


   |> stateDuration(fn: (r) => r._cpu == "usage_idle <= 10s", column "stateDuration", unit: 1s)
  ]]
  |alert()
    // Warn after 1 minute
    .warn(lambda: "state_duration" >= 1)
    // Critical after 5 minutes
    .crit(lambda: "state_duration" >= 5)
```

-->
