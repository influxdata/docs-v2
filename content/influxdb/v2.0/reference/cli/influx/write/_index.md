---
title: influx write
description: >
  The `influx write` command writes data to InfluxDB via stdin or from a specified file.
  Write data using line protocol, annotated CSV, or extended annotated CSV.
menu:
  influxdb_2_0_ref:
    name: influx write
    parent: influx
weight: 101
influxdb/v2.0/tags: [write]
related:
  - /influxdb/v2.0/write-data/
  - /influxdb/v2.0/write-data/developer-tools/csv/
  - /influxdb/v2.0/reference/syntax/line-protocol/
  - /influxdb/v2.0/reference/syntax/annotated-csv/
  - /influxdb/v2.0/reference/syntax/annotated-csv/extended/
---

The `influx write` command writes data to InfluxDB via stdin or from a specified file.
Write data using [line protocol](/influxdb/v2.0/reference/syntax/line-protocol),
[annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv), or
[extended annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/extended/).
If you write CSV data, CSV annotations determine how the data translates into line protocol.

## Usage
```
influx write [flags]
influx write [command]
```

## Subcommands
| Subcommand                                                 | Description                         |
|:----------                                                 |:-----------                         |
| [dryrun](/influxdb/v2.0/reference/cli/influx/write/dryrun) | Write to stdout instead of InfluxDB |

## Flags
| Flag |                     | Description                                                                     | Input type | {{< cli/mapped >}}    |
|:-----|:--------------------|:--------------------------------------------------------------------------------|:----------:|:----------------------|
| `-c` | `--active-config`   | CLI configuration to use for command                                            | string     |                       |
| `-b` | `--bucket`          | Bucket name                                                                     | string     | `INFLUX_BUCKET_NAME`  |
|      | `--bucket-id`       | Bucket ID                                                                       | string     | `INFLUX_BUCKET_ID`    |
|      | `--configs-path`    | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)           | string     | `INFLUX_CONFIGS_PATH` |
|      | `--debug`           | Output errors to stderr                                                         |            |                       |
|      | `--encoding`        | Character encoding of input (default `UTF-8`)                                   | string     |                       |
|      | `--error-file`      | Path to a file used for recording rejected row errors                           | string     |                       |
| `-f` | `--file`            | File to import                                                                  | string     |                       |
|      | `--format`          | Input format (`lp` or `csv`, default `lp`)                                      | string     |                       |
|      | `--header`          | Prepend header line to CSV input data                                           | string     |                       |
| `-h` | `--help`            | Help for the `dryrun` command                                                   |            |                       |
|      | `--host`            | HTTP address of InfluxDB (default `http://localhost:9999`)                      | string     | `INFLUX_HOST`         |
|      | `--max-line-length` | Maximum number of bytes that can be read for a single line (default `16000000`) | integer    |                       |
| `-o` | `--org`             | Organization name                                                               | string     | `INFLUX_ORG`          |
|      | `--org-id`          | Organization ID                                                                 | string     | `INFLUX_ORG_ID`       |
| `-p` | `--precision`       | Precision of the timestamps (default `ns`)                                      | string     | `INFLUX_PRECISION`    |
|      | `--rate-limit`      | Throttle write rate (examples: `5 MB / 5 min` or `1MB/s`).                      | string     |                       |
|      | `--skipHeader`      | Skip first *n* rows of input data                                               | integer    |                       |
|      | `--skipRowOnError`  | Output CSV errors to stderr, but continue processing                            |            |                       |
|      | `--skip-verify`     | Skip TLS certificate verification                                               |            |                       |
| `-t` | `--token`           | Authentication token                                                            | string     | `INFLUX_TOKEN`        |
| `-u` | `--url`             | URL to import data from                                                         | string     |                       |

## Examples

- [Write line protocol](#line-protocol)
  - [via stdin](#write-line-protocol-via-stdin)
  - [from a file](#write-line-protocol-from-a-file)
  - [from multiple files](#write-line-protocol-from-multiple-files)
  - [from a URL](#write-line-protocol-from-a-url)
  - [from multiple URLs](#write-line-protocol-from-multiple-urls)
  - [from multiple sources](#write-line-protocol-from-multiple-sources)

- [Write CSV data](#csv)
  - [via stdin](#write-annotated-csv-data-via-stdin)
  - [from a file](#write-annotated-csv-data-from-a-file)
  - [from multiple files](#write-annotated-csv-data-from-multiple-files)
  - [from a URL](#write-annotated-csv-data-from-a-url)
  - [from multiple URLs](#write-annotated-csv-data-from-multiple-urls)
  - [from multiple sources](#write-annotated-csv-data-from-multiple-sources)
  - [and prepend annotation headers](#prepend-csv-data-with-annotation-headers)


### Line protocol

##### Write line protocol via stdin
```sh
influx write --bucket example-bucket "
m,host=host1 field1=1.2
m,host=host2 field1=2.4
m,host=host1 field2=5i
m,host=host2 field2=3i
"
```

##### Write line protocol from a file
```sh
influx write \
  --bucket example-bucket \
  --file path/to/line-protocol.txt
```

##### Write line protocol from multiple files
```sh
influx write \
  --bucket example-bucket \
  --file path/to/line-protocol-1.txt \
  --file path/to/line-protocol-2.txt
```

##### Write line protocol from a URL
```sh
influx write \
  --bucket example-bucket \
  --url https://example.com/line-protocol.txt
```

##### Write line protocol from multiple URLs
```sh
influx write \
  --bucket example-bucket \
  --url https://example.com/line-protocol-1.txt \
  --url https://example.com/line-protocol-2.txt
```

##### Write line protocol from multiple sources
```sh
influx write \
  --bucket example-bucket \
  --file path/to/line-protocol-1.txt \
  --url https://example.com/line-protocol-2.txt
```

---

### CSV

##### Write annotated CSV data via stdin
```sh
influx write \
  --bucket example-bucket \
  --format csv \
  "#datatype measurement,tag,tag,field,field,ignored,time
m,cpu,host,time_steal,usage_user,nothing,time
cpu,cpu1,host1,0,2.7,a,1482669077000000000
cpu,cpu1,host2,0,2.2,b,1482669087000000000
"
```

##### Write annotated CSV data from a file
```sh
influx write \
  --bucket example-bucket \
  --file path/to/data.csv
```

##### Write annotated CSV data from multiple files
```sh
influx write \
  --bucket example-bucket \
  --file path/to/data-1.csv \
  --file path/to/data-2.csv
```

##### Write annotated CSV data from a URL
```sh
influx write \
  --bucket example-bucket \
  --url https://example.com/data.csv
```

##### Write annotated CSV data from multiple URLs
```sh
influx write \
  --bucket example-bucket \
  --url https://example.com/data-1.csv \
  --url https://example.com/data-2.csv
```

##### Write annotated CSV data from multiple sources
```sh
influx write \
  --bucket example-bucket \
  --file path/to/data-1.csv \
  --url https://example.com/data-2.csv
```

##### Prepend CSV data with annotation headers
```sh
influx write \
  --bucket example-bucket \
  --header "#constant measurement,birds" \
  --header "#datatype dataTime:2006-01-02,long,tag" \
  --file path/to/data.csv
```


