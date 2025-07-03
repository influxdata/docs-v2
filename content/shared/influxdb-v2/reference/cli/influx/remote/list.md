
> [!Important]
> Replication remotes and replication streams can only be configured for InfluxDB OSS.

The `influx remote list` command lists all remote InfluxDB connections used for replication.

## Usage

```
influx remote list [command options] [arguments...]
```

## Flags

| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :---------------- | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-n` | `--name`          | Filter remote connections by name                                     |            |                       |
|      | `--org-id`        | Organization ID                                                       |   string   | `INFLUX_ORG_ID`       |
| `-o` | `--org`           | Organization name                                                     |   string   | `INFLUX_ORG`          |
|      | `--remote-url`    | Filter remote connections by remote URL                               |   string   |                       |
|      | `--host`          | InfluxDB HTTP address (default `http://localhost:8086`)               |   string   | `INFLUX_HOST`         |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH` |
| `-c` | `--active-config` | CLI configuration to use for command                                  |   string   |                       |
|      | `--http-debug`    | Inspect communication with InfluxDB servers                           |   string   |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
| `-t` | `--token`         | InfluxDB API token                                                    |   string   | `INFLUX_TOKEN`        |


## Examples
{{< cli/influx-creds-note >}}

### List all remotes

```sh
influx remote list
```

### List a specific remote by name

```sh
influx remote list --name example-name
```
