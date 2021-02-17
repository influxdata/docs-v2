---
title: Get started with InfluxDB tasks
list_title: Get started with tasks
description: >
  Learn the basics of writing an InfluxDB task that processes data, and then performs an action,
  such as storing the modified data in a new bucket or sending an alert.
aliases:
  - /influxdb/v2.0/process-data/write-a-task/
influxdb/v2.0/tags: [tasks]
menu:
  influxdb_2_0:
    name: Get started with tasks
    parent: Process data
weight: 101
---

An **InfluxDB task** is a scheduled Flux script that takes a stream of input data, modifies or analyzes
it in some way, then stores the modified data in a new bucket or performs other actions.

This article walks through writing a basic InfluxDB task that downsamples
data and stores it in a new bucket.

## Components of a task

Every InfluxDB task needs the following four components.
Their form and order can vary, but they are all essential parts of a task.

- [Task options](#define-task-options)
- [A data source](#define-a-data-source)
- [Data processing or transformation](#process-or-transform-your-data)
- [A destination](#define-a-destination)

_[Skip to the full example task script](#full-example-task-script)_

## Define task options

Task options define specific information about the task.
The example below illustrates how task options are defined in your Flux script:

```js
option task = {
    name: "cqinterval15m",
    every: 1h,
    offset: 0m,
    concurrency: 1,
}
```

_See [Task configuration options](/influxdb/v2.0/process-data/task-options) for detailed information
about each option._

{{% note %}}
When creating a task in the InfluxDB user interface (UI), task options are defined in form fields.
{{% /note %}}

## Define a data source

Define a data source using Flux's [`from()` function](/{{< latest "flux" >}}/stdlib/universe/from/)
or any other [Flux input functions](/{{< latest "flux" >}}/function-types#inputs).

For convenience, consider creating a variable that includes the sourced data with
the required time range and any relevant filters.

```js
data = from(bucket: "example-bucket")
  |> range(start: -task.every)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r.host == "myHost"
  )
```

{{% note %}}
#### Using task options in your Flux script

Task options are passed as part of a `task` option record and can be referenced in your Flux script.
In the example above, the time range is defined as `-task.every`.

`task.every` is dot notation that references the `every` property of the `task` option record.
`every` is defined as `1h`, therefore `-task.every` equates to `-1h`.

Using task options to define values in your Flux script can make reusing your task easier.
{{% /note %}}

## Process or transform your data

The purpose of tasks is to process or transform data in some way.
What exactly happens and what form the output data takes is up to you and your
specific use case.

{{% note %}}
#### Account for latent data with an offset

To account for latent data (like data streaming from your edge devices), use an offset in your task. For example, if you set a task interval on the hour with the options `every: 1h` and `offset: 5m`, a task executes 5 minutes after the task interval but the query [`now()`](/{{< latest "flux" >}}/stdlib/universe/now/) time is on the exact hour.

{{% /note %}}

The example below illustrates a task that downsamples data by calculating the average of set intervals.
It uses the `data` variable defined [above](#define-a-data-source) as the data source.
It then windows the data into 5 minute intervals and calculates the average of each
window using the [`aggregateWindow()` function](/{{< latest "flux" >}}/stdlib/universe/aggregatewindow/).

```js
data
  |> aggregateWindow(
    every: 5m,
    fn: mean
  )
```

_See [Common tasks](/influxdb/v2.0/process-data/common-tasks) for examples of tasks commonly used with InfluxDB._

## Define a destination

In the vast majority of task use cases, once data is transformed, it needs to be sent and stored somewhere.
This could be a separate bucket or another measurement.

The example below uses Flux's [`to()` function](/{{< latest "flux" >}}/stdlib/universe/to)
to send the transformed data to another bucket:

```js
// ...
|> to(bucket: "example-downsampled", org: "my-org")
```

{{% note %}}
In order to write data into InfluxDB, you must have `_time`, `_measurement`, `_field`, and `_value` columns.
{{% /note %}}

## Full example task script

Below is a task script that combines all of the components described above:

```js
// Task options
option task = {
    name: "cqinterval15m",
    every: 1h,
    offset: 0m,
    concurrency: 1,
}

// Data source
data = from(bucket: "example-bucket")
  |> range(start: -task.every)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r.host == "myHost"
  )

data
  // Data transformation
  |> aggregateWindow(
    every: 5m,
    fn: mean
  )
  // Data destination
  |> to(bucket: "example-downsampled")

```
