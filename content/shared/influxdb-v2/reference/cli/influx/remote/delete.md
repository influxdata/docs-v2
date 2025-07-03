
> [!Important]
> Replication remotes and replication streams can only be configured for InfluxDB OSS.

The `influx remote delete` command delete an existing remote InfluxDB connection used for replication.

## Usage
```
influx remote delete [command options] [arguments...]
```

## Flags

| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :---------------- | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-i` | `--id`            | Remote connection ID to delete                                        |            |                       |
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

### Delete a remote
1. Use `influx remote list` to get the ID for the remote you want to delete.
   ```sh
   $ influx remote list --org-id <OSS org ID> --token <OSS token>
   ID			        Name		Org ID
   0ooxX0xxXo0x 	    myremote    [...]
   ```
2. Use the following command to delete the remote:
    ```sh
    influx remote delete \
      --org-id <OSS org ID> \
      --token <OSS token> \
      --id 0ooxX0xxXo0x
    ```
