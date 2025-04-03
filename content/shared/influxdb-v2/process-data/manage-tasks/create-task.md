
Create tasks with the InfluxDB user interface (UI), `influx` command line interface (CLI), or `/api/v2` API.

_Before creating a task, review the [basics for writing a task](/influxdb/version/process-data/get-started)._

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

1. In the navigation menu on the left, select **Data Explorer**.

    {{< nav-icon "data-explorer" >}}

2. Build a query and click **Save As** in the upper right.
3. Select the **{{< caps >}}Task{{< /caps >}}** heading.
4. Specify the task options. See [Task options](/influxdb/version/process-data/task-options)
   for detailed information about each option.
5. Click **{{< caps >}}Save as Task{{< /caps >}}**.

### Create a task in the Task UI

1. In the navigation menu on the left, select **Tasks**.

    {{< nav-icon "tasks" >}}

2. Click **{{< caps >}}{{< icon "plus" >}} Create Task{{< /caps >}}** in the upper right.
3. In the left panel, specify the task options.
   See [Task options](/influxdb/version/process-data/task-options) for detailed information about each option.
4. In the right panel, enter your task script.

    {{% note %}}

##### Leave out the option tasks assignment

When creating a _new_ task in the InfluxDB Task UI, leave the code editor empty.
When you save the task, the Task UI uses the [task options](/influxdb/version/process-data/task-options/) you specify in the **Task options** form to populate `option task = {task_options}` for you.

When you edit the saved task, you'll see the injected `option task = {task_options}`.
    {{% /note %}}

7. Click **Save** in the upper right.

### Import a task

1. In the navigation menu on the left, select **Tasks**.

    {{< nav-icon "tasks" >}}

2. Click **{{< caps >}}{{< icon "plus" >}} Create Task{{< /caps >}}** in the upper right.
3. In the left panel, specify the task options.
   See [Task options](/influxdb/version/process-data/task-options) for detailed information about each option.
4. Paste a raw Flux task in the code editor to the right of the task options fields.
5. Click **{{< caps >}}Save{{< /caps >}}** in the upper right.

### Create a task from a template

1. In the navigation menu on the left, select **Settings** > **Templates**.

    {{< nav-icon "Settings" >}}

2. Find the template you want to use and click its **Resources** list to expand the list of resources.
3. In the **Resources** list, click the task you want to use.

### Clone a task

1. In the navigation menu on the left, select **Tasks**.

    {{< nav-icon "tasks" >}}

2. Find the task you would like to clone and click the **{{< icon "settings" >}}** icon located far right of the task name.
3. Click **Clone**.

## Create a task using the influx CLI

Use the `influx task create` command to create a new task.
It accepts either a file path or raw Flux.

### Create a task using a file

```sh
# Syntax
influx task create --org <org-name>  -f </path/to/task-script>

# Example
influx task create --org my-org -f /tasks/cq-mean-1h.flux
```

### Create a task using raw Flux

```sh
influx task create --org my-org - # <return> to open stdin pipe

option task = {
  name: "task-name",
  every: 6h
}

# ... Task script ...

# Linux & macOS: <ctrl-d> to close the pipe and submit the command
# Windows: <enter>, then <ctrl-d>, then <enter> to close the pipe and submit the command
```

## Create a task using the InfluxDB API

{{% show-in "v2" %}}

