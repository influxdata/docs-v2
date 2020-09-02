---
title: View task run history and logs
description: >
  View task run histories and logs using the InfluxDB UI or the `influx` CLI.
menu:
  influxdb_2_0:
    name: View run history
    parent: Manage tasks
weight: 203
related:
  - /influxdb/v2.0/reference/cli/influx/task/run/find
---

When an InfluxDB task runs, a "run" record is created in the task's history.
Logs associated with each run provide relevant log messages, timestamps,
and the exit status of the run attempt.

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to view task run histories and associated logs.

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
