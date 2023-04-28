---
title: Use Telegraf to write CSV data to InfluxDB Cloud Dedicated
description: >
  Use the Telegraf `file` input plugin to read and parse CSV data into
  [line protocol](/influxdb/cloud-dedicated/reference/syntax/line-protocol/)
  and write it to InfluxDB.
menu:
  influxdb_cloud_dedicated:
    name: Use Telegraf
    identifier: write-csv-telegraf
    parent: Write CSV data
weight: 203
related:
  - /{{< latest "telegraf" >}}/data_formats/input/csv/
  - /influxdb/cloud-dedicated/write-data/use-telegraf/
---

Use the Telegraf `file` input plugin to read and parse CSV data into
[line protocol](/influxdb/cloud-dedicated/reference/syntax/line-protocol/)
and write it to InfluxDB.
[Telegraf](/{{< latest "telegraf" >}}/) is a plugin-based agent that collects
metrics from different sources and writes them to specified destinations.

<!-- TOC -->

- [Configure Telegraf to read CSV files](#configure-telegraf-to-read-csv-files)
- [Configure Telegraf to write to InfluxDB](#configure-telegraf-to-write-to-influxdb)
    - [Other Telegraf configuration options](#other-telegraf-configuration-options)

<!-- /TOC -->

## Configure Telegraf to read CSV files

1.  Add and enable the [`inputs.file` plugin](/{{< latest "telegraf" >}}/plugins/#input-file)
    in your Telegraf configuration file.
2.  Use the `files` option to specify the list of CSV files to read.
    CSV files must be accessible by the Telegraf agent.
3.  Set the `data_format` option to `csv`.
4.  Define all other `csv_` configuration options specific to the CSV data you
    want to write to InfluxDB.
    _For detailed information about each of the CSV format configuration options,
    see [CSV input data format](/{{< latest "telegraf" >}}/data_formats/input/csv/)._

```toml
[[inputs.file]]
  files = ["/path/to/example.csv"]
  data_format = "csv"
  csv_header_row_count = 0
  csv_column_names = []
  csv_column_types = []
  csv_skip_rows = 0
  csv_metadata_rows = 0
  csv_metadata_separators = [":", "="]
  csv_metadata_trim_set = ""
  csv_skip_columns = 0
  csv_delimiter = ","
  csv_comment = ""
  csv_trim_space = false
  csv_tag_columns = []
  csv_measurement_column = ""
  csv_timestamp_column = ""
  csv_timestamp_format = ""
  csv_timezone = ""
  csv_skip_values = []
  csv_skip_errors = false
  csv_reset_mode = "none"
```

## Configure Telegraf to write to InfluxDB

1.  Add and enable the [`outputs.influxdb_v2`](/{{< latest "telegraf" >}}/plugins/#output-influxdb_v2)
    plugin in your Telegraf configuration file.
2.  Include the following options:

    - **url**: a list (`[]`) containing your InfluxDB Cloud Dedicated cluster URL using the HTTPS
      protocol:

      ```
      ["https://cluster-id.influxdb.io"]
      ```
    - **token**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with permission to write to the database.
    - **organization**: an empty string (`""`) (ignored by InfluxDB Cloud Dedicated).
    - **bucket**: the name of the [database](/influxdb/cloud-dedicated/admin/databases/) to write to.

The following example shows a minimal [`outputs.influxdb_v2`](/{{< latest "telegraf" >}}/plugins/#output-influxdb_v2) configuration for writing data to InfluxDB Cloud Dedicated:

```toml
[[outputs.influxdb_v2]]
  urls = ["https://cluster-id.influxdb.io"]
  token = "DATABASE_TOKEN"
  organization = ""
  bucket = "DATABASE_NAME"
```

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated [database](/influxdb/cloud-dedicated/admin/databases/)
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the database

{{< expand-wrapper >}}
{{% expand "View full example Telegraf configuration file" %}}

In the following example:

- **`INFLUX_TOKEN`** is an environment variable assigned to a [database token](/influxdb/cloud-dedicated/admin/tokens/) value.
- **`DATABASE_NAME`** is the InfluxDB Cloud Dedicated database to write to.

```toml
[[inputs.file]]
  files = ["/path/to/example.csv"]
  data_format = "csv"
  csv_header_row_count = 0
  csv_column_names = []
  csv_column_types = []
  csv_skip_rows = 0
  csv_metadata_rows = 0
  csv_metadata_separators = [":", "="]
  csv_metadata_trim_set = ""
  csv_skip_columns = 0
  csv_delimiter = ","
  csv_comment = ""
  csv_trim_space = false
  csv_tag_columns = []
  csv_measurement_column = ""
  csv_timestamp_column = ""
  csv_timestamp_format = ""
  csv_timezone = ""
  csv_skip_values = []
  csv_skip_errors = false
  csv_reset_mode = "none"

[[outputs.influxdb_v2]]
  urls = ["https://cluster-id.influxdb.io"]
  token = "${INFLUX_TOKEN}"
  organization = ""
  bucket = "DATABASE_NAME"
  content_encoding = "gzip"
```

{{% /expand %}}
{{< /expand-wrapper >}}

**Restart the Telegraf agent** to apply the configuration change and write the CSV
data to InfluxDB.

#### Other Telegraf configuration options

The preceding examples describe Telegraf configurations necessary for writing to InfluxDB Cloud Dedicated.
The output plugin provides several other options for configuring the Telegraf client:

- `influx_uint_support`: supported by the InfluxDB IOx storage engine.
- See [`influxdb_v2` plugin options](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb_v2/README.md) on GitHub.
