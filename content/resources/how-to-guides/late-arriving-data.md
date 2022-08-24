---
title: Late arriving data
description: >
  Learn how to correct downsampling aggregations for data latency or late arriving data. 
menu:
  resources:
    parent: How-to guides
weight: 102
---
You may want to ensure that your computed aggregations are correct in the face of data latency. Use Flux to correct downsampling aggregations for late arriving data.

## Setup and Scenario

In order to follow this guide you’ll need to create the following resources:



* An all access token. 
* Three buckets: 
    * water_level_raw: The raw data is written to this bucket
    * water_level_mean: The 1 minute means are stored here. This bucket is updated after recomputing a window. The means account for data arriving late for the last hour. 
    * water_level_checksum: Store a checksum (count) per 1 minute window for the last hour. 
* An invokable script:
    * water_level_process.flux

Also imagine the following scenario. You’re writing a fake dataset. This fake dataset contains water levels at 100 different locations. You will be computing the mean water level at each location over 1 minute windows. You can handle data arriving up to 1 hour late. Data for each location is being written every 10s. Additionally every 10s a late data point is written somewhere in the last 1 hour for each location. 


## Overview 

Before diving into the code, take a high level look at the logic of the Flux scripts.


![late arriving data architecture](images/late-arriving-data.png "image_tooltip")


The water_level_checksum.flux is a task. It runs every minute. It counts the number of points that exist in the water_level_raw bucket (new count) and compares that count against the count in the water_level_checksum bucket (old count). If the new count from the water_level_raw bucket isn’t equal to the count from the water_level_checksum bucket then an invokable script is called. Specifically, the water_level_process.flux script is called. This script is responsible for recalculating the old count and aggregation.   


## Flux scripts in detail: water_level_process.flux

The water_level_process.flux script is an invokable script. It’s responsible for two things:


1. Computing the mean value over a parameterized start and stop times. This mean value is written to the water_level_mean bucket. 
2. Calculating the count or total numper of points over parameterized start and stop times. This count is written to the water_level_checksum bucket. 

The water_leve_process.flux script contains the following code: \
`// Compute the mean for the window`


```
from(bucket: "water_level_raw")
    |> range(start: params.start, stop: params.stop)
    |> mean()
    |> to(bucket: "water_level_mean", timeColumn: "_stop")
    |> yield(name: "means")

// Compute and store new checksum for this window
from(bucket: "water_level_raw")
    |> range(start: params.start, stop: params.stop)
    |> group(columns: ["_measurement", "_field", "_stop"])
    |> count()
    |> to(bucket: "water_level_checksum", timeColumn: "_stop")
    |> yield(name: "checksums")
```



## Flux scripts in detail: water_level_checsum.flux

The water_level_process.flux script is a task. This task is responsible for:


1. Counting the number of points in the water_level_raw bucket (new count) for the last hour across 1minute windows.
2. Invoking the water_level_process.flux invokable script to calculate a new mean and a new count across 1 minute windows. 
3. Gathering the previous count in the water_level_checksum bucket (old count) for the last hour. 
4. Comparing an old count against a new count with a join.  
5. Filtering for where the counts do not match.
6. Invoking the water_level_process.flux invokable script to recompute the mean and count for every 1 min window where the counts don't match. 

The task runs at 1m intervals specified by the `every` parameter:


```
option task = {name: "water_level_checksum", every: 1m, offset: 10s}
```


This `every` parameter also determines the window period for which the mean and counts will be computed over. 

The invokeScripts() function is a custom function that invokes the water_level_process.flux invokable script. \
`invokeScript = (start, stop) =>`


```
    requests.post(
        // The script ID here has been hardcoded here
        url: "https://eastus-1.azure.cloud2.influxdata.com/api/v2/scripts/095fabd404108000/invoke",

        headers: ["Authorization": "Token ${token}", "Accept": "application/json", "Content-Type": "application/json"],
        body: json.encode(v: {params: {start: string(v: start), stop: string(v: stop)}}),
    )
```


Remember this invokable script is responsible for both calculating the mean and count and writing it to the water_level_mean and water_level_checksum buckets respectively.  You must pass in values for the start and stop parameters. The token is imported with the secrets manager. 

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