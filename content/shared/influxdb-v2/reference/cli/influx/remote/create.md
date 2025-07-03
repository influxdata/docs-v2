
> [!Important]
> Replication remotes and replication streams can only be configured for InfluxDB OSS.

The `influx remote create` command creates a new remote InfluxDB connection for replicating data.

## Usage
```
influx remote create [command options] [arguments...]
```

## Flags

| Flag |                        | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :--------------------- | :-------------------------------------------------------------------- | :--------: | :-------------------- |
|      | `--org-id`             | Organization ID                                                       |   string   | `INFLUX_ORG_ID`       |
| `-o` | `--org`                | Organization name                                                     |   string   | `INFLUX_ORG`          |
| `-n` | `--name`               | Remote connection name                                                |   string   |                       |
| `-d` | `--description`        | Remote connection description                                         |   string   |                       |
|      | `--remote-url`         | Remote InfluxDB instance URL                                          |   string   |                       |
|      | `--remote-api-token`   | Remote InfluxDB API token                                             |   string   |                       |
|      | `--remote-org-id`      | Remote InfluxDB organization ID                                       |   string   |                       |
|      | `--allow-insecure-tls` | Allows insecure TLS (self-signed certificates)                        |            |                       |
|      | `--host`               | InfluxDB HTTP address (default `http://localhost:8086`)               |   string   | `INFLUX_HOST`         |
|      | `--skip-verify`        | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
|      | `--configs-path`       | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH` |
| `-c` | `--active-config`      | CLI configuration to use for command                                  |   string   |                       |
|      | `--http-debug`         | Inspect communication with InfluxDB servers                           |   string   |                       |
|      | `--json`               | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--hide-headers`       | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
| `-t` | `--token`              | InfluxDB API token                                                    |   string   | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

### Create a new remote with InfluxDB Cloud

```sh
influx remote create \
  --name myremote \
  --org-id <OSS org ID> \
  --token <OSS token> \
  --remote-url <remote URL> \
  --remote-api-token <remote token> \
  --remote-org-id <remote ord ID>
```
