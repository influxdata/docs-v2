
The `influx backup` command backs up data stored in InfluxDB to a specified directory.

## Usage
```
influx backup [flags] path
```

## Flags

| Flag |                            | Description                                                                                                                                                                | Input type | {{< cli/mapped >}}    |
|------|----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|-----------------------|
| `-c` | `--active-config`          | CLI configuration to use for command                                                                                                                                       | string     |                       |
|      | `--bucket-id`              | ID of the bucket to back up from (mutually exclusive with `--bucket`)                                                                                                      | string     |                       |
| `-b` | `--bucket`                 | Name of the bucket to back up from (mutually exclusive with `--bucket-id`)                                                                                                 | string     |                       |
|      | `--compression`            | Compression for local backup files. Defaults to `gzip`. Set to `none` to disable. If `--gzip-compression-level=none` and `--compression` is unset, defaults to `none`.     | string     |                       |
|      | `--configs-path`           | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)                                                                                                      | string     | `INFLUX_CONFIGS_PATH` |
|      | `--gzip-compression-level` | Server-side gzip compression level for the backup download: `default`, `full` (best compression), `speedy` (fastest), or `none`. _(2.8.0+)_                                | string     |                       |
| `-h` | `--help`                   | Help for the `backup` command                                                                                                                                              |            |                       |
|      | `--hide-headers`           | Hide table headers (default `false`)                                                                                                                                       |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`                   | HTTP address of InfluxDB (default: `http://localhost:8086`)                                                                                                                | string     | `INFLUX_HOST`         |
|      | `--http-debug`             | Inspect communication with InfluxDB servers.                                                                                                                               | string     |                       |
|      | `--json`                   | Output data as JSON (default `false`)                                                                                                                                      |            | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`                    | Organization name (mutually exclusive with `--org-id`)                                                                                                                     | string     | `INFLUX_ORG`          |
|      | `--org-id`                 | Organization ID (mutually exclusive with `--org`)                                                                                                                          | string     | `INFLUX_ORG_ID`       |
|      | `--skip-verify`            | Skip TLS certificate verification                                                                                                                                          | string     | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`                  | API token                                                                                                                                                                  | string     | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

- [Back up all data to a directory](#back-up-all-data-to-a-directory)
- [Back up all data to the current working directory](#back-up-all-data-to-the-current-working-directory)
- [Back up a specific bucket to a directory](#back-up-a-specific-bucket-to-a-directory)
- [Back up using a faster server-side compression level](#back-up-using-a-faster-server-side-compression-level)

##### Back up all data to a directory
```sh
influx backup /path/to/backup/dir/
```

##### Back up all data to the current working directory
```sh
influx backup ./
```

##### Back up a specific bucket to a directory
```sh
influx backup --bucket example-bucket /path/to/backup/dir/
```

##### Back up using a faster server-side compression level

_Requires InfluxDB 2.9.0+ and `influx` CLI 2.8.0+._

```sh
influx backup --gzip-compression-level speedy /path/to/backup/dir/
```
