---
title: Create a task
seotitle: Create a task for processing data in InfluxDB
description: >
  Create a data processing task in InfluxDB using the InfluxDB UI or the `influx` CLI.
menu:
  influxdb_2_1:
    name: Create a task
    parent: Manage tasks
weight: 201
related:
  - /influxdb/v2.1/reference/cli/influx/task/create
---

InfluxDB provides multiple ways to create tasks both in the InfluxDB user interface (UI)
and the `influx` command line interface (CLI).

_Before creating a task, review the [basics criteria for writing a task](/influxdb/v2.1/process-data/get-started)._

- [InfluxDB UI](#create-a-task-in-the-influxdb-ui)
- [`influx` CLI](#create-a-task-using-the-influx-cli)
- [InfluxDB API](#create-a-task-using-the-influxdb-api)

## Create a task in the InfluxDB UI
The InfluxDB UI provides multiple ways to create a task:

- [Create a task from the Data Explorer](#create-a-task-from-the-data-explorer)
- [Create a task in the Task UI](#create-a-task-in-the-task-ui)
- [Import a task](#import-a-task)
- [Create a task from a template](#create-a-task-from-a-template)
- [Clone a task](#clone-a-task)

### Create a task from the Data Explorer
1. In the navigation menu on the left, select **Explore** (**Data Explorer**).

    {{< nav-icon "data-explorer" >}}

2. Build a query and click **Save As** in the upper right.
3. Select the **Task** option.
4. Specify the task options. See [Task options](/influxdb/v2.1/process-data/task-options)
   for detailed information about each option.
5. Select a token to use from the **Token** dropdown.
6. Click **Save as Task**.


### Create a task in the Task UI
1. In the navigation menu on the left, select **Tasks**.

    {{< nav-icon "tasks" >}}

2. Click **{{< icon "plus" >}} Create Task** in the upper right.
3. Select **New Task**.
4. In the left panel, specify the task options.
   See [Task options](/influxdb/v2.1/process-data/task-options) for detailed information about each option.
5. Select a token to use from the **Token** dropdown.
6. In the right panel, enter your task script.

    {{% note %}}
##### Leave out the option tasks assignment
When creating a _new_ task in the InfluxDB Task UI, leave out the `option task`
assignment that defines [task options](/influxdb/v2.1/process-data/task-options/).
The InfluxDB UI injects this code using settings specified in the **Task options**
fields in the left panel when you save the task.
    {{% /note %}}

7. Click **Save** in the upper right.

### Import a task
1. In the navigation menu on the left, select **Tasks**.

    {{< nav-icon "tasks" >}}

2. Click **+ Create Task** in the upper right.
3. Select **Import Task**.
4. Upload a JSON task file using one of the following options:
    - Drag and drop a JSON task file in the specified area.
    - Click to upload and the area to select the JSON task from from your file manager.
    - Select the **JSON** option and paste in raw task JSON.
5. Click **Import JSON as Task**.

### Create a task from a template
1. In the navigation menu on the left, select **Settings** > **Templates**.

    {{< nav-icon "Settings" >}}

2. Select **Templates**.
3. Hover over the template to use to create the task and click **Create**.


### Clone a task
1. In the navigation menu on the left, select **Tasks**.

    {{< nav-icon "tasks" >}}

2. Hover over the task you would like to clone and click the **{{< icon "duplicate" >}}** icon that appears.
4. Click **Clone**.

## Create a task using the influx CLI
Use `influx task create` command to create a new task.
It accepts either a file path or raw Flux.

###### Create a task using a file
```sh
# Syntax
influx task create --org <org-name>  -f </path/to/task-script>

# Example
influx task create --org my-org -f /tasks/cq-mean-1h.flux
```

###### Create a task using raw Flux
```sh
influx task create --org my-org - # <return> to open stdin pipe

option task = {
  name: "task-name",
  every: 6h
}

# ... Task script ...

# <ctrl-d> to close the pipe and submit the command
```

## Create a task using the InfluxDB API

Send a request using the **POST** method to the `/api/v2/tasks` InfluxDB API endpoint.
Provide the following in your API request:

##### Request headers
- **Content-Type**: application/json
- **Authorization**: Token _YOURINFLUXDBTOKEN_**

##### Request body
JSON object with the following fields:

- **flux** : raw Flux task string
- **orgID**: your [InfluxDB organization ID](/influxdb/v2.1/organizations/view-orgs/#view-your-organization-id)
- **status**: task status ("active" or "inactive")
- **description**: task description

```sh
curl --request POST 'https://us-west-2-1.aws.cloud2.influxdata.com/api/v2/tasks' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Token <YOURTOKEN>' \
  --data-raw '{
    "flux": "option task = {name: \"CPU Total 1 Hour New\", every: 1h}\n\nfrom(bucket: \"telegraf\")\n\t|> range(start: -1h)\n\t|> filter(fn: (r) =>\n\t\t(r._measurement == \"cpu\"))\n\t|> filter(fn: (r) =>\n\t\t(r._field == \"usage_system\"))\n\t|> filter(fn: (r) =>\n\t\t(r.cpu == \"cpu-total\"))\n\t|> aggregateWindow(every: 1h, fn: max)\n\t|> to(bucket: \"cpu_usage_user_total_1h\", org: \"<MYORG>\")",
    "orgID": "<YOURORGID>",
    "status": "active",
    "description": "This task downsamples CPU data every hour"
}'
```
