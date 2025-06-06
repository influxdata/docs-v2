---
title: Track state changes across task executions
description: >
  Learn how to monitor state changes across task executions, so you don't miss changes across subsequent task runs. 
menu:
  resources:
    parent: How-to guides
weight: 103
---

## Problem

It's common to use [InfluxDB tasks](/influxdb/cloud/process-data/) to evaluate and assign states to your time series data and then detect changes in those states. Tasks process data in batches, but what happens if there is a state change across the batch boundary? The task won't recognize it without knowing the final state of the previous task execution. This guide walks through creating a task that assigns a state to rows and then uses results from the previous task execution to detect any state changes across the batch boundary so you don’t miss any state changes.

## Solution 

Explicitly assign levels to your data based on thresholds.

### Solution Advantages
This is the easiest solution to understand if you have never written a task with the [`monitor` package](/flux/v0/stdlib/influxdata/influxdb/monitor/). 

### Solution Disadvantages
You have to explicitly define your thresholds, which potentially requires more code.

### Solution Overview
Create a task where you:

1. Boilerplate. Import packages and define task options. 
2. Query your data.
3. Assign states to your data based on thresholds. Store this data in a variable, i.e. “states”.
4. Write the “states” to a bucket.
5. Find the latest value from the previous task run and store it in a variable “last_state_previous_task”.
6. Union “states” and “last_state_previous_task”. Store this data in a variable “unioned_states”.
7. Discover state changes in “unioned_states”. Store this data in a variable “state_changes”.
8. Notify on state changes that span across the last two tasks to catch any state changes that occur across task executions.  

