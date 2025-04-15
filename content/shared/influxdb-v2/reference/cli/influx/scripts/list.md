
The `influx scripts list` command lists and searches for invokable scripts in InfluxDB.

## Usage
```
influx scripts list [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :---------------- | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-c` | `--active-config` | CLI configuration to use for command                                  |   string   |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `list` command                                           |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            |   string   | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers                           |   string   |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-l` | `--limit`         | Number of scripts to return (default `0`)                             |  integer   |                       |
| `-o` | `--offset`        | Pagination offset (default `0`)                                       |  integer   |                       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`         | API token                                                             |   string   | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

- [List all invokable scripts](#list-all-invokable-scripts)
- [Limit the number of invokable scripts returned to 20](#limit-the-number-of-invokable-scripts-returned-to-20)

##### List all invokable scripts
```sh
influx scripts list
```

##### Limit the number of invokable scripts returned to 20
```sh
influx scripts list --limit 20
```
