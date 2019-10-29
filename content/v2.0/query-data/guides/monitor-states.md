---
title: Monitor states
seotitle: Monitor states and state changes in your events and metrics with Flux.
description: Flux provides several functions to help monitor states and state changes in your data.
v2.0/tags: [states, monitor, flux]
menu:
  v2_0:
    name: Monitor states
    parent: How-to guides
weight: 209
---

Flux helps you monitor states in your metrics and events:

- [Find how long a state persists](#find-how-long-a-state-persists)
- [Count the number of states](#count-the-number-of-states)
- (Cloud only) [Detect state changes](#detect-state-changes)

If you're just getting started with Flux queries, check out the following:

- [Get started with Flux](/v2.0/query-data/get-started/) for a conceptual overview of Flux and parts of a Flux query.
- [Execute queries](/v2.0/query-data/execute-queries/) to discover a variety of ways to run your queries.

## Find how long a state persists

1. In your query, specify the bucket to search.
2. Specify a time range to search.
3. Use the `stateDuration()` function and include the following information:
  
  - **Column to search:** any tag key, tag value, field key, field value, or measurement.
  - **Value:** value (or state) to search for in the specified column.
  - **State duration column:** a new column to store the state duration─the length of time the specified value persists.
  - **Unit:** of time to measure the state duration (`1s` (by default), `1m`, `1h`).

        `|> stateDuration(fn: (r) => r._column_to_search == "value_to_search_for", column: "state_duration", unit: 1s`

4. Run `stateDuration()` to search each point in the specified time range for the specified value:

    - For the first point that evaluates `true`, the state duration is set to `0`. For each consecutive point that evaluates `true`, the state duration increases by the time interval between each consecutive point (in specified units).
    - If the state is `false`, the state duration is reset to `-1`.
  
### Example query with stateDuration()

The following query searches the `doors` bucket over the past 5 minutes to find how many seconds a door has been `closed`.

```bash
  from(bucket: "doors")
  |> range(start: -5m)
  |> stateDuration(fn: (r) => r._value == "closed", column: "door_closed", unit: 1s)
  
```

In this example, `door_closed` is the **State duration** column. If you write data to the `doors` bucket every minute, the state duration increases by `60s` for each consecutive point where `_value` is `closed`. If `_value` is not `closed`, the state duration is reset to `0`.

#### Query results

Results for the example query above may look like this (for simplicity, we've omitted the measurement, tag, and field columns):

```bash
_time                   _value        door_closed
2019-10-26T17:39:16Z    closed        0
2019-10-26T17:40:16Z    closed        60
2019-10-26T17:41:16Z    closed        120
2019-10-26T17:42:16Z    open          -1
2019-10-26T17:43:16Z    closed        0
2019-10-26T17:44:27Z    closed        60
```

## Count the number of states

1. In your query, specify the bucket to search.
2. Specify a time range to search.
3. Use the `stateCount()` function and include the following information:

  - **Column to search:** any tag key, tag value, field key, field value, or measurement.
  - **Value:** to search for in the specified column.
  - **State count column:** a new column to store the state count─the number of consecutive records in which the specified value exists.

        `|> stateCount(fn: (r) => r._column_to_search == "value_to_search_for", column: "state_count"`

4. Run `stateCount()` to search each point in the specified time range for the specified value:

    - For the first point that evaluates `true`, the state count is set to `1`. For each consecutive point that evaluates `true`, the state count increases by 1.
    - If the state is `false`, the state count is reset to `-1`.
  
### Example query with stateCount()

The following query searches the `doors` bucket over the past 5 minutes to find how many points have been counted where `_value` is `closed`.

```bash
  from(bucket: "doors")
  |> range(start: -5m)
  |> stateDuration(fn: (r) => r._value == "closed", column: "door_closed")
  
```

In this example, `door_closed` is the **State count** column. If you write data to the `doors` bucket every minute, the state count increases by `1` for each consecutive point where `_value` is `closed`. If `_value` is not `closed`, the state count is reset to `-1`.

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

<!-- #### Example query to count machine state

To check the machine state every minute (idle, assigned, or busy).

```
from(bucket: "servers")
  |> range(start: -1h)
  |> group(columns: "r.machine_state")
(  |> filter(fn: (r) => r.machine_state == "idle" or r.machine_state == "assigned" or r.machine_state == "busy")) --does this help filter if there are more than 3 machine states?...or do next 3 lines do the same?
  |> stateCount(fn: (r) => r.machine_state == "busy", column: "_count")
  |> stateCount(fn: (r) => r.machine_state == "assigned", column: "_count")
  |> stateCount(fn: (r) => r.machine_state == "idle", column: "_count")
```

In this query, InfluxDB searches the `servers` bucket over the past hour, counts records with a machine state of `idle`, `assigned` or `busy` and groups by the machine state:

-->

## Detect state changes

Detect state changes in InfluxDB Cloud 2.0 with the `monitor.stateChanges()` function available in Monitoring and Alerting within a specified check.

1. In Cloud, click **Monitoring and Alerting** icon from the sidebar.

    {{< nav-icon "alerts" >}}

2. Open your query, and then open your specified check. 
3. specify the bucket to search.
2. Specify a time range to search.
3. Use the `stateCount()` function and include the following information:

  - **Column to search:** any tag key, tag value, field key, field value, or measurement.
  - **Value:** to search for in the specified column.
  - **State count column:** a new column to store the state count─the number of consecutive records in which the specified value exists.

        `|> stateCount(fn: (r) => r._column_to_search == "value_to_search_for", column: "state_count"`

 including the following information:

`fromLevel`
`toLevel`
`statuses` measurement
`_level` field

<!-- do they have to import the monitor package? -->
```js
import "influxdata/influxdb/monitor"

monitor.stateChanges(
  fromLevel: "any",
  toLevel: "crit"
)
```

### Detect when the state changes to critical

```js
import "influxdata/influxdb/monitor"

monitor.from(start: -1h)
  |> monitor.stateChanges(toLevel: "crit")
```

traffic lights

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
