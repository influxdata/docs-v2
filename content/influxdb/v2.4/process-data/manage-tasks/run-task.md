---
title: Run a task
seotitle: Run an InfluxDB task
description: >
  Run a data processing task using the InfluxDB UI or the `influx` CLI.
menu:
  influxdb_2_4:
    name: Run a task
    parent: Manage tasks
weight: 203
related:
  - /influxdb/v2.4/reference/cli/influx/task/run
  - /influxdb/v2.4/reference/cli/influx/task/run/retry
  - /influxdb/v2.4/reference/cli/influx/task/retry-failed
  - /influxdb/v2.4/api/#operation/PostTasksIDRuns
  - /influxdb/v2.4/api/#operation/PostTasksIDRunsIDRetry
---

InfluxDB data processing tasks generally run in defined intervals or at a specific time,
however, you can manually run a task from the InfluxDB user interface (UI),
the `influx` command line interface (CLI),
or the InfluxDB `/api/v2` API.

## Run a task from the InfluxDB UI
1. In the navigation menu on the left, select **Tasks**.

    {{< nav-icon "tasks" >}}

2. Hover over the task you want to run and click the **{{< icon "gear" >}}** icon.
3. Select **Run Task**.

## Run a task with the influx CLI
Use the `influx task run retry` command to run a task.

{{% note %}}
To run a task from the `influx` CLI, the task must have already run at least once.
{{% /note %}}

{{< cli/influx-creds-note >}}

```sh
# List all tasks to find the ID of the task to run
influx task list

# Use the task ID to list previous runs of the task
influx task run list --task-id=0000000000000000

# Use the task ID and run ID to retry a run
influx task run retry --task-id=0000000000000000 --run-id=0000000000000000
```

### Retry failed task runs
Use the [`influx task retry-failed` command](/influxdb/v2.4/reference/cli/influx/task/retry-failed/)
to retry failed task runs.

```sh
# Retry failed tasks for a specific task
influx task retry-failed \
  --id 0000000000000000

# Print information about runs that will be retried
influx task retry-failed \
  --dry-run

# Retry failed task runs that occurred in a specific time range
influx task retry-failed \
  --after 2021-01-01T00:00:00Z \
  --before 2021-01-01T23:59:59Z
```

## Run a task with the InfluxDB API
Use the [`/tasks/TASK_ID/runs`
InfluxDB API endpoint](/influxdb/v2.4/api/#operation/PostTasksIDRuns) to manually start a task run.

{{< api-endpoint method="POST" endpoint="http://localhost:8086/api/v2/tasks/TASK_ID/runs" >}}

### Retry failed task runs
Use the [`/tasks/TASK_ID/runs/RUN_ID/retry`
InfluxDB API endpoint](/influxdb/v2.4/api/#operation/PostTasksIDRunsIDRetry) to retry a task run.

{{< api-endpoint method="POST" endpoint="http://localhost:8086/api/v2/tasks/TASK_ID/runs/RUN_ID/retry" >}}
