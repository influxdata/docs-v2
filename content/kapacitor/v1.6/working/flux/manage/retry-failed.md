---
title: Retry failed Kapacitor Flux tasks
description: >
  Use the `kapacitor flux task retry-failed` command to retry failed Kapacitor Flux task runs.
menu:
  kapacitor_1_6:
    name: Retry failed Flux tasks
    parent: Manage Flux tasks
weight: 5
related:
  - /kapacitor/v1.6/working/flux/
  - /kapacitor/v1.6/working/flux/manage/task/runs
---

Use the `kapacitor flux task retry-failed` command to retry failed Kapacitor Flux task runs.
Provide the following flags:

- `-i`, `--id`: task ID
- `--before`: Retry failed runs that occurred before this time (RFC3339 timestamp)
- `--after`: Retry failed runs that occurred after this time (RFC3339 timestamp)
- `--dry-run`: Output information about runs that would be retried **without retrying the failed runs**.
- `--task-limit`: Limit the number of tasks to retry failed runs for (default: 100)
- `--run-limit`: Limit the number of failed runs to retry per task (default: 100)

{{% note %}}
#### Rerun failed tasks with the Kapacitor API
The `kapacitor flux task retry-failed` command is a convenience command that identifies
failed task runs and attempts to run them again.
The Kapacitor API doesn't provide a single endpoint for this functionality,
but this process can be accomplished through a series of API calls.
For more information, see [Manage Flux task runs](/kapacitor/v1.6/working/flux/manage/task-runs/?t=API).
{{% /note %}}

## Examples

- [Retry failed Flux task runs for all tasks](#retry-failed-flux-task-runs-for-all-tasks)
- [Retry failed Flux task runs for a specific task](#retry-failed-flux-task-runs-for-a-specific-task)
- [Retry Flux task runs that failed in a specific time range](#retry-flux-task-runs-that-failed-in-a-specific-time-range)
- [View information about failed runs that would be executed](#view-information-about-failed-runs-that-would-be-executed)
- [Limit the number of tasks to retry failed runs for](#limit-the-number-of-tasks-to-retry-failed-runs-for)
- [Limit the number of failed runs to retry for each task](#limit-the-number-of-failed-runs-to-retry-for-each-task)

##### Retry failed Flux task runs for all tasks
```sh
kapacitor flux task retry-failed
```

##### Retry failed Flux task runs for a specific task
```sh
kapacitor flux task retry-failed --id 000x00xX0xXXx00
```

##### Retry Flux task runs that failed in a specific time range
```sh
kapacitor flux task retry-failed \
  --after 2021-01-01T00:00:00Z \
  --before 2021-01-31T00:00:00Z
```

##### View information about failed runs that would be executed
```sh
kapacitor flux task retry-failed --dry-run
```

##### Limit the number of tasks to retry failed runs for
```sh
kapacitor flux task retry-failed --task-limit 10
```

##### Limit the number of failed runs to retry for each task
```sh
kapacitor flux task retry-failed --run-limit 10
```