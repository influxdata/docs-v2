
The `influx dashboards` command lists existing InfluxDB dashboards.

## Usage
```sh
influx dashboards [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:-----|:------------------|:----------------------------------------------------------------------|:-----------:|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string      |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `dashboards` command                                     |             |                       |
|      | `--hide-headers`  | Hide table headers                                                    |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string      | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string      |                       |
| `-i` | `--id`            | Dashboard ID to retrieve                                              | stringArray |                       |
|      | `--json`          | Output data as JSON                                                   |             | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                | string      | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                     | string      | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |             | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`         | API token                                                             | string      | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

##### List all dashboards
```sh
influx dashboards
```

##### List only specific dashboards
```sh
influx dashboards \
  --id 068ad4a493f2d000 \
  --id 0623f2dabc000121
```
