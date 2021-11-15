---
title: influx write dryrun
description: >
  The `influx write dryrun` command prints write output to stdout instead of writing
  to InfluxDB. Use this command to test writing data.
menu:
  influxdb_2_1_ref:
    name: influx write dryrun
    parent: influx write
weight: 101
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/write-data/
  - /influxdb/v2.1/write-data/developer-tools/csv/
  - /influxdb/v2.1/reference/syntax/line-protocol/
  - /influxdb/v2.1/reference/syntax/annotated-csv/
  - /influxdb/v2.1/reference/syntax/annotated-csv/extended/
---

The `influx write dryrun` command prints write output to stdout instead of writing
to InfluxDB. Use this command to test writing data.

Supports [line protocol](/influxdb/v2.1/reference/syntax/line-protocol),
[annotated CSV](/influxdb/v2.1/reference/syntax/annotated-csv), and
[extended annotated CSV](/influxdb/v2.1/reference/syntax/annotated-csv/extended).
Output is always **line protocol**.

## Usage
```
influx write dryrun [flags]
```

## Flags
| Flag |                     | Description                                                                     | Input type  | {{< cli/mapped >}}    |
|:-----|:--------------------|:--------------------------------------------------------------------------------|:-----------:|:----------------------|
| `-c` | `--active-config`   | CLI configuration to use for command                                            | string      |                       |
| `-b` | `--bucket`          | Bucket name (mutually exclusive with `--bucket-id`)                             | string      | `INFLUX_BUCKET_NAME`  |
|      | `--bucket-id`       | Bucket ID (mutually exclusive with `--bucket`)                                  | string      | `INFLUX_BUCKET_ID`    |
|      | `--configs-path`    | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)           | string      | `INFLUX_CONFIGS_PATH` |
|      | `--debug`           | Output errors to stderr                                                         |             |                       |
|      | `--encoding`        | Character encoding of input (default `UTF-8`)                                   | string      |                       |
|      | `--error-file`      | Path to a file used for recording rejected row errors                           | string      |                       |
| `-f` | `--file`            | File to import                                                                  | stringArray |                       |
|      | `--format`          | Input format (`lp` or `csv`, default `lp`)                                      | string      |                       |
|      | `--header`          | Prepend header line to CSV input data                                           | string      |                       |
| `-h` | `--help`            | Help for the `dryrun` command                                                   |             |                       |
|      | `--host`            | HTTP address of InfluxDB (default `http://localhost:9999`)                      | string      | `INFLUX_HOST`         |
|      | `--max-line-length` | Maximum number of bytes that can be read for a single line (default `16000000`) | integer     |                       |
| `-o` | `--org`             | Organization name (mutually exclusive with `--org-id`)                          | string      | `INFLUX_ORG`          |
|      | `--org-id`          | Organization ID (mutually exclusive with `--org`)                               | string      | `INFLUX_ORG_ID`       |
| `-p` | `--precision`       | Precision of the timestamps (default `ns`)                                      | string      | `INFLUX_PRECISION`    |
|      | `--rate-limit`      | Throttle write rate (examples: `5 MB / 5 min` or `1MB/s`).                      | string      |                       |
|      | `--skip-verify`     | Skip TLS certificate verification                                               |             | `INFLUX_SKIP_VERIFY`                      |
|      | `--skipHeader`      | Skip first *n* rows of input data                                               | integer     |                       |
|      | `--skipRowOnError`  | Output CSV errors to stderr, but continue processing                            |             |                       |
| `-t` | `--token`           | API token                                                                       | string      | `INFLUX_TOKEN`        |
| `-u` | `--url`             | URL to import data from                                                         | stringArray |                       |

## Examples

{{< cli/influx-creds-note >}}

- [Dry run writing line protocol](#line-protocol)
  - [via stdin](#dry-run-writing-line-protocol-via-stdin)
  - [from a file](#dry-run-writing-line-protocol-from-a-file)
  - [from multiple files](#dry-run-writing-line-protocol-from-multiple-files)
  - [from a URL](#dry-run-writing-line-protocol-from-a-url)
  - [from multiple URLs](#dry-run-writing-line-protocol-from-multiple-urls)
  - [from multiple sources](#dry-run-writing-line-protocol-from-multiple-sources)

- [Dry run writing CSV data](#csv)
  - [via stdin](#dry-run-writing-annotated-csv-data-via-stdin)
  - [from a file](#dry-run-writing-annotated-csv-data-from-a-file)
  - [from multiple files](#dry-run-writing-annotated-csv-data-from-multiple-files)
  - [from a URL](#dry-run-writing-annotated-csv-data-from-a-url)
  - [from multiple URLs](#dry-run-writing-annotated-csv-data-from-multiple-urls)
  - [from multiple sources](#dry-run-writing-annotated-csv-data-from-multiple-sources)
  - [and prepending annotation headers](#dry-run-prepending-csv-data-with-annotation-headers)


### Line protocol

##### Dry run writing line protocol via stdin
```sh
influx write --bucket example-bucket "
m,host=host1 field1=1.2
m,host=host2 field1=2.4
m,host=host1 field2=5i
m,host=host2 field2=3i
"
```

##### Dry run writing line protocol from a file
```sh
influx write dryrun \
  --bucket example-bucket \
  --file path/to/line-protocol.txt
```

##### Dry run writing line protocol from multiple files
```sh
influx write dryrun \
  --bucket example-bucket \
  --file path/to/line-protocol-1.txt \
  --file path/to/line-protocol-2.txt
```

##### Dry run writing line protocol from a URL
```sh
influx write dryrun \
  --bucket example-bucket \
  --url https://example.com/line-protocol.txt
```

##### Dry run writing line protocol from multiple URLs
```sh
influx write dryrun \
  --bucket example-bucket \
  --url https://example.com/line-protocol-1.txt \
  --url https://example.com/line-protocol-2.txt
```

##### Dry run writing line protocol from multiple sources
```sh
influx write dryrun \
  --bucket example-bucket \
  --file path/to/line-protocol-1.txt \
  --url https://example.com/line-protocol-2.txt
```

---

### CSV

##### Dry run writing annotated CSV data via stdin
```sh
influx write dryrun \
  --bucket example-bucket \
  --format csv \
  "#datatype measurement,tag,tag,field,field,ignored,time
m,cpu,host,time_steal,usage_user,nothing,time
cpu,cpu1,host1,0,2.7,a,1482669077000000000
cpu,cpu1,host2,0,2.2,b,1482669087000000000
"
```

##### Dry run writing annotated CSV data from a file
```sh
influx write dryrun \
  --bucket example-bucket \
  --file path/to/data.csv
```

##### Dry run writing annotated CSV data from multiple files
```sh
influx write dryrun \
  --bucket example-bucket \
  --file path/to/data-1.csv \
  --file path/to/data-2.csv
```

##### Dry run writing annotated CSV data from a URL
```sh
influx write dryrun \
  --bucket example-bucket \
  --url https://example.com/data.csv
```

##### Dry run writing annotated CSV data from multiple URLs
```sh
influx write dryrun \
  --bucket example-bucket \
  --url https://example.com/data-1.csv \
  --url https://example.com/data-2.csv
```

##### Dry run writing annotated CSV data from multiple sources
```sh
influx write dryrun \
  --bucket example-bucket \
  --file path/to/data-1.csv \
  --url https://example.com/data-2.csv
```

##### Dry run prepending CSV data with annotation headers
```sh
influx write dryrun \
  --bucket example-bucket \
  --header "#constant measurement,birds" \
  --header "#datatype dataTime:2006-01-02,long,tag" \
  --file path/to/data.csv
```
