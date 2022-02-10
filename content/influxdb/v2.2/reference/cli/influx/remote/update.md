---
title: influx remote update
description: Update remote InfluxDB connections used for for replicating data.
menu:
  influxdb_2_2_ref:
    name: influx remote update
    parent: influx remote
weight: 102
influxdb/v2.2/tags: [write, replication]
related:
  - /influxdb/v2.2/reference/cli/influx/replication
---


{{% cloud %}}
Replication remotes and replication streams can only be configured for InfluxDB OSS.
{{% /cloud %}}

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

### Update a remote
1. Use `influx remote list` to get the ID for the remote you want to update.
   ```sh
   $ influx remote list --org-id <OSS org ID> --token <OSS token>
   ID			        Name		Org ID
   <remote ID>  	    myremote    [...]
   ```
2. Use the following command to update the remote:
    ```sh
    influx remote remote \
      --id <remote ID>
      --name <new name>
      --description <new description>
      --remote-url <new remote URL>
      --remote-api-token <new token>
      --remote-org-id <new org>
    ```

