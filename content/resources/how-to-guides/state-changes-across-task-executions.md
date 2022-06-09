---
title: State changes across task executions
description: >
  This how-to guide walks you through how to monitor state changes across task executions, so you miss changes across subsequent task runs. 
menu:
  resources:
    parent: How-to Guides
weight: 112
date: 2021-06-03
series: [Tasks]
metadata: [Tasks]
---
## Problem

Users want to be able to detect changes in a state across their time series data. They use a task to assign a level to their data. They want to be able to detect and alert state changes across those task executions so they don’t miss state changes.

## Solution 1

Assign levels to the data based on thresholds explicitly. This approach is the most straightforward for users who have never written a custom check before or used the monitor package. Solution 2 will use the monitor package. For this example we’ll be using the telegram flux package to send alerts to telegram. You can use any other endpoint. 

### Solution 1 Advantages
The easiest to understand for Flux users who have never written a task with the monitor package. 

### Solution 1 Disadvantages
You have to explicitly define your thresholds (potentially more code).

### Solution 1 Overview
Create a task where you:

1. Boilerplate. Import packages and define task options. 
2. Query your data.
3. Assign states to your data based on thresholds. Store this data in a variable, i.e. “states”.
4. Write the “states” to a bucket.
5. Find the latest value from the previous task run and store it in a variable “last_state_previous_task”.
6. Union “states” and “last_state_previous_task”. Store this data in a variable “unioned_states”.
7. Discover state changes in “unioned_states”. Store this data in a variable “state_changes”.
8. Notify on state changes that span across the last two tasks to catch any state changes that occur across task executions.  

### Solution 1 Explained
1. Import packages and define task options and secrets. 

    ```js
    import "contrib/sranka/telegram"
    import "influxdata/influxdb/secrets"
    import "experimental"

    option task = {name: "State changes across tasks", every: 30m, offset: 5m}

    telegram_token = secrets.get(key: "telegram_token")
    telegram_channel_ID = secrets.get(key: "telegram_channel_ID")
    ```

2. Query for your data

    ```js
    data = from(bucket: "<bucket>")
      // Query for data from the last successful task run or from the 1 every duration ago. This ensures that you won’t miss any data.
      |> range(start: tasks.lastSuccess(orTime: -task.every))
      |> filter(fn: (r) => r._measurement == "<measurement1>")
      |> filter(fn: (r) => r.tagKey1 == "<tagValue1>")
      |> filter(fn: (r) => r._field == "<fieldKey1>")
    ```

    Where `data` might look like:

    | measurement  | tagKey1   | _field    | _value | _time |  
    | ------------ | --------- | --------- | ------ | ----- |
    | _measurement | tagValue1 | fieldKey1 | 30.0   | time1 | 
    | _measurement | tagValue1 | fieldKey1 | 50.0   | time2 | 


3. Assign states to your data based on thresholds. Store this data in a variable, i.e. “states”. We’re setting all of the values to “critical” to simplify the problem and testing. The new column must be named “_level” to use the monitor package. 

    ```js
    states = data
    |> map( fn: (r) => ({r with
    _level: if r._value > 40.0 then "crit"  else "ok",
        }))
    ```

    Where `states` might look like: 

    | measurement  | tagKey1   | _field    | _value | _level | _time |  
    | ------------ | --------- | --------- | ------ | ------ | ----- |
    | _measurement | tagValue1 | fieldKey1 | 30.0   | "ok"   | time1 | 
    | _measurement | tagValue1 | fieldKey1 | 50.0   | “crit” | time2 | 


4. Write the “states” to a bucket. You could also elect to write the data to a new bucket or a new measurement. If you want to write the data to a new measurement, make sure to change the measurement name from your “states” data with the [set()](/flux/v0.x/stdlib/universe/set/) function first. 

    ```js
    states 
    |> to(bucket : "<bucket>") 
    ```

5. Find the latest value from the previous task run and store it in a variable “last_state_previous_task”,

    ```js
    last_state_previous_task = from(bucket: "<bucket>")
      |> range(start: experimental.subDuration(d: task.every,

        from: tasks.lastSuccess(orTime: -task.every))
      |> filter(fn: (r) => r._measurement == "<measurement>")
      |> filter(fn: (r) => r.tagKey == "<tagValue1>")
      |> filter(fn: (r) => r._field == "<fieldKey1>")
      |> last() 
    ```

    Where `last_state_previous_task` might look like: 

      | measurement  | tagKey1   | _field    | _value | _level | _time |  
      | ------------ | --------- | --------- | ------ | ------ | ----- |
      | _measurement | tagValue1 | fieldKey1 | 55.0   | "crit" | time0 | 

6. Union “states” and “last_state_previous_task”. Store this data in a variable “unioned_states”.

    ```js
    unioned_states = union(tables: [states, last_state_previous_task])

    // use the sort() function to guarantee that you preserve the time order

    |> sort(columns: ["_time"], desc: true)
    ```

    Where `unioned_states` might look like: 

    | measurement  | tagKey1   | _field    | _value | _level | _time |  
    | ------------ | --------- | --------- | ------ | ------ | ----- |
    | _measurement | tagValue1 | fieldKey1 | 55.0   | "crit" | time0 | 
    | _measurement | tagValue1 | fieldKey1 | 30.0   | "ok"   | time1 | 
    | _measurement | tagValue1 | fieldKey1 | 50.0   | "crit" | time2 | 

7. Discover state changes in “unioned_states”. Store this data in a variable “state_changes”.

    ```js
    state_changes = unioned_states 
        |> monitor.stateChangesOnly()
    ```

    Where `state_changes` might look like:

    | _measurement        | tagKey1           | _field        | _value | _level | _time                |
    | :------------------ | :---------------- | :------------ | -----: | :----- | :------------------- |
    | example-measurement | example-tag-value | example-field |   30.0 | ok     | 2022-01-01T00:00:00Z |
    | example-measurement | example-tag-value | example-field |   50.0 | crit   | 2022-01-01T00:01:00Z |

8.  Notify on state changes that span across the last two tasks to catch any state changes that occur across task executions.  

    ```js
    state_changes = data

    |> map(fn: (r) => ({ _value: telegram.message(token: telegram_token, channel: telegram_channel_ID , text:  "state change at ${r._value} at ${r._time}"  )}))
    ```

    Where the alerts received on telegram might look like: 
    `state change at 30.0 at time1` and `state change at 50.0 at time2`.
