---
title: Use Flux tasks with Kapacitor
description: >
  Use **Kapacitor 1.6+** to run Flux tasks against InfluxDB and other data sources.
  Leverage the full library of Flux functionality to build powerful data processing
  and monitoring tasks in Kapacitor.
menu:
  kapacitor_1_6:
    name: Use Flux tasks
    parent: work-w-kapacitor
related: 
  - /influxdb/cloud/tools/kapacitor/
  - /{{< latest "influxdb" >}}/tools/kapacitor/
  - /kapacitor/v1.6/working/flux/manage/create/
  - /influxdb/cloud/process-data/get-started/, Get started with Flux tasks
  - /influxdb/cloud/process-data/common-tasks/
  - /influxdb/cloud/process-data/task-options/
---

Use **Kapacitor 1.6+** to run Flux tasks against InfluxDB and other data sources.
Leverage the full library of Flux functionality to build powerful data processing
and monitoring tasks in Kapacitor.

## Before you start
Before you get started with Flux tasks, consider:

- Kapacitor Flux tasks can not use Kapacitor topics or event handlers.
  You can only send alerts from within a Flux script using Flux notification endpoints.
- Flux tasks are scheduled and executed by the Flux task engine built into Kapacitor 1.6+.
  This engine is separate from the Kapacitor TICKscript task engine.
- Flux tasks are configured with the Flux `task` option inside of a Flux task script.
  This includes the task name and execution schedule.

