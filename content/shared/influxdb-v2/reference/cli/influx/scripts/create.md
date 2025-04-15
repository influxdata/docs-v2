
The `influx scripts create` command creates an invokable script in InfluxDB.

## Usage
```
influx scripts create [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :---------------- | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-c` | `--active-config` | CLI configuration to use for command                                  |   string   |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH` |
| `-d` | `--description`   | ({{< req >}}) Purpose or functionality of the script                  |   string   |                       |
| `-f` | `--file`          | Path to file containing the script to be executed                     |   string   |                       |
| `-h` | `--help`          | Help for the `create` command                                         |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            |   string   | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers                           |   string   |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-l` | `--language`      | ({{< req >}}) Language the script is written in                       |   string   |                       |
| `-n` | `--name`          | ({{< req >}}) Script name of the script                               |   string   |                       |
| `-s` | `--script`        | Contents of the script to be executed                                 |   string   |                       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`         | API token                                                             |   string   | `INFLUX_TOKEN`        |

## Example

{{< cli/influx-creds-note >}}

##### Create a script using raw Flux
```sh
export FLUX_SCRIPT='
  from(bucket: "example-bucket")
    |> range(start: -10h)
    |> filter(fn: (r) => r._measurement == "m")
    |> aggregateWindow(every: 1h, fn: mean)
    |> to(bucket: "default-ds-1d", org: "my-org")
'

influx scripts create \
  -n "example-script" \
  -d "a simple example" \
  -l "flux" \
  -s $FLUX_SCRIPT
```

##### Create a script from a file
```sh
influx scripts create \
  -n "example-script" \
  -d "a simple example" \
  -l "flux" \
  -f /path/to/example-script.flux
```
