---
title: View task run history and logs
description: >
  View task run histories and logs using the InfluxDB UI or the `influx` CLI.
menu:
  influxdb_2_4:
    name: View run history
    parent: Manage tasks
weight: 203
related:
  - /influxdb/v2.4/reference/cli/influx/task/list
  - /influxdb/v2.4/reference/cli/influx/task/run/list
  - /influxdb/v2.4/reference/cli/influx/task/retry-failed
---

When an InfluxDB task runs, a _run_ record is created in the task's history.
Logs associated with each run provide relevant log messages, timestamps,
and the exit status of the run attempt.

Use the InfluxDB user interface (UI), the `influx` command line interface (CLI),
or the InfluxDB `/api/v2` API to view task run histories and associated logs.

{{% warn %}}
InfluxDB doesn’t guarantee that a task will run at the scheduled time. During busy
periods, tasks are added to the run queue and processed in order of submission.
The scheduled start time and actual start time can be viewed in the logs under
`scheduledFor` and `startedAt`.

Task execution time doesn't affect the time range queried. Tasks will query
over the set time range as if executed on schedule regardless of delay.
{{% /warn %}}

## View a task's run history in the InfluxDB UI

1. In the navigation menu on the left, select **Tasks**.

    {{< nav-icon "tasks" >}}

2. Hover over the task you want to run and click the **{{< icon "gear" >}}** icon.
3. Select **View Task Runs**.

### View task run logs

To view logs associated with a run, click **View Logs** next to the run in the task's run history.

## View a task's run history with the influx CLI

Use the `influx task run list` command to view a task's run history.

```sh
# List all tasks to find the ID of the task to run
influx task list

# Use the task ID to view the run history of a task
influx task run list --task-id=0000000000000000
```

{{% note %}}
Detailed run logs are not currently available in the `influx` CLI.
{{% /note %}}

To retry failed task runs, see how to [run tasks](/influxdb/v2.4/process-data/manage-tasks/run-task/).

## View logs for a task with the InfluxDB API

Use the [`/api/v2/tasks/TASK_ID/logs`
InfluxDB API endpoint](/influxdb/v2.4/api/#operation/GetTasksIDLogs) to view the log events for a task and exclude additional task metadata.

{{< api-endpoint method="GET" endpoint="http://localhost:8086/api/v2/tasks/TASK_ID/logs" >}}

## View a task's run history with the InfluxDB API

Use the [`/tasks/TASK_ID/runs`
InfluxDB API endpoint](/influxdb/v2.4/api/#operation/GetTasksIDRuns) to view a task's run history.

{{< api-endpoint method="GET" endpoint="http://localhost:8086/api/v2/tasks/{taskID}/runs" >}}

### View task run logs with the InfluxDB API

To view logs associated with a run, use the
[`/api/v2/tasks/TASK_ID/runs/RUN_ID/logs` InfluxDB API
endpoint](/influxdb/v2.4/api/#operation/GetTasksIDRunsIDLogs).

{{< api-endpoint method="GET" endpoint="http://localhost:8086/api/v2/tasks/TASK_ID/runs/RUN_ID/logs" >}}

To retry failed task runs, see how to [run tasks](/influxdb/v2.4/process-data/manage-tasks/run-task/).