### Solution Explained
1. Import packages and define task options and secrets. Import the following packages:
  - [Flux Telegram package](/flux/v0/stdlib/contrib/sranka/telegram/): This package 
  - [Flux InfluxDB secrets package](/flux/v0/stdlib/influxdata/influxdb/secrets/): This package contains the [secrets.get()](/flux/v0/stdlib/influxdata/influxdb/secrets/get/) function which allows you to retrieve secrets from the InfluxDB secret store. Learn how to [manage secrets](/influxdb/v2/admin/secrets/) in InfluxDB to use this package.    
  - [Flux InfluxDB monitoring package](https://docs.influxdata.com/flux/v0/stdlib/influxdata/influxdb/monitor/): This package contains functions and tools for monitoring your data.  
  

    ```js
    import "contrib/sranka/telegram"
    import "influxdata/influxdb/secrets"
    import "influxdata/influxdb/monitor"

    option task = {name: "State changes across tasks", every: 30m, offset: 5m}

    telegram_token = secrets.get(key: "telegram_token")
    telegram_channel_ID = secrets.get(key: "telegram_channel_ID")
    ```

2. Query the data you want to monitor.

    ```js
    data = from(bucket: "example-bucket")
        // Query for data from the last successful task run or from the 1 every duration ago.
        // This ensures that you won’t miss any data.
        |> range(start: tasks.lastSuccess(orTime: -task.every))
        |> filter(fn: (r) => r._measurement == "example-measurement")
        |> filter(fn: (r) => r.tagKey1 == "example-tag-value")
        |> filter(fn: (r) => r._field == "example-field")
    ```

    Where `data` might look like:

    | _measurement        | tagKey1           | _field        | _value | _time                |
    | :------------------ | :---------------- | :------------ | -----: | :------------------- |
    | example-measurement | example-tag-value | example-field |   30.0 | 2022-01-01T00:00:00Z |
    | example-measurement | example-tag-value | example-field |   50.0 | 2022-01-01T00:00:00Z |


3. Assign states to your data based on thresholds. Store this data in a variable, i.e. “states”. To simplify this example, there are only two states: "ok" and "crit." Store states in the `_level` column (required by the `monitor` package). 

    ```js
    states =
        data
            |> map(fn: (r) => ({r with _level: if r._value > 40.0 then "crit" else "ok"}))
    ```

    Where `states` might look like: 

    | _measurement        | tagKey1           | _field        | _value | _level | _time                |
    | :------------------ | :---------------- | :------------ | -----: | :----- | :------------------- |
    | example-measurement | example-tag-value | example-field |   30.0 | ok     | 2022-01-01T00:00:00Z |
    | example-measurement | example-tag-value | example-field |   50.0 | crit   | 2022-01-01T00:01:00Z |


4. Write “states” back to InfluxDB. You can write the data to a new measurement or to a new bucket. To write the data to a new measurement, use [`set()`](/flux/v0/stdlib/universe/set/) to update the value of the `_measurement` column in your “states” data. 

    ```js
    states
        // (Optional) Change the measurement name to write the data to a new measurement
        |> set(key: "_measurement", value: "new-measurement")
        |> to(bucket : "example-bucket") 
    ```

5. Find the latest value from the previous task run and store it in a variable “last_state_previous_task”,

    ```js
    last_state_previous_task =
        from(bucket: "example-bucket")
            |> range(start: date.sub(d: task.every, from: tasks.lastSuccess(orTime: -task.every))
            |> filter(fn: (r) => r._measurement == "example-measurement")
            |> filter(fn: (r) => r.tagKey == "example-tag-value")
            |> filter(fn: (r) => r._field == "example-field")
            |> last() 
    ```

    Where `last_state_previous_task` might look like: 

    | _measurement        | tagKey1           | _field        | _value | _level | _time                |
    | :------------------ | :---------------- | :------------ | -----: | :----- | :------------------- |
    | example-measurement | example-tag-value | example-field |   55.0 | crit   | 2021-12-31T23:59:00Z |

6. Union “states” and “last_state_previous_task”. Store this data in a variable “unioned_states”. Use [`sort()`](/flux/v0/stdlib/universe/sort/) to ensure rows are ordered by time.

    ```js
    unioned_states =
        union(tables: [states, last_state_previous_task])
            |> sort(columns: ["_time"], desc: true)
    ```

    Where `unioned_states` might look like: 

    | _measurement        | tagKey1           | _field        | _value | _level | _time                |
    | :------------------ | :---------------- | :------------ | -----: | :----- | :------------------- |
    | example-measurement | example-tag-value | example-field |   55.0 | crit   | 2021-12-31T23:59:00Z |
    | example-measurement | example-tag-value | example-field |   30.0 | ok     | 2022-01-01T00:00:00Z |
    | example-measurement | example-tag-value | example-field |   50.0 | crit   | 2022-01-01T00:01:00Z |

7. Use [`monitor.stateChangesOnly()`](/flux/v0/stdlib/influxdata/influxdb/monitor/statechangesonly/) to return only rows where the state changed in “unioned_states”. Store this data in a variable, “state_changes”.

    ```js
    state_changes =
        unioned_states 
            |> monitor.stateChangesOnly()
    ```

    Where `state_changes` might look like:

    | _measurement        | tagKey1           | _field        | _value | _level | _time                |
    | :------------------ | :---------------- | :------------ | -----: | :----- | :------------------- |
    | example-measurement | example-tag-value | example-field |   30.0 | ok     | 2022-01-01T00:00:00Z |
    | example-measurement | example-tag-value | example-field |   50.0 | crit   | 2022-01-01T00:01:00Z |

8.  Notify on state changes that span across the last two tasks to catch any state changes that occur across task executions.  

    ```js
    state_changes =
        data
            |> map(
                fn: (r) =>
                    ({
                        _value:
                            telegram.message(
                                token: telegram_token,
                                channel: telegram_channel_ID,
                                text: "state change at ${r._value} at ${r._time}",
                            ),
                    }),
            )
    ```

    Using the unioned data, the following alerts would be sent to Telegram: 
    
    - `state change at 30.0 at 2022-01-01T00:00:00Z`
    - `state change at 50.0 at 2022-01-01T00:01:00Z`
