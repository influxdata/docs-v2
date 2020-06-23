---
title: influx bucket update
description: The 'influx bucket update' command updates information associated with buckets in InfluxDB.
menu:
  v2_0_ref:
    name: influx bucket update
    parent: influx bucket
weight: 201
---

The `influx bucket update` command updates information associated with buckets in InfluxDB.

## Usage
```
influx bucket update [flags]
```

## Flags
| Flag |                  | Description                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                           |:----------: |:------------------    |
| `-d` | `--description`  | Bucket description                    | string      |                       |
| `-h` | `--help`         | Help for the `update` command         |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)  |             | `INFLUX_HIDE_HEADERS` |
| `-i` | `--id`           | **(Required)** Bucket ID              | string      |                       |
|      | `--json`         | Output data as JSON (default `false`) |             | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`         | New bucket name                       | string      | `INFLUX_BUCKET_NAME`  |
| `-r` | `--retention`    | New duration the bucket will retain data (0 is infinite, default is 0). Valid units are nanoseconds (`ns`), microseconds (`us` or `µs`), milliseconds (`ms`), seconds (`s`), minutes (`m`), hours (`h`), days (`d`), and weeks (`w`). | duration    |                       |

{{% cli/influx-global-flags %}}
