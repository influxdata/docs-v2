---
title: Use Telegraf to write CSV data to InfluxDB
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

To send data to {{< product-name >}}, enable the
[`influxdb_v2` output plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb_v2/README.md)
in the `telegraf.conf`.

{{% code-placeholders "DATABASE_NAME" %}}
```toml
[[outputs.influxdb_v2]]
  urls = ["https://{{< influxdb/host >}}"]
  # INFLUX_TOKEN is an environment variable you created for your database WRITE token
  token = "${INFLUX_TOKEN}"
  organization = ""
  bucket = "DATABASE_NAME"
```
{{% /code-placeholders %}}

Replace the following:

- **`DATABASE_NAME`**: the name of the InfluxDB [database](/influxdb/cloud-dedicated/admin/databases/) to write data to

To learn more about configuration options, see [Enable and configure the InfluxDB v2 output plugin](/influxdb/cloud-dedicated/write-data/use-telegraf/configure/#enable-and-configure-the-influxdb-v2-output-plugin).

{{< expand-wrapper >}}
{{% expand "View full example Telegraf configuration file" %}}

{{% code-placeholders "DATABASE_NAME" %}}
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
  urls = ["https://{{< influxdb/host >}}"]
  # INFLUX_TOKEN is an environment variable you created for your database WRITE token
  token = "{$INFLUX_TOKEN}"
  organization = ""
  bucket = "DATABASE_NAME"
  content_encoding = "gzip"
```
{{% /code-placeholders %}}

Replace the following:

- **`DATABASE_NAME`**: the name of the InfluxDB [database](/influxdb/cloud-dedicated/admin/databases/) to write data to

**`INFLUX_TOKEN`** is an environment variable you created in the [Setup instructions](/influxdb/cloud-dedicated/get-started/setup/?t=Telegraf) of the Get Started tutorial.

{{% /expand %}}
{{< /expand-wrapper >}}

**Restart the Telegraf agent** to apply the configuration change and write the CSV
data to InfluxDB.

#### Other Telegraf configuration options

The preceding examples describe Telegraf configurations necessary for writing to {{% product-name %}}.
The output plugin provides several other options for configuring the Telegraf client:

- `influx_uint_support`: supported by the InfluxDB IOx storage engine.
- See [`influxdb_v2` plugin options](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb_v2/README.md) on GitHub.