Use the [`/api/v2/tasks` InfluxDB API endpoint](/influxdb/version/api/#operation/PostTasks) to create a task.

{{< api-endpoint method="POST" endpoint="http://localhost:8086/api/v2/tasks/" api-ref="/influxdb/version/api/#operation/PostTasks" >}}

Provide the following in your API request:
##### Request headers

- **Content-Type**: application/json
- **Authorization**: Token *`INFLUX_API_TOKEN`*

##### Request body

JSON object with the following fields:

- **flux**: raw Flux task string that contains a [`task` option](/flux/v0/spec/options/) and a query.
- **orgID**: your [InfluxDB organization ID](/influxdb/version/admin/organizations/view-orgs/#view-your-organization-id)
- **status**: task status ("active" or "inactive")
- **description**: task description

```sh
curl --request POST 'http://localhost:8086/api/v2/tasks' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Token INFLUX_API_TOKEN' \
  --data-raw '{
    "flux": "option task = {name: \"CPU Total 1 Hour New\", every: 1h}\n\nfrom(bucket: \"telegraf\")\n\t|> range(start: -1h)\n\t|> filter(fn: (r) =>\n\t\t(r._measurement == \"cpu\"))\n\t|> filter(fn: (r) =>\n\t\t(r._field == \"usage_system\"))\n\t|> filter(fn: (r) =>\n\t\t(r.cpu == \"cpu-total\"))\n\t|> aggregateWindow(every: 1h, fn: max)\n\t|> to(bucket: \"cpu_usage_user_total_1h\", org: \"INFLUX_ORG\")",
    "orgID": "INFLUX_ORG_ID",
    "status": "active",
    "description": "This task downsamples CPU data every hour"
}'
```

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

An InfluxDB Cloud task can run either an [invokable script](/influxdb/cloud/api-guide/api-invokable-scripts/) or raw Flux stored in the task.

- [Create a task that references a script](#create-a-task-that-references-a-script)
- [Create a task that contains a Flux script](#create-a-task-that-contains-a-flux-script)

### Create a task that references a script

With InfluxDB Cloud invokable scripts, you can manage, reuse, and invoke scripts as API endpoints.
You can use tasks to pass script parameters and schedule runs.

Use the [`/api/v2/tasks` InfluxDB API endpoint](/influxdb/cloud/api/#operation/PostTasks) to create a task
that references a script ID.

{{< api-endpoint method="POST" endpoint="http://localhost:8086/api/v2/tasks/" api-ref="/influxdb/cloud/api/#operation/PostTasks" >}}

Provide the following in your API request:

#### Request headers

- **Content-Type**: application/json
- **Authorization**: Token *`INFLUX_API_TOKEN`*

#### Request body

JSON object with the following fields:

- **cron** or **every**: task schedule
- **name**: task name
- **scriptID**: [invokable script](/influxdb/cloud/api-guide/api-invokable-scripts/) ID

```sh
curl --request POST 'https://cloud2.influxdata.com/api/v2/tasks' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Token INFLUX_API_TOKEN' \
    "cron": "0 * * * *",
    "name": "downsample cpu",
    "scriptID": "085a2960eaa20000",
    "description": "This task downsamples CPU data every hour"
}'
```

To create a task that passes parameters when invoking the script, pass the _`scriptParameters`_
property in the request body.
The following sample code creates a script with parameters, and then creates a
task to run the new script daily:

```sh
SCRIPT_ID=$(
curl https://cloud2.influxdata.com/api/v2/scripts \
  --header "Authorization: Token INFLUX_API_TOKEN" \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data-binary @- << EOF | jq -r '.id'
  {
    "name": "filter-and-group19",
    "description": "Returns filtered and grouped points from a bucket.",
    "script": "from(bucket: params.bucket)\
               |> range(start: duration(v: params.rangeStart))\
               |> filter(fn: (r) => r._field == params.filterField)\
               |> group(columns: [params.groupColumn])",
     "language": "flux"
  }
EOF
)

echo $SCRIPT_ID

curl https://cloud2.influxdata.com/api/v2/tasks \
--header "Content-type: application/json" \
--header "Authorization: Token INFLUX_API_TOKEN" \
--data @- << EOF
  {
  "name": "30-day-avg-temp",
  "description": "IoT Center 30d temperature average.",
  "every": "1d",
  "scriptID": "${SCRIPT_ID}",
  "scriptParameters":
    {
      "rangeStart": "-30d",
      "bucket": "air_sensor",
      "filterField": "temperature",
      "groupColumn": "_time"
    }
  }
EOF
```

Replace **`INFLUX_API_TOKEN`** with your InfluxDB API token.

### Create a task that contains a Flux script

Use the [`/api/v2/tasks` InfluxDB API endpoint](/influxdb/cloud/api/#operation/PostTasks) to create a task that contains a Flux script with task options.

{{< api-endpoint method="POST" endpoint="https://cloud2.influxdata.com/api/v2/tasks/" api-ref="/influxdb/cloud/api/#operation/PostTasks" >}}

Provide the following in your API request:

#### Request headers

- **Content-Type**: application/json
- **Authorization**: Token **`INFLUX_API_TOKEN`**

#### Request body

JSON object with the following fields:

- **flux**: raw Flux task string that contains [`options`](/flux/v0/spec/options/) and the query.
- **status**: task status ("active" or "inactive")
- **description**: task description

```sh
curl --request POST 'https://cloud2.influxdata.com/api/v2/tasks' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Token INFLUX_API_TOKEN' \
    --data-binary @- << EOF
      {
        "flux": "option task = {name: \"CPU Total 1 Hour New\", every: 1h}\
        from(bucket: \"telegraf\")
          |> range(start: -1h)
          |> filter(fn: (r) => (r._measurement == \"cpu\"))
          |> filter(fn: (r) =>\n\t\t(r._field == \"usage_system\"))
          |> filter(fn: (r) => (r.cpu == \"cpu-total\"))
          |> aggregateWindow(every: 1h, fn: max)
          |> to(bucket: \"cpu_usage_user_total_1h\", org: \"INFLUX_ORG\")",
        "orgID": "INFLUX_ORG_ID",
        "status": "active",
        "description": "This task downsamples CPU data every hour"
      }
EOF
```

Replace the following:

- **`INFLUX_API_TOKEN`**: your InfluxDB [API token](/influxdb/cloud/admin/tokens/view-tokens/)
- **`INFLUX_ORG`**: your InfluxDB organization name
- **`INFLUX_ORG_ID`**: your InfluxDB organization ID

{{% /show-in %}}
