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

Flux helps you to monitor states and state changes in your metrics and events:

- [Find how long a state persists](#find-how-long-a-state-persists)
- [Count the number of states in a specified interval](#count-the-number-of-states-in-a-specified-interval)
- (Cloud only) [Detect specified state changes](#detect-specified-state-changes)

## Find how long a state persists

1. Specify the bucket to search.
2. Specify a time range to search.
3. Use the `stateDuration()` function and include the following information:

  - State to search for. If `true`, increment the state duration. If `false`, the state duration is reset to `0`.
  - Column to store the state duration.
  - Unit of time to increment the state duration (for example, `1s`, `1m`, `1h`).
  <!-- if the unit isn't specified...is there a default value added, or throw an error? -->

### Query to find state duration

The following query searches the `doors` bucket to find the state duration over the past 24 hours, in seconds. <!-- what if you're looking for the the duration of all states, would you filter by the specified "state" you're looking for before the stateDuration() function? -->

```
bash
from(bucket: "doors")
  |> range(start: -24h)
  |> stateDuration(fn: (r) => r._measurement == "state", column: "stateDuration", unit: 1s)
```

```bash
  from(bucket: "cpu")
   |> range(start: -24h)
   |> group(columns: ["host", "_cpu-total"])
   |> stateDuration(fn: (r) => r._cpu == "cpu-total", column: "stateDuration", unit: 1s)
```

```js
from("monitor/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "http")
  |> stateDuration(
    fn: (r) => r.http_response_code == "500",
    column: "server_error_duration"
  )
```

```js
from("monitor/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "http")
  |> stateDuration(
    fn: (r) => r.state == "",
    column: "server_error_duration"
  )
```


## Count the number of states in a specified interval

 To find the number of consecutive records in a given state, use the stateCount() function and specify the following information:

- bucket
- time range
- measurement
- field key
- tag key
- field value to count

### Query to count machine state

To check the machine state every minute (idle, assigned, or busy).

```
from(bucket: "servers")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "nodes")
  |> filter(fn: (r) => r._field == "state")
  |> filter(fn: (r) => r.node == "node1")
  |> stateCount(fn: (r) => r._value == "busy", column: "_count")
  |> stateCount(fn: (r) => r._value == "assigned", column: "_count")
  |> stateCount(fn: (r) => r._value == "idle", column: "_count")
```

Here, InfluxDB searches the `servers` bucket over the past hour, for records that include the following criteria:

- `doors` measurement
- `door` tag key
- `door1` tag value
- `status` field key

### Query to count a door's closed state

```
from(bucket: "doors")
  |> range(start: -30d)
  |> filter(fn: (r) => r._measurement == "doors")
  |> filter(fn: (r) => r._field == "status")
  |> filter(fn: (r) => r.door == "door1")
  |> stateCount(fn: (r) => r._value == "closed", column: "_count")
```

Here, InfluxDB searches the `doors` bucket over the past 30 days, for records that include the following criteria:

- `doors` measurement
- `door` tag key
- `door1` tag value
- `status` field key

This combination of data—_measurement_, _tag key_, _tag value_, and _field key_ —is a _series key_. <!-- test this. Each unique series key represents a new table? or do new, unique field values trigger a new table too?-->

InfluxDB evaluates each consecutive record _with the specified series key_ to determine whether the `_value` is `closed`. If `true`, the state count is incremented by one. If `false`, the state count is reset and returns `-1`. For each record, the value is added to the `_count` column (stored as the `long` data type).

In annotated CSV format, query results look similar to the format shown in the table below.

### Query results

| table | _start  |   _stop    |    _time         | _value | _field | _measurement | door  | _count |
|  ---  |  ---  |  ---  |  ---  |  ---  |  ---  |  ---  |  ---  | ---|
| 0     | 2019-09-25T19:40:22.318247188Z | 2019-10-25T19:09:26.763725117Z | 2019-10-18T12:00:00Z | closed | status | doors        | door1 | 1      |
| 0   |   2019-09-25T19:40:22.318247188Z     |  	2019-10-25T19:09:26.763725117Z     | 2019-10-18T12:33:20Z      |      open |    status   |   doors    |  door1     |-1|
| 0    |  2019-09-25T19:40:22.318247188Z     |  2019-10-25T19:09:26.763725117Z     |  	2019-10-20T23:45:05Z    |    closed   |  	status     |   doors	    |   door1    |1|
| 0    |    2019-09-25T19:40:22.318247188Z   |   2019-10-25T19:09:26.763725117Z    |   2019-10-21T12:00:00Z    |closed       |  status     |   doors    |   door1    |2|
| 0    | 2019-09-25T19:40:22.318247188Z      |  2019-10-25T19:09:26.763725117Z     |  2019-10-22T12:33:20Z     |    open   |   status    |    doors   | door1      |-1|


## Detect specified state changes

To detect specified state changes in your data, use the `monitor.stateChanges()` function and specify the following information:

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