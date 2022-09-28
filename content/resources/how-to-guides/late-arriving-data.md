---
title: Handle late arriving data
description: >
  Learn how to account for data latency or late arriving data when aggregating or downsampling data. 
menu:
  resources:
    parent: How-to guides
weight: 102
---

In some cases, due to network latency or other issues, your time series data may arrive to InfluxDB late.
To ensure that your computed aggregations are correct, you must account for data latency in your
aggregation and downsampling tasks.
This guides walks through a method that detects and accounts for late arriving data using InfluxDB
tasks and [API-invokable scripts](/influxdb/cloud/api-guide/api-invokable-scripts/).

## Scenario

Your are collecting and storing water levels at 100 different locations.
Data at each location is reported every 10 seconds.
Network connectivity varies at each location, but reported data can confidently be written to InfluxDB
at least every hour, but maybe more often.

## Setup

In order to follow this guide you’ll need to create the following resources:

- An [All-Access token](/influxdb/cloud/security/tokens/#all-access-token). 
- Three InfluxDB buckets: 
    - **water_level_raw**: Stores the raw water level data.
    - **water_level_mean**: Stores one minute averages of water levels.
      Averages include late arriving data from the last hour. 
    - **water_level_checksum**: Stores one minute counts of water levels.
      The count is used as a checksum for each one minute window.
- An API-invokable script:
    - `water_level_process.flux`: This script computes the minute water level averages and counts the number of points that were used in water level average calculation. The average and count is written to the **water_level_mean** and **water_level_checksum** buckets respectively. 
- A Task:
    - `water_level_checksum.flux`:  This task triggers the `water_level_process.flux` script. This task also recomputes a count of the number of points used to calculagte the most recent water level average value. It compares the most recent count from **water_level_checksum** bucket against this new count and triggers a recaclulation of the water level average to accomodate an increase in the count from late arriving data.   
    
In this process, you compute the average water level at each location over one minute windows.
It's designed to handle data arriving up to one hour late.
Data from each location is written every 10 seconds.
Additionally, every 10 seconds, a late data point is written somewhere in the last one hour for each location. 


## Overview 

Before diving into the code, take a high level look at the logic of the Flux scripts.

{{< img-hd src="static/img/resources/late-arriving-data.png" alt="Late arriving data architecture" />}}

The `water_level_checksum.flux` is a task that runs every minute.
It counts the number of points that exist in the **water_level_raw** bucket (new count) and compares
that count against the count in the **water_level_checksum** bucket (old count).
If the new count from the **water_level_raw** bucket isn’t equal to the count from the
**water_level_checksum** bucket, then the task invokes `water_level_process.flux` API-invokable script
which recalculates the old count and aggregation.   


## Flux scripts in detail

- [Scenario](#scenario)
- [Setup](#setup)
- [Overview](#overview)
- [Flux scripts in detail](#flux-scripts-in-detail)
  - [water_level_process.flux](#water_level_processflux)
- [water_level_checsum.flux](#water_level_checsumflux)
    - [Task details](#task-details)

### water_level_process.flux

`water_level_process.flux` is an invokable script that does two things:


1. Computes the mean of values in the time range defined by the `start` and `stop` script parameters and writes the computed mean to the **water_level_mean** bucket. 
2. Computes the count or total number of points in the time range defined by the `start` and `stop` script parameters and writes the count to the **water_level_checksum** bucket. 

```js
// Compute and store the mean for the window
from(bucket: "water_level_raw")
    |> range(start: params.start, stop: params.stop)
    |> mean()
    |> to(bucket: "water_level_mean", timeColumn: "_stop")
    |> yield(name: "means")

// Compute and store the new checksum for this window
from(bucket: "water_level_raw")
    |> range(start: params.start, stop: params.stop)
    |> group(columns: ["_measurement", "_field", "_stop"])
    |> count()
    |> to(bucket: "water_level_checksum", timeColumn: "_stop")
    |> yield(name: "checksums")
```

Use the [API](/cloud/api-guide/api-invokable-scripts/) or [CLI](/influxdb/cloud/reference/cli/influx/scripts/create/) to create an invokable script.

## water_level_checsum.flux

`water_level_process.flux` is a task that does the following:


1. Counts the number of points in the **water_level_raw** bucket (new count) for the last hour across one minute windows.
2. Invokes the `water_level_process.flux` invokable script to calculate a new mean and a new count across one minute windows. 
3. Gathers the previous count in the **water_level_checksum** bucket (old count) for the last hour. 
4. Joins the old and new streams and compares the old count against a new count.  
5. Filters for counts that do not match.
6. Invokes the `water_level_process.flux` invokable script to recompute the mean and count for every one minute window where the counts do not match. 

#### Task details

- The `task` option provides configuration settings for the task:
    - `name`: Provides a name for the task.
    - `every`: Defines how often the task runs (every one minute) and, in this case, the window interval used to compute means and counts.
    - `offset`: Defines how much time to wait before executing the task. _The offset does not change the time range queried by the task. _
- `invokeScripts()` is a custom function that invokes the `water_level_process.flux` invokable script.
    - `start` and `stop` parameters are required.
    - `scriptID` is required. Find the scriptID with the [API](/influxdb/cloud/api-guide/api-invokable-scripts/#list-invokable-scripts) or [CLI](/influxdb/cloud/reference/cli/influx/scripts/list/)
    - Store your InfluxDB API token as an InfluxDB secret and use the `secrets` package to retrieve the token.
```
option task = {name: "water_level_checksum", every: 1m, offset: 10s}

invokeScript = (start, stop, scriptID) =>
    requests.post(
        url: "https://cloud2.influxdata.com/api/v2/scripts/${scriptID}/invoke",

        headers: ["Authorization": "Token ${token}", "Accept": "application/json", "Content-Type": "application/json"],
        body: json.encode(v: {params: {start: string(v: start), stop: string(v: stop)}}),
    )
```



First the new counts are calculated and stored in the variable `newCounts`. \
`newCounts =`


```
    from(bucket: "water_level_raw")
        |> range(start: start, stop: stop)
        |> group(columns: ["_measurement", "_field"])
        |> aggregateWindow(every: every, fn: count)
```


Where the start and stop values for the range are defined as: \
`start = date.truncate(t: -late_window, unit: every)`

`stop = date.truncate(t: now(), unit: every. `The `late_window` is equal to the longest amount of time you're willing to wait for late arriving data (in this example it’s equal to ). The date.truncate() function is used to truncate the start and stop time to the latest minute to ensure that you successfully recompute values on the same timestamps.  Where `every = task.every`. Since the task is running at 1 minute intervals `every `is equal to `1m`. Additionally remember that the aggregateWindow function uses the _stop column as the source of the new time value for aggregate values by default. 

Next, compute the current mean and count with the following code: \
`// Always compute the most recent interval`


```
newCounts
    |> filter(fn: (r) => r._time == stop)
    |> map(
        fn: (r) => {
            response = invokeScript(start: date.sub(d: every, from: r._time), stop: r._time)

            return {r with code: response.statusCode}
        },
    )
    |> yield(name: "current")
```


filter for the last `newCount` value. Remember, the time value is equal to the stop value because of the default behavior of the aggregateWindow() function. Then map over that single row table to call the invokeScript function once. Here you also pass in values to the start and stop parameters of `date.sub(d: every, from: r._time)` and `r._time`, respectively.  Remember that the `every` variable is equal to 1m. Effectively, this means that you will calculate the mean and count over 1minute intervals (with timestamps appropriately truncated to ensure overwrites of recomputed means later). This code ensures that you will always invoke the water_level_process.flux script at least once to write new means and counts to the water_level_mean and water_level_checksum buckets, respectively. 

Next, query the water_level_checksum bucket for the last hour: 


```
oldCounts =
    from(bucket: "water_level_checksum")
        |> range(start: start, stop: stop)
        |> group(columns: ["_measurement", "_field"])
```


Remember the start and stop times here are equal to - and now() truncated to the minute. 

Now join the old counts and new counts together. You also filter for when the counts differ. If they do differ, then there will be records in the response that can be mapped over. Map over those records to recalculate the mean and count by invoking the level_water_process.flux script: 


```
experimental.join(
    left: oldCounts,
    right: newCounts,
    fn: (left, right) => ({left with old_count: left._value, new_count: right._value}),
)
    // Recompute any windows where the checksum is different
    |> filter(fn: (r) => r.old_count != r.new_count)
    |> map(
        fn: (r) => {
            response = invokeScript(start: date.sub(d: every, from: r._time), stop: r._time)

            return {r with code: response.statusCode}
        },
    )
    |> yield(name: "diffs")
```

The complete `water_level_checsum.flux` is shown below: 


```
import "influxdata/influxdb/secrets"
import "experimental/http/requests"
import "json"
import "date"
import "experimental"

option task = {name: "water_level_checksum", every: 1m, offset: 10s}

// Size of the window to aggregate
every = task.every

// Longest we are willing to wait for late data
late_window = 1h

token = secrets.get(key: "SELF_TOKEN")

// invokeScript calls a Flux script with the given start stop
// parameters to recompute the window.
invokeScript = (start, stop) =>
    requests.post(
        // We have hardcoded the script ID here
        url: "https://eastus-1.azure.cloud2.influxdata.com/api/v2/scripts/095fabd404108000/invoke",
        headers: ["Authorization": "Token ${token}", "Accept": "application/json", "Content-Type": "application/json"],
        body: json.encode(v: {params: {start: string(v: start), stop: string(v: stop)}}),
    )

// Only query windows that span a full minute
start = date.truncate(t: -late_window, unit: every)
stop = date.truncate(t: now(), unit: every)

newCounts =
    from(bucket: "water_level_raw")
        |> range(start: start, stop: stop)
        |> group(columns: ["_measurement", "_field"])
        |> aggregateWindow(every: every, fn: count)

// Always compute the most recent interval
newCounts
    |> filter(fn: (r) => r._time == stop)
    |> map(
        fn: (r) => {
            response = invokeScript(start: date.sub(d: every, from: r._time), stop: r._time)

            return {r with code: response.statusCode}
        },
    )
    |> yield(name: "current")

oldCounts =
    from(bucket: "water_level_checksum")
        |> range(start: start, stop: stop)
        |> group(columns: ["_measurement", "_field"])

// Compare old and new checksum
experimental.join(
    left: oldCounts,
    right: newCounts,
    fn: (left, right) => ({left with old_count: left._value, new_count: right._value}),
)
    // Recompute any windows where the checksum is different
    |> filter(fn: (r) => r.old_count != r.new_count)
    |> map(
        fn: (r) => {
            response = invokeScript(start: date.sub(d: every, from: r._time), stop: r._time)

            return {r with code: response.statusCode}
        },
    )
    |> yield(name: "diffs")
```
