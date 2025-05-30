
In the UI, you can create two kinds of [checks](/influxdb/version/reference/glossary/#check):
[`threshold`](/influxdb/version/monitor-alert/checks/create/#threshold-check) and
[`deadman`](/influxdb/version/monitor-alert/checks/create/#deadman-check).

Using a Flux task, you can create a custom check that provides a couple advantages:

- Customize and transform the data you would like to use for the check.
- Set up custom criteria for your alert (other than `threshold` and `deadman`).

## Create a task

1. In the InfluxDB UI, select **Tasks** in the navigation menu on the left.

    {{< nav-icon "tasks" >}}

2. Click **{{< caps >}}{{< icon "plus" >}} Create Task{{< /caps >}}**.
3. In the **Name** field, enter a descriptive name,
   and then enter how often to run the task in the **Every** field (for example, `10m`).
   For more detail, such as using cron syntax or including an offset, see [Task configuration options](/influxdb/version/process-data/task-options/).
4. Enter the Flux script for your custom check, including the [`monitor.check`](/flux/v0/stdlib/influxdata/influxdb/monitor/check/) function.

{{% note %}}
Use the [`/api/v2/checks/{checkID}/query` API endpoint](/influxdb/version/api/#operation/DeleteDashboardsIDOwnersID)
to see the Flux code for a check built in the UI.
This can be useful for constructing custom checks.
{{% /note %}}

### Example: Monitor failed tasks

The script below is fairly complex, and can be used as a framework for similar tasks.
It does the following:

- Import the necessary `influxdata/influxdb/monitor` package, and other packages for data processing.
- Query the `_tasks` bucket to retrieve all statuses generated by your check.
- Set the `_level` to alert on, for example, `crit`, `warn`, `info`, or `ok`.
- Create a `check` object that specifies an ID, name, and type for the check.
- Define the `ok` and `crit` statuses.
- Execute the `monitor` function on the `check` using the `task_data`.

#### Example alert task script

```js
import "strings"
import "regexp"
import "influxdata/influxdb/monitor"
import "influxdata/influxdb/schema"

option task = {name: "Failed Tasks Check", every: 1h, offset: 4m}

task_data = from(bucket: "_tasks")
    |> range(start: -task.every)
    |> filter(fn: (r) => r["_measurement"] == "runs")
    |> filter(fn: (r) => r["_field"] == "logs")
    |> map(fn: (r) => ({r with name: strings.split(v: regexp.findString(r: /option task = \{([^\}]+)/, v: r._value), t: "\\\\\\\"")[1]}))
    |> drop(columns: ["_value", "_start", "_stop"])
    |> group(columns: ["name", "taskID", "status", "_measurement"])
    |> map(fn: (r) => ({r with _value: if r.status == "failed" then 1 else 0}))
    |> last()

check = {
    // 16 characters, alphanumeric
    _check_id: "0000000000000001",
    // Name string
    _check_name: "Failed Tasks Check",
    // Check type (threshold, deadman, or custom)
    _type: "custom",
    tags: {},
}
ok = (r) => r["logs"] == 0
crit = (r) => r["logs"] == 1
messageFn = (r) => "The task: ${r.taskID} - ${r.name} has a status of ${r.status}"

task_data
    |> schema["fieldsAsCols"]()
    |> monitor["check"](data: check, messageFn: messageFn, ok: ok, crit: crit)
```

{{% note %}}
Creating a custom check does not send a notification email.
For information on how to create notification emails, see
[Create notification endpoints](/influxdb/version/monitor-alert/notification-endpoints/create),
[Create notification rules](/influxdb/version/monitor-alert/notification-rules/create),
and [Send alert email](/influxdb/version/monitor-alert/send-email/)
{{% /note %}}
