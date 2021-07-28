---
title: influx task retry-failed
description: The `influx task retry-failed` command retries failed InfluxDB task runs.
menu:
  influxdb_2_0_ref:
    name: influx task retry-failed
    parent: influx task
weight: 201
---

The `influx task retry-failed` command retries failed InfluxDB task runs.
## Usage
```
influx task retry-failed [flags]
```

## Flags
| Flag |                   | Description                                                               | Input type  | {{< cli/mapped >}}    |
|:---- |:---               |:-----------                                                               |:----------: |:------------------    |
|      | `--after`         | Retry task runs that occurred after this time (RFC3339 timestamp)         | string      |                       |
| `-c` | `--active-config` | CLI configuration to use for command                                      | string      |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)     | string      |`INFLUX_CONFIGS_PATH`  |
|      | `--before`        | Retry task runs that occurred before this time (RFC3339 timestamp)        | string      |                       |
|      | `--dry-run`       | Print information about task runs that would be retried                        |             |                       |
| `-h` | `--help`          | Help for the `list` command                                               |             |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                      |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)                | string      | `INFLUX_HOST`         |
| `-i` | `--id`            | Task ID                                                                   | string      |                       |
|      | `--json`          | Output data as JSON (default `false`)                                     |             | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`           | Task organization name                                                    | string      | `INFLUX_ORG`          |
|      | `--org-id`        | Task organization ID                                                      | string      | `INFLUX_ORG_ID`       |
|      | `--run-limit`     | Maximum number of failed runs to retry per task (`1-500`, default `100`)  | integer     |                       |
|      | `--skip-verify`   | Skip TLS certificate verification                                         |             |                       |
|      | `--task-limit`    | Maximum number of tasks to retry failed runs for (`1-500`, default `100`) | integer     |                       |
| `-t` | `--token`         | API token                                                      | string      | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

- [Retry failed task runs for a specific task ID](#retry-failed-task-runs-for-a-specific-task-id)
- [Retry failed task runs that occurred before a specific time](#retry-failed-task-runs-that-occurred-before-a-specific-time)
- [Retry failed task runs that occurred after a specific time](#retry-failed-task-runs-that-occurred-after-a-specific-time)
- [Retry failed task runs that occurred in a specific time range](#retry-failed-task-runs-that-occurred-in-a-specific-time-range)
- [Retry failed runs for a limited number of tasks](#retry-failed-runs-for-a-limited-number-of-tasks)
- [Retry a limited number of failed runs for a task](#retry-a-limited-number-of-failed-runs-for-a-task)
- [Print information about runs that will be retried](#print-information-about-runs-that-will-be-retried)

##### Retry failed task runs for a specific task ID
```sh
influx task retry-failed \
  --id 0Xx0oox00XXoxxoo1
```

##### Retry failed task runs that occurred before a specific time
```sh
influx task retry-failed \
  --before 2021-01-01T00:00:00Z
```

##### Retry failed task runs that occurred after a specific time
```sh
influx task retry-failed \
  --after 2021-01-01T00:00:00Z
```

##### Retry failed task runs that occurred in a specific time range
```sh
influx task retry-failed \
  --after 2021-01-01T00:00:00Z \
  --before 2021-01-01T23:59:59Z
```

##### Retry failed runs for a limited number of tasks
```sh
influx task retry-failed \
  --task-limit 5
```

##### Retry a limited number of failed runs for a task
```sh
influx task retry-failed \
  --id 0Xx0oox00XXoxxoo1 \
  --run-limit 5
```

##### Print information about runs that will be retried
```sh
influx task retry-failed \
  --dry-run
```
