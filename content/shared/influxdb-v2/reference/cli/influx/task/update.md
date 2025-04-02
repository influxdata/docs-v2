
The `influx task update` command updates information related to tasks in InfluxDB.

## Usage
```
influx task update [task literal] [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:-----|:------------------|:----------------------------------------------------------------------|:----------:|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-f` | `--file`          | Path to Flux script file                                              | string     |                       |
| `-h` | `--help`          | Help for the `update` command                                         |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
| `-i` | `--id`            | ({{< req >}}) Task ID                                                 | string     |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
|      | `--script-id`     | _(InfluxDB Cloud only)_ Invokable script ID to execute                | string     |                       |
|      | `--script-params` | _(InfluxDB Cloud only)_ Invokable script JSON parameters              | string     |                       |
|      | `--status`        | Update task status (`active` or `inactive`)                           | string     |                       |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |

## Example

{{< cli/influx-creds-note >}}

- [Update a task from a Flux string](#update-a-task-from-a-flux-string)
- [Update a task from a Flux file](#update-a-task-from-a-flux-file)
- [Update a task from a script ID](#update-a-task-from-a-script-id)
- [Enable a task](#enable-a-task)
- [Disable a task](#disable-a-task)

##### Update a task from a Flux string
```sh
export UPDATED_FLUX_TASK='
  option task = {
    name: "Example Task",
    every: 1d
  }

  from(bucket: "example-bucket")
    |> range(start: -task.every)
    |> filter(fn: (r) => r._measurement == "m")
    |> aggregateWindow(every: 1h, fn: mean)
    |> to(bucket: "default-ds-1d", org: "my-org")
'

influx task update \
  --id 0001234 \
  $UPDATED_FLUX_TASK
```

##### Update a task from a Flux file
```sh
influx task update \
  --id 0001234 \
  --file /path/to/example-task.flux
```

##### Update a task from a script ID
```sh
influx task update \
  --id 0001234 \
  --script-id 0004567
```

##### Enable a task
```sh
influx task update \
  --id 0001234 \
  --status active
```

##### Disable a task
```sh
influx task update \
  --id 0001234 \
  --status inactive
```
