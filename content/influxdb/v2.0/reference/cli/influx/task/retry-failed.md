---
title: influx task retry-failed
description: The `influx task retry-failed` command retries failed InfluxDB a task runs.
menu:
  influxdb_2_0_ref:
    name: influx task retry-failed
    parent: influx task
weight: 201
---

The `influx task retry-failed` command retries failed InfluxDB a task runs.

## Usage
```
influx task retry-failed [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---               |:-----------                                                           |:----------: |:------------------    |
|      | `--after`         | Retry task runs that occurred after this time (RFC3339 timestamp)     | string      |                       |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string      |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
|      | `--before`        | Retry task runs that occurred before this time (RFC3339 timestamp)    | string      |                       |
|      | `--dry-run`       | Print information about runs that would be retried                    |             |                       |
| `-h` | `--help`          | Help for the `list` command                                           |             |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string      | `INFLUX_HOST`         |
| `-i` | `--id`            | Task ID                                                               | string      |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |             | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`           | Task organization name                                                | string      | `INFLUX_ORG`          |
|      | `--org-id`        | Task organization ID                                                  | string      | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |             |                       |
| `-t` | `--token`         | Authentication token                                                  | string      | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

- [Retry failed tasks](#retry-failed-tasks)
- [Retry failed tasks that occurred before a specific time](#retry-failed-tasks-that-occurred-before-a-specific-time)
- [Retry failed tasks that occurred after a specific time](#retry-failed-tasks-that-occurred-after-a-specific-time)
- [Retry failed tasks that occurred in a specific time range](#retry-failed-tasks-that-occurred-in-a-specific-time-range)

##### Retry failed tasks
```sh
influx task retry-failed
```

##### Retry failed tasks that occurred before a specific time
```sh
influx task retry-failed --before 2021-01-01T00:00:00Z
```

##### Retry failed tasks that occurred after a specific time
```sh
influx task retry-failed --after 2021-01-01T00:00:00Z
```

##### Retry failed tasks that occurred in a specific time range
```sh
influx task retry-failed \
  --after 2021-01-01T00:00:00Z \
  --before 2021-01-01T23:59:59Z
```
