
> [!Important]
> Replication remotes and replication streams can only be configured for InfluxDB OSS.

The `influx replication list` command lists all InfluxDB replication streams and their corresponding metrics.

The following metrics are listed for each replication and provide information about how the replication queue is performing:

- **Latest Status Code**: Status code of the last `write` request to the remote.
  This should be a 204 during healthy operation.
- **Remaining Bytes to be Synced**: Number of bytes that have not been synced to the remote.
  This number should stay close to 0 and should not be constantly increasing.
- **Current Queue Bytes on Disk**: Total size of the replication queue in bytes.
  The replication queue is cleaned up every `--max-age` seconds.
  If your queue is filling up your disk, lower this value at the cost of potentially lower reliability.

## Usage

```
influx replication list [command options] [arguments...]
```

## Flags

| Flag |                     | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :------------------ | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-n` | `--name`            | Filter replication streams by name                                    |   string   |                       |
|      | `--org-id`          | Local organization ID                                                 |   string   | `INFLUX_ORG_ID`       |
| `-o` | `--org`             | Local organization name                                               |   string   | `INFLUX_ORG`          |
|      | `--remote-id`       | Filter replication streams by remote connection ID                    |   string   |                       |
|      | `--local-bucket-id` | Filter replication streams by local bucket                            |   string   |                       |
|      | `--host`            | InfluxDB HTTP address (default `http://localhost:8086`)               |   string   | `INFLUX_HOST`         |
|      | `--skip-verify`     | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
|      | `--configs-path`    | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH` |
| `-c` | `--active-config`   | CLI configuration to use for command                                  |   string   |                       |
|      | `--http-debug`      | Inspect communication with InfluxDB servers                           |   string   |                       |
|      | `--json`            | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--hide-headers`    | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
| `-t` | `--token`           | InfluxDB API token                                                    |   string   | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

### List all replication streams

```sh
influx replication list --org-id <OSS org ID> --token <OSS token>
```

### List a replication stream by name

```sh
influx replication list --name example-replication-name
```
