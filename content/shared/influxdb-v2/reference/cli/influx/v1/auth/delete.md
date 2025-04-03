
The `influx v1 auth delete` command deletes an authorization in the
[InfluxDB 1.x compatibility API](/influxdb/version/reference/api/influxdb-1x/).

## Usage
```
influx v1 auth delete [flags]
```

## Flags
| Flag |                   | Description                                                              | Input type | {{< cli/mapped >}}     |
| :--- | :---------------- | :----------------------------------------------------------------------- | :--------: | :--------------------- |
| `-c` | `--active-config` | Config name to use for command                                           |   string   | `INFLUX_ACTIVE_CONFIG` |
|      | `--configs-path`  | Path to the influx CLI configurations (default: `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`          | Help for the `delete` command                                            |            |                        |
|      | `--hide-headers`  | Hide the table headers (default: `false`)                                |            | `INFLUX_HIDE_HEADERS`  |
|      | `--host`          | HTTP address of InfluxDB                                                 |   string   | `INFLUX_HOST`          |
| `-i` | `--id`            | ({{< req >}}) Authorization ID                                           |   string   |                        |
|      | `--json`          | Output data as JSON (default: `false`)                                   |            | `INFLUX_OUTPUT_JSON`   |
|      | `--skip-verify`   | Skip TLS certificate verification                                        |            | `INFLUX_SKIP_VERIFY`   |
| `-t` | `--token`         | API token                                                                |   string   | `INFLUX_TOKEN`         |
|      | `--username`      | Authorization username                                                   |   string   | `INFLUX_USERNAME`      |

## Examples

{{< cli/influx-creds-note >}}

##### Delete a v1 authorization
```sh
influx v1 auth delete --id 00xX00o0X001
```
