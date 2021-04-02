---
title: Downsample data with InfluxDB
seotitle: Downsample data in an InfluxDB task
description: >
  How to create a task that downsamples data much like continuous queries
  in previous versions of InfluxDB.
menu:
  influxdb_cloud:
    name: Downsample data
    parent: Common tasks
weight: 201
influxdb/cloud/tags: [tasks]
---

One of the most common use cases for InfluxDB tasks is downsampling data to reduce
the overall disk usage as data collects over time.
In previous versions of InfluxDB, continuous queries filled this role.

This article walks through creating a continuous-query-like task that downsamples
data by aggregating data within windows of time, then storing the aggregate value in a new bucket.

### Requirements
To perform a downsampling task, you need to the following:

##### A "source" bucket
The bucket from which data is queried.

##### A "destination" bucket
A separate bucket where aggregated, downsampled data is stored.

##### Some type of aggregation
To downsample data, it must be aggregated in some way.
What specific method of aggregation you use depends on your specific use case,
but examples include mean, median, top, bottom, etc.
View [Flux's aggregate functions](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/)
for more information and ideas.

## Example downsampling task script
The example task script below is a very basic form of data downsampling that does the following:

1. Defines a task named "cq-mem-data-1w" that runs once a week.
2. Defines a `data` variable that represents all data from the last 2 weeks in the
   `mem` measurement of the `system-data` bucket.
3. Uses the [`aggregateWindow()` function](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow/)
   to window the data into 1 hour intervals and calculate the average of each interval.
4. Stores the aggregated data in the `system-data-downsampled` bucket under the
   `my-org` organization.

```js
// Task Options
option task = {
  name: "cq-mem-data-1w",
  every: 1w,
}

// Defines a data source
data = from(bucket: "system-data")
  |> range(start: -duration(v: int(v: task.every) * 2))
  |> filter(fn: (r) => r._measurement == "mem")

data
  // Windows and aggregates the data in to 1h averages
  |> aggregateWindow(fn: mean, every: 1h)
  // Stores the aggregated data in a new bucket
  |> to(bucket: "system-data-downsampled", org: "my-org")
```

Again, this is a very basic example, but it should provide you with a foundation
to build more complex downsampling tasks.

## Add your task
Once your task is ready, see [Create a task](/influxdb/cloud/process-data/manage-tasks/create-task) for information about adding it to InfluxDB.

## Things to consider
- If there is a chance that data may arrive late, specify an `offset` in your
  task options long enough to account for late-data.
- If running a task against a bucket with a finite retention period, do not schedule
  tasks to run too closely to the end of the retention period.
  Always provide a "cushion" for downsampling tasks to complete before the data
  is dropped by the retention period.
