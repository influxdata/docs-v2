
> [!Important]
> Replication remotes and replication streams can only be configured for InfluxDB OSS.

The `influx replication update` command updates an InfluxDB replication stream.

## Usage
```
influx replication update [command options] [arguments...]
```

## Flag 
  
| Flag |                                | Description                                                                            | Input type | {{< cli/mapped >}}    |
| :--- | :----------------------------- | :------------------------------------------------------------------------------------- | :--------: | :-------------------- |
| `-i` | `--id`                         | Replication stream ID to update                                                        |   string   |                       |
| `-n` | `--name`                       | New replication stream name                                                            |   string   |                       |
| `-d` | `--description`                | New replication stream description                                                     |   string   |                       |
|      | `--remote-id`                  | New remote connection ID to send data to                                               |   string   |                       |
|      | `--remote-bucket`              | Remote bucket name to replicate data to (mutually exclusive with `--remote-bucket-id`) |   string   |                       |
|      | `--remote-bucket-id`           | Remote bucket ID to replicate data to (mutually exclusive with `--remote-bucket-name`) |   string   |                       |
|      | `--max-queue-bytes`            | New max queue size in bytes (default: `0`)                                             |  integer   |                       |
|      | `--drop-non-retryable-data`    | Drop data when a non-retryable error is encountered                                    |            |                       |
|      | `--no-drop-non-retryable-data` | Do not drop data when a non-retryable error is encountered                             |            |                       |
|      | `--max-age`                    | Specify a maximum age (in seconds) for data before it is dropped                       |  integer   |                       |
|      | `--host`                       | InfluxDB HTTP address (default `http://localhost:8086`)                                |   string   | `INFLUX_HOST`         |
|      | `--skip-verify`                | Skip TLS certificate verification                                                      |            | `INFLUX_SKIP_VERIFY`  |
|      | `--configs-path`               | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)                  |   string   | `INFLUX_CONFIGS_PATH` |
| `-c` | `--active-config`              | CLI configuration to use for command                                                   |   string   |                       |
|      | `--http-debug`                 | Inspect communication with InfluxDB servers                                            |   string   |                       |
|      | `--json`                       | Output data as JSON (default `false`)                                                  |            | `INFLUX_OUTPUT_JSON`  |
|      | `--hide-headers`               | Hide table headers (default `false`)                                                   |            | `INFLUX_HIDE_HEADERS` |
| `-t` | `--token`                      | InfluxDB API token                                                                     |   string   | `INFLUX_TOKEN`        |

## Example
{{< cli/influx-creds-note >}}

### Update a replication
1. Use `influx replication list` to get the ID for the replication you want to update.
   ```sh
   $ influx replication list
   ID			        Name		Org ID
   0ooxX0xxXo0x      	    myreplication    [...]
   ```
2. Use the following command to update the replication:
    ```sh
    influx replication update \
      --id 0ooxX0xxXo0x
      --name new-replication-name
      --description new-replication-description
      --replication-url http://new-replication-url.com
      --replication-api-token new-replication-api-token
      --replication-org-id new-replication-org-id
    ```
