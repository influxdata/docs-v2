
The `influx scripts invoke` command executes an invokable script in InfluxDB.

## Usage
```
influx scripts invoke [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:-----|:------------------|:----------------------------------------------------------------------|:----------:|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-f` | `--file`          | File name containing the script parameters, in JSON                   | string     |                       |
| `-h` | `--help`          | Help for the `delete` command                                         |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-p` | `--params`        | JSON string containing script parameters                              | string     |                       |
| `-i` | `--scriptID`      | ({{< req >}}) Script ID                                               | string     |                       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

- [Invoke a script](#invoke-a-script)
- [Invoke a script with parameters](#invoke-a-script-with-parameters)

##### Invoke a script
```sh
influx scripts invoke -i 0Xx0oox00XXoxxoo1
```

##### Invoke a script with parameters
```sh
influx scripts invoke \
  -i 0Xx0oox00XXoxxoo1 \
  -p "{ \"myParameter\": \"example-data\" }"
```
