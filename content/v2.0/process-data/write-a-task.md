---
title: Write an InfluxDB task
seotitle: Write an InfluxDB task that processes data
description: >
  How to write an InfluxDB task that processes data in some way, then performs an action
  such as storing the modified data in a new bucket or sending an alert.
menu:
  v2_0:
    name: Write a task
    parent: Process data
weight: 1
---

InfluxDB tasks are scheduled Flux scripts that take a stream of input data, modify or analyze
it in some way, then store the modified data in a new bucket or perform other actions.

This article walks through writing a basic InfluxDB task that downsamples
data and stores it in a new bucket.

## Components of a task
Every InfluxDB task needs the following four components.
Their form and order can vary, but the are all essential parts of a task.

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
    retry: 5
}
```

_See [Task configuration options](/v2.0/process-data/task-options) for detailed information
about each option._

{{% note %}}
If creating a task in the InfluxDB user interface (UI), task options are defined
in form fields when creating the task.
{{% /note %}}

## Define a data source
Define a data source using Flux's [`from()` function](/v2.0/reference/flux/functions/inputs/from/)
or any other [Flux input functions](/v2.0/reference/flux/functions/inputs/).

For convenience, consider creating a variable that includes the sourced data with
the required time range and any relevant filters.

```js
data = from(bucket: "telegraf/default")
  |> range(start: -task.every)
  |> filter(fn: (r) =>
    r._measurement == "mem" AND
    r.host == "myHost"
  )
```

{{% note %}}
#### Using task options in your Flux script
Task options are passed as part of a `task` object and can be referenced in your Flux script.
In the example above, the time range is defined as `-task.every`.

`task.every` is dot notation that references the `every` property of the `task` object.
`every` is defined as `1h`, therefore `-task.every` equates to `-1h`.

Using task options to define values in your Flux script can make reusing your task easier.
{{% /note %}}

## Process or transform your data
The purpose of tasks is to process or transform data in some way.
What exactly happens and what form the output data takes is up to you and your
specific use case.

The example below illustrates a task that downsamples data by calculating the average of set intervals.
It uses the `data` variable defined [above](#define-a-data-source) as the data source.
It then windows the data into 5 minute intervals and calculates the average of each
window using the [`aggregateWindow()` function](/v2.0/reference/flux/functions/transformations/aggregates/aggregatewindow/).

```js
data
  |> aggregateWindow(
    every: 5m,
    fn: mean
  )
```

_See [Common tasks](/v2.0/process-data/common-tasks) for examples of tasks commonly used with InfluxDB._

## Define a destination
In the vast majority of task use cases, once data is transformed, it needs to sent and stored somewhere.
This could be a separate bucket with a different retention policy, another measurement, or even an alert endpoint _(Coming)_.

The example below uses Flux's [`to()` function](/v2.0/reference/flux/functions/outputs/to)
to send the transformed data to another bucket:

```js
// ...
|> to(bucket: "telegraf_downsampled", org: "my-org")
```

{{% note %}}
You cannot write to the same bucket you are reading from.
{{% /note %}}

## Full example task script
Below is the full example task script that combines all of the components described above:


```js
// Task options
option task = {
    name: "cqinterval15m",
    every: 1h,
    offset: 0m,
    concurrency: 1,
    retry: 5
}

// Data source
data = from(bucket: "telegraf/default")
  |> range(start: -task.every)
  |> filter(fn: (r) =>
    r._measurement == "mem" AND
    r.host == "myHost"
  )

data
  // Data transformation
  |> aggregateWindow(
    every: 5m,
    fn: mean
  )
  // Data destination
  |> to(bucket: "telegraf_downsampled")

```
