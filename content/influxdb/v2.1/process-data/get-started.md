---
title: Get started with InfluxDB tasks
list_title: Get started with tasks
description: >
  Learn the basics of writing an InfluxDB task that processes data, and then performs an action,
  such as storing the modified data in a new bucket or sending an alert.
aliases:
  - /influxdb/v2.1/process-data/write-a-task/
influxdb/v2.1/tags: [tasks]
menu:
  influxdb_2_1:
    name: Get started with tasks
    parent: Process data
weight: 101
related:
  - /influxdb/v2.1/process-data/manage-tasks/
  - /influxdb/v2.1/process-data/manage-tasks/create-task/
  - /resources/videos/influxdb-tasks/
---

An **InfluxDB task** is a scheduled Flux script that takes a stream of input data,
modifies or analyzes it in some way, then writes the modified data back to InfluxDB
or performs other actions.

This article walks through writing a basic InfluxDB task that downsamples
data and stores it in a new bucket.

## Components of a task

Every InfluxDB task needs the following components.
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
option task = {name: "downsample_5m_precision", every: 1h, offset: 0m}
```

_See [Task configuration options](/influxdb/v2.2/process-data/task-options) for detailed information
about each option._

{{% note %}}
When creating a task in the InfluxDB user interface (UI), task options are
defined in form fields.
{{% /note %}}

## Define a data source

1.  Use [`from()`](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/from/)
    to query data from InfluxDB {{% cloud-only %}}Cloud{{% /cloud-only %}} or any
    other [Flux input functions](/{{< latest "flux" >}}/function-types/#inputs)
    to retrieve data form another source.
2.  Use [`range()`](/{{< latest "flux" >}}/stdlib/universe/range/) to define the time
    range to return data from.
3.  Use [`filter()`](/{{< latest "flux" >}}/stdlib/universe/filter/) to filter
    data based on column values.

```js
from(bucket: "example-bucket")
    |> range(start: -task.every)
    |> filter(fn: (r) => r._measurement == "mem" and r.host == "myHost")
```

{{% note %}}

#### Use task options in your Flux script

Task options defined in a `task` option record and can be referenced in your Flux script.
In the example above, the time range is defined as `-task.every`.

`task.every` is dot notation that references the `every` property of the `task` option record.
`every` is defined as `1h`, therefore `-task.every` equates to `-1h`.

Using task options to define values in your Flux script can make reusing your task easier.
{{% /note %}}

## Process or transform your data

The purpose of tasks is to automatically process or transform data in some way
at regular intervals.
Data processing can include operations such as downsampling data, detecting
anomalies, sending notifications, and more.

{{% note %}}

#### Use offset to account for latent data

Use the `offset` task option to account for potentially latent data (like data from edge devices).
A task that runs at one hour intervals (`every: 1h`) with an offset of five minutes (`offset: 5m`)
executes 5 minutes after the hour, but queries data from the original one hour interval.
{{% /note %}}

The example below illustrates a task that downsamples data by calculating the average of set intervals.
It uses [`aggregateWindow()`](/{{< latest "flux" >}}/stdlib/universe/aggregatewindow/)
to group points into 5 minute windows and calculate the average of each
window with [`mean()`](/{{< latest "flux" >}}/stdlib/universe/mean/).

```js
option task = {name: "downsample_5m_precision", every: 1h, offset: 0m}

from(bucket: "example-bucket")
    |> range(start: -task.every)
    |> filter(fn: (r) => r._measurement == "mem" and r.host == "myHost")
    |> aggregateWindow(every: 5m, fn: mean)
```

_See [Common tasks](/influxdb/v2.2/process-data/common-tasks) for examples of tasks commonly used with InfluxDB._

## Define a destination

In the vast majority of task use cases, once data is transformed, it needs to be sent and stored somewhere.
This could be a separate InfluxDB measurement or bucket.

The example below uses [`to()`](/{{< latest "flux" >}}/stdlib/universe/to)
to write the transformed data back to another InfluxDB bucket:

```js
// ...
    |> to(bucket: "example-downsampled", org: "my-org")
```

To write data into InfluxDB, `to()` requires the following columns:

- `_time`
- `_measurement`
- `_field`
- `_value`

You can also write data to other destinations using
[Flux output functions](/{{< latest "flux" >}}/function-types/#outputs).

## Full example task script

Below is a task script that combines all of the components described above:

```js
// Task options
option task = {name: "downsample_5m_precision", every: 1h, offset: 0m}

// Data source
from(bucket: "example-bucket")
    |> range(start: -task.every)
    |> filter(fn: (r) => r._measurement == "mem" and r.host == "myHost")
    // Data processing
    |> aggregateWindow(every: 5m, fn: mean)
    // Data destination
    |> to(bucket: "example-downsampled")
```

To learn more about InfluxDB tasks and how they work, watch the following video:

{{< youtube zgCmdtZaH9M >}}
