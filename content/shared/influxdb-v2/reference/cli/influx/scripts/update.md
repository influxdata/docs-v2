
The `influx scripts update` command updates information related to an invokable script in InfluxDB.

## Usage
```
influx scripts update [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:-----|:------------------|:----------------------------------------------------------------------|:----------:|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-d` | `--description`   | New script description                                                | string     |                       |
| `-h` | `--help`          | Help for the `update` command                                         |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
| `-n` | `--name`          | New script name                                                       | string     |                       |
| `-s` | `--script`        | New script contents                                                   | string     |                       |
| `-i` | `--scriptID`      | ({{< req >}}) Script ID                                               | string     |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |

## Example

{{< cli/influx-creds-note >}}

##### Update the source code of an invokable script
```sh
export UPDATED_FLUX='
  from(bucket: "example-bucket")
    |> range(start: -10h)
    |> filter(fn: (r) => r._measurement == "m")
    |> aggregateWindow(every: 1h, fn: mean)
    |> to(bucket: "default-ds-1d", org: "my-org")
'

influx scripts update \
  -i 0Xx0oox00XXoxxoo1 \
  -s $UPDATED_FLUX
```
