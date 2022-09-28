---
title: Get started with InfluxDB tasks
list_title: Get started with tasks
description: >
  Learn the basics of writing an InfluxDB task that processes data, and then performs an action,
  such as storing the modified data in a new bucket or sending an alert.
aliases:
  - /influxdb/v2.4/process-data/write-a-task/
influxdb/v2.4/tags: [tasks]
menu:
  influxdb_2_4:
    name: Get started with tasks
    parent: Process data
weight: 101
related:
  - /influxdb/v2.4/process-data/manage-tasks/
  - /influxdb/v2.4/process-data/manage-tasks/create-task/
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

_[Skip to the full example task script](#full-example-flux-task-script)_

## Define task options

Task options define the schedule, name, and other information about the task.
The following example shows how to set task options in a Flux script:

```js
option task = {name: "downsample_5m_precision", every: 1h, offset: 0m}
```

_See [Task configuration options](/influxdb/v2.4/process-data/task-options) for detailed information
about each option._

_Note that InfluxDB doesn't guarantee that a task will run at the scheduled time.
See [View task run logs for a task](/influxdb/v2.4/process-data/manage-tasks/task-run-history)
for detailed information on task service-level agreements (SLAs)._

{{% note %}}
The InfluxDB UI provides a form for defining task options.
{{% /note %}}


{{% cloud-only %}}

### Task options for invokable scripts

Use the InfluxDB Cloud API to create tasks that reference and run [invokable scripts](influxdb/cloud/api-guide/api-invokable-scripts/).
When you create or update the task, pass task options as properties in the request body--for example:

```json
  {
   "name": "30-day-avg-temp",
   "description": "IoT Center 30d environment average.",
   "every": "1d",
   "offset": "0m"
   ...
  }
```

To learn more about creating tasks that run invokable scripts, see how to [create a task that references a script](/influxdb/cloud/process-data/manage-tasks/create-task/#create-a-task-that-references-a-script).

{{% /cloud-only %}}

## Retrieve and filter data

A minimal Flux script uses the following functions to retrieve a specified amount
of data from a data source
and then filter the data based on time or column values:

1. [`from()`](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/from/):
   queries data from InfluxDB {{% cloud-only %}}Cloud{{% /cloud-only %}}.
2. [`range()`](/{{< latest "flux" >}}/stdlib/universe/range/): defines the time
   range to return data from.
3. [`filter()`](/{{< latest "flux" >}}/stdlib/universe/filter/): filters
   data based on column values.

The following sample Flux retrieves data from an InfluxDB bucket and then filters by
the `_measurement` and `host` columns:

```js
from(bucket: "example-bucket")
    |> range(start: -task.every)
    |> filter(fn: (r) => r._measurement == "mem" and r.host == "myHost")
```

_To retrieve data from other sources, see [Flux input functions](/{{< latest "flux" >}}/function-types/#inputs)._

{{% note %}}

#### Use task options in your Flux script

InfluxDB stores options in a `task` option record that you can reference in your Flux script.
The following sample Flux uses the time range `-task.every`:

```js
from(bucket: "example-bucket")
    |> range(start: -task.every)
    |> filter(fn: (r) => r._measurement == "mem" and r.host == "myHost")
```

`task.every` is dot notation that references the `every` property of the `task` option record.
`every` is defined as `1h`, therefore `-task.every` equates to `-1h`.

Using task options to define values in your Flux script can make reusing your task easier.
{{% /note %}}

## Process or transform your data

Tasks run scripts automatically at regular intervals.
Scripts process or transform data in some way--for example: downsampling, detecting
anomalies, or sending notifications.

Consider a task that runs hourly and downsamples data by calculating the average of set intervals.
It uses [`aggregateWindow()`](/{{< latest "flux" >}}/stdlib/universe/aggregatewindow/)
to group points into 5-minute (`5m`) windows and calculate the average of each
window with [`mean()`](/{{< latest "flux" >}}/stdlib/universe/mean/).

The following sample code shows the Flux script with task options:

```js
option task = {name: "downsample_5m_precision", every: 1h, offset: 0m}

from(bucket: "example-bucket")
    |> range(start: -task.every)
    |> filter(fn: (r) => r._measurement == "mem" and r.host == "myHost")
    |> aggregateWindow(every: 5m, fn: mean)
```

{{% note %}}
#### Use offset to account for latent data

Use the `offset` task option to account for potentially latent data (like data from edge devices).
A task that runs at one hour intervals (`every: 1h`) with an offset of five minutes (`offset: 5m`)
executes 5 minutes after the hour, but queries data from the original one-hour interval.
{{% /note %}}

_See [Common tasks](/influxdb/v2.4/process-data/common-tasks) for examples of tasks commonly used with InfluxDB._

{{% cloud-only %}}

### Process data with invokable scripts

In InfluxDB Cloud, you can create tasks that run invokable scripts.
You can use invokable scripts to manage and reuse scripts for your organization.
You can use tasks to schedule script runs with options and parameters.

The following sample `POST /api/v2/scripts` request body defines a new invokable script with the Flux from the previous example:

```json
{
   "name": "aggregate-intervals",
   "description": "Group points into 5 minute windows and calculate the average of each
   window.",
   "script": "from(bucket: "example-bucket")\
                |> range(start: -task.every)\
                |> filter(fn: (r) => r._measurement == "mem" and r.host == "myHost")\
                |> aggregateWindow(every: 5m, fn: mean)",
    "language": "flux"
}
```

Note that the script doesn't contain task options.
Once you create the invokable script, you can use `POST /api/v2/tasks` to create a task that runs the script.
The following sample request body defines a task with the script ID and options:

```json
{
   "every": "1h",
   "description": "Downsample host with 5 min precision.",
   "name": "downsample_5m_precision",
   "scriptID": "09b2136232083000"
}
```

To create a script and a task that use parameters, see how to [create a task to run an invokable script](/influxdb/cloud/process-data/manage-tasks/create-task/).

{{% /cloud-only %}}

## Define a destination

In most cases, you'll want to send and store data after the task has transformed it.
The destination could be a separate InfluxDB measurement or bucket.

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

_To write data to other destinations, see
[Flux output functions](/{{< latest "flux" >}}/function-types/#outputs)._

## Full example Flux task script

The following sample Flux combines all the components described in this guide:

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

{{% cloud-only %}}

## Full example task with invokable script

The following sample code shows a `POST /api/v2/scripts` request body that
combines the components described in this guide:

```json
{
   "name": "aggregate-intervals-and-export",
   "description": "Group points into 5 minute windows and calculate the average of each
   window.",
   "script": "from(bucket: "example-bucket")\
                |> range(start: -task.every)\
                |> filter(fn: (r) => r._measurement == "mem" and r.host == "myHost")\
                // Data processing\
                |> aggregateWindow(every: 5m, fn: mean)\
                // Data destination\
                |> to(bucket: "example-downsampled")",
    "language": "flux"
}
```

The following sample code shows a `POST /api/v2/tasks` request body to
schedule the script:

```json
{
   "every": "1h",
   "description": "Downsample host with 5 min precision.",
   "name": "downsample_5m_precision",
   "scriptID": "SCRIPT_ID"
}
```

{{% /cloud-only %}}

To learn more about InfluxDB tasks and how they work, watch the following video:

{{< youtube zgCmdtZaH9M >}}
