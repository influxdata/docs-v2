
> [!Important]
> Replication remotes and replication streams can only be configured for InfluxDB OSS.

The `influx replication delete` command deletes an InfluxDB replication stream.

## Usage
   
```
influx replication delete [command options] [arguments...]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :---------------- | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-i` | `--id`            | Replication stream ID to delete                                       |   string   |                       |
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

### Delete a replication
1. Use `influx replication list` to get the ID for the replication you want to delete.
   ```sh
   $ influx replication list
   ID			        Name		Org ID
   0ooxX0xxXo0x      	    myreplication    [...]
   ```
2. Use the following command to delete the replication:
    ```sh
    influx replication delete --id 0ooxX0xxXo0x
    ```
