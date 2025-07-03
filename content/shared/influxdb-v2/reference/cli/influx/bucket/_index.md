
The `influx bucket` command and its subcommands manage buckets in InfluxDB.

## Usage
```
influx bucket [flags]
influx bucket [command]
```

## Subcommands
| Subcommand                                                  | Description   |
|:----------                                                  |:-----------   |
| [create](/influxdb/version/reference/cli/influx/bucket/create) | Create bucket |
| [delete](/influxdb/version/reference/cli/influx/bucket/delete) | Delete bucket |
| [list](/influxdb/version/reference/cli/influx/bucket/list)     | List buckets  |
| [update](/influxdb/version/reference/cli/influx/bucket/update) | Update bucket |

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:-----|:------------------|:----------------------------------------------------------------------|:-----------|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `bucket` command                                         |            |                       |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |
