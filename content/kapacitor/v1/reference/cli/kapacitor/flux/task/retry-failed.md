---
title: kapacitor flux task retry-failed
description: >
  The `kapacitor flux task retry-failed` command retries failed Kapacitor Flux
  task runs.
menu:
  kapacitor_v1:
    name: kapacitor flux task retry-failed
    parent: kapacitor flux task
weight: 301
related:
  - /kapacitor/v1/working/flux/manage/retry-failed/
---

The `kapacitor flux task retry-failed` command retries failed Kapacitor Flux
task runs.

## Usage

```sh
kapacitor flux task retry-failed [flags]
```

#### Aliases

- `rtf`

## Flags

| Flag |                | Description                                                                          |
| :--- | :------------- | :----------------------------------------------------------------------------------- |
|      | `--after`      | Retry failed runs that occurred after this time _(RFC3339 timestamp)_                |
|      | `--before`     | Retry failed runs that occurred before this time _(RFC3339 timestamp)_               |
|      | `--dry-run`    | Output information about runs that would be retried without retrying the failed runs |
| `-h` | `--help`       | Show command help                                                                    |
| `-i` | `--id`         | Flux task ID                                                                         |
|      | `--json`       | Output data as JSON                                                                  |
|      | `--run-limit`  | Maximum number of failed runs to retry per task _(default is 100)_                   |
|      | `--task-limit` | Maximum number of tasks to retry failed runs for _(default is 100)_                  |

## Examples

- [Retry failed Flux task runs for all tasks](#retry-failed-flux-task-runs-for-all-tasks)
- [Retry failed Flux task runs for a specific task](#retry-failed-flux-task-runs-for-a-specific-task)
- [Retry Flux task runs that failed in a specific time range](#retry-flux-task-runs-that-failed-in-a-specific-time-range)
- [View information about failed runs that would be executed](#view-information-about-failed-runs-that-would-be-executed)
- [Limit the number of tasks to retry failed runs for](#limit-the-number-of-tasks-to-retry-failed-runs-for)
- [Limit the number of failed runs to retry for each task](#limit-the-number-of-failed-runs-to-retry-for-each-task)

### Retry failed Flux task runs for all tasks

```sh
kapacitor flux task retry-failed
```

### Retry failed Flux task runs for a specific task

```sh
kapacitor flux task retry-failed --id 000x00xX0xXXx00
```

### Retry Flux task runs that failed in a specific time range

```sh
kapacitor flux task retry-failed \
  --after 2023-01-01T00:00:00Z \
  --before 2023-01-31T00:00:00Z
```

### View information about failed runs that would be executed

```sh
kapacitor flux task retry-failed --dry-run
```

### Limit the number of tasks to retry failed runs for

```sh
kapacitor flux task retry-failed --task-limit 10
```

### Limit the number of failed runs to retry for each task

```sh
kapacitor flux task retry-failed --run-limit 10
```
