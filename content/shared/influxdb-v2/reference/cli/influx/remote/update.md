

> [!Important]
> Replication remotes and replication streams can only be configured for InfluxDB OSS.

The `influx remote update` command updates an existing InfluxDB remote connection used for replicating data.

## Usage
```
influx remote update [command options] [arguments...]
```

## Flags

| Flag |                        | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | ---------------------- | --------------------------------------------------------------------- | ---------- | --------------------- |
| `-i` | `--id`                 | Remote connection ID to update                                        | string     |                       |
| `-n` | `--name`               | New name for the remote connection                                    | string     |                       |
| `-d` | `--description`        | New remote connection description                                     | string     |                       |
|      | `--remote-url`         | New remote InfluxDB URL                                               | string     |                       |
|      | `--remote-api-token`   | New remote InfluxDB API token                                         | string     |                       |
|      | `--remote-org-id`      | New remote organization ID                                            | string     |                       |
|      | `--allow-insecure-tls` | Allows insecure TLS connections                                       |            |                       |
|      | `--host`               | InfluxDB HTTP address (default `http://localhost:8086`)               | string     | `INFLUX_HOST`         |
|      | `--skip-verify`        | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
|      | `--configs-path`       | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-c` | `--active-config`      | CLI configuration to use for command                                  | string     |                       |
|      | `--http-debug`         | Inspect communication with InfluxDB servers                           | string     |                       |
|      | `--json`               | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--hide-headers`       | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
| `-t` | `--token`              | InfluxDB API token                                                    | string     | `INFLUX_TOKEN`        |

## Example
{{< cli/influx-creds-note >}}

### Update a remote
1. Use `influx remote list` to get the ID for the remote you want to update.
   ```sh
   $ influx remote list
   ID			        Name		Org ID
   0ooxX0xxXo0x 	    myremote    [...]
   ```
2. Use the following command to update the remote:
    ```sh
    influx remote update \
      --id 0ooxX0xxXo0x
      --name new-example-name
      --description new-example-description
      --remote-url http://new-example-url.com
      --remote-api-token myN3wS3crE7t0k3n==
      --remote-org-id new-example-org-id
    ```