**Select which version of InfluxDB you're using:**

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB 1.x](#)
[InfluxDB Cloud or 2.x](#)
{{% /tabs %}}
<!------------------------- BEGIN InfluxDB 1.x content ------------------------>
{{% tab-content %}}

1. [Set up a Flux task database in InfluxDB](#set-up-a-flux-task-database-in-influxdb)
2. [Configure Kapacitor Flux tasks](#configure-kapacitor-flux-tasks)
3. [Create a Flux task](#create-a-flux-task)

## Set up a Flux task database in InfluxDB
_({{< req "Optional but encouraged" >}})_

When Kapacitor executes a Flux task, it can store information about the task
execution (run) in an InfluxDB database.
To store this data, do the following:

1. Create a new database in InfluxDB to store Flux task run and log data in.

    ```sql
    CREATE DATABASE kapacitorfluxtasks
    ```

2. To prevent large amounts of Kapacitor Flux task log data on disk, update
   the default `autogen` retention policy with a finite retention period or
   create a new retention policy (RP) with a finite retention period.

    {{< code-tabs-wrapper >}}
    {{% code-tabs %}}
[Update RP](#)
[Create new RP](#)
    {{% /code-tabs %}}
    {{% code-tab-content %}}

```sql
-- Syntax
ALTER RETENTION POLICY <rp-name> ON <db-name> DURATION <new-retention-duration>

-- Example
ALTER RETENTION POLICY autogen ON kapacitorfluxtasks DURATION 3d
```
    {{% /code-tab-content %}}
    {{% code-tab-content %}}
```sql
-- Syntax
CREATE RETENTION POLICY <rp-name> on <db-name> DURATION <retention-duration>

-- Example 
CREATE RETENTION POLICY threedays on kapacitorfluxtasks DURATION 3d
```
    {{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

## Configure Kapacitor Flux tasks
Update or add the following settings under `[fluxtask]` your `kapacitor.conf`:

- **enabled**: `true`
- **task-run-influxdb**: Name of the [InfluxDB configuration in your `kapacitor.conf`](/kapacitor/v1.6/administration/configuration/#influxdb)
  to use to store Flux task data.
  _To disable Flux task logging, set to `"none"`._
- **task-run-bucket**: InfluxDB database to store Flux task data and logs in. By default, data is written to the `kapacitor_fluxtask_logs` database. To specify another database to write task log data to, use the `"db-name"` naming convention (including the retention policy `"db-name/rp"` is not supported). If the specified database does not already exist in InfluxDB, Kapacitor attempts to create the database. If authentication is turned on, permissions to `CREATE DATABASE` are required. For more information, see [Authentication and authorization in InfluxDB](/influxdb/v1.8/administration/authentication_and_authorization/).
- Provide one of the following:
    - **task-run-org**: _Leave as an empty string (`""`)_
    - **task-run-orgid**: _Leave as an empty string (`""`)_
- **task-run-measurement**: InfluxDB measurement to store task run and log data in.
  Default is `"runs"`.

##### Kapacitor Flux task configuration example
```toml
# ...

[fluxtask]
  enabled = true
  task-run-influxdb = "default"
  task-run-bucket = "kapacitorfluxtasks/autogen"
  task-run-org = ""
  task-run-orgid = ""
  task-run-measurement = "runs"

# ...
```

_For more information about Kapacitor `[fluxtask]` configuration options,
see [Configure Kapacitor](/kapacitor/v1.6/administration/configuration/#flux-tasks)._

## Create a Flux task

1.  Create a Flux task script. Include [the task option](/influxdb/v2.0/process-data/task-options/)
    in your script to configure the Kapacitor Flux task. _For more information about writing Flux tasks, see:_
     
    - [Get started with Flux tasks](/{{< latest "influxdb" >}}/process-data/get-started/)
    - [Common data processing tasks](/{{< latest "influxdb" >}}/process-data/common-tasks/)

    #### Provide InfluxDB connection credentials
    [`from()`](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/from/) and
    [`to()`](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/to/) functions
    require your InfluxDB **host** and **token**.

    - **host:** InfluxDB URL.
    - **token:** If **[InfluxDB authentication is enabled](/{{< latest "influxdb" "v1" >}}/administration/authentication_and_authorization)**,
      use the `username:password` syntax.
      Otherwise, use an empty string (`""`) for your token.

    #### Bucket name syntax
    When querying or writing to InfluxDB 1.x with Flux, use the
    `database-name/retention-policy-name` pattern to specify your bucket.

    ##### example-task.flux
    {{< keep-url >}}
    ```js
    option task = {
      name: "example-task-name",
      every: 1h,
      offset: 10m
    }

    host = "http://localhost:8086"
    token = ""

    from(bucket: "example-db/example-rp", host: host, token: token)
      |> range(start: -task.every)
      |> filter(fn: (r) => r._measurement == "example-measurement")
      |> aggregateWindow(every: 10m, fn: mean)
      |> to(bucket: "example-db/example-rp-downsampled", host: host, token: token)
    ```

2. Use the `kapacitor flux task create` command to add your Flux script as a Kapacitor Flux task.

    ```sh
    kapacitor flux task create --file /path/to/example-task.flux
    ```

_For more details about creating Kapacitor Flux tasks, see [Create a Kapacitor Flux task](/kapacitor/v1.6/working/flux/manage/create/)._
{{% /tab-content %}}
<!-------------------------- END InfluxDB 1.x content ------------------------->
<!---------------------- BEGIN InfluxDB Cloud/2.x content --------------------->
{{% tab-content %}}
{{% warn %}}
#### Consider using InfluxDB tasks
If you're using **InfluxDB Cloud** or **InfluxDB OSS 2.x**, consider using
[native InfluxDB tasks](/influxdb/cloud/process-data/) for data processing.
{{% /warn %}}

1. [Set up Kapacitor for InfluxDB Cloud or 2.x](#set-up-kapacitor-for-influxdb-cloud-or-2x)
2. [Configure Kapacitor Flux tasks for InfluxDB Cloud or 2.x](#configure-kapacitor-flux-tasks-for-influxdb-cloud-or-2x)
3. [Create a Flux task](#create-a-flux-task-v2)

## Set up Kapacitor for InfluxDB Cloud or 2.x
Configure Kapacitor to connect to InfluxDB Cloud or InfluxDB OSS 2.x.
For detailed instructions, see the following:

- [Use Kapacitor with InfluxDB Cloud](/influxdb/cloud/tools/kapacitor/)
- [Use Kapacitor with InfluxDB 2.x OSS](/{{< latest "influxdb" >}}/tools/kapacitor/)

## Configure Kapacitor Flux tasks for InfluxDB Cloud or 2.x
Update or add the following settings under `[fluxtask]` your `kapacitor.conf`:

- **enabled**: `true`
- **task-run-influxdb**: Name of the [InfluxDB configuration in your `kapacitor.conf`](/kapacitor/v1.6/administration/configuration/#influxdb)
  to use to store Flux task data.
  _To disable Flux task logging, set to `"none"`._
- **task-run-bucket**: InfluxDB bucket to store Flux task data and logs in. We recommend leaving this empty. By default, data is written to the `kapacitor_fluxtask_logs` bucket. To specify another bucket to write task log data to, use the [_tasks system bucket](/influxdb/cloud/reference/internals/system-buckets/#_tasks-system-bucket) or [create a new bucket](/influxdb/cloud/organizations/buckets/create-bucket/). If the specified bucket does not already exist in InfluxDB, Kapacitor attempts to create it with [`POST /api/v2/buckets`](/influxdb/v2.0/api/#operation/PostBuckets), in which case your API token must have permissions to create buckets in InfluxDB. For more information, see [Manage API tokens](/influxdb/v2.0/security/tokens/).
- Provide one of the following:
    - **task-run-org**: InfluxDB organization name.
    - **task-run-orgid**: InfluxDB organization ID.
- **task-run-measurement**: InfluxDB measurement to store task run and log data in.
  Default is `"runs"`.

```toml
# ...

[fluxtask]
  enabled = true
  task-run-influxdb = "InfluxDB"
  task-run-bucket = "_tasks"
  task-run-org = "example-org"
  task-run-measurement = "runs"

# ...
```

## Create a Flux task{id="create-a-flux-task-v2"}

1.  Create a Flux task script. Include [the task option](/influxdb/v2.0/process-data/task-options/)
    in your script to configure the Kapacitor Flux task. _For more information about writing Flux tasks, see:_
     
    - [Get started with Flux tasks](/{{< latest "influxdb" >}}/process-data/get-started/)
    - [Common data processing tasks](/{{< latest "influxdb" >}}/process-data/common-tasks/)

    #### Provide InfluxDB connection credentials
    `from()`](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/from/) and
    [`to()`](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/to/) functions
    require your InfluxDB **host** and **token**.

    - **host:** InfluxDB URL.
    - **token:** If **[InfluxDB authentication is enabled](/{{< latest "influxdb" "v1" >}}/administration/authentication_and_authorization)**,
      use the `username:password` syntax.
      Otherwise, use an empty string (`""`) for your token.

    ##### example-task.flux
    {{< keep-url >}}
    ```js
    option task = {
      name: "example-task-name",
      every: 1h,
      offset: 10m
    }

    host = "http://localhost:8086"
    token = ""

    from(bucket: "example-bucket", host: host, token: token)
      |> range(start: -task.every)
      |> filter(fn: (r) => r._measurement == "example-measurement")
      |> aggregateWindow(every: 10m, fn: mean)
      |> to(bucket: "example-bucket-downsampled", host: host, token: token)
    ```

2. Use the `kapacitor flux task create` command to add your Flux script as a Kapacitor Flux task.

    ```sh
    kapacitor flux task create --file /path/to/example-task.flux
    ```

_For more details about creating Kapacitor Flux tasks, see [Create a Kapacitor Flux task](/kapacitor/v1.6/working/flux/manage/create/)._
{{% /tab-content %}}
<!----------------------- END InfluxDB Cloud/2.x content ---------------------->
{{< /tabs-wrapper >}}
