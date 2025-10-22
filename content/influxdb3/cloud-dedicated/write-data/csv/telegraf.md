---
title: Use Telegraf to write CSV data to InfluxDB
description: >
  Use the Telegraf `file` input plugin to read and parse CSV data into
  [line protocol](/influxdb3/cloud-dedicated/reference/syntax/line-protocol/)
  and write it to InfluxDB.
menu:
  influxdb3_cloud_dedicated:
    name: Use Telegraf
    identifier: write-csv-telegraf
    parent: Write CSV data
weight: 203
related:
  - /telegraf/v1/data_formats/input/csv/
  - /influxdb3/cloud-dedicated/write-data/use-telegraf/
---

Use the Telegraf `file` input plugin to read and parse CSV data into
[line protocol](/influxdb3/cloud-dedicated/reference/syntax/line-protocol/)
and write it to InfluxDB.
[Telegraf](/telegraf/v1/) is a plugin-based agent that collects
metrics from different sources and writes them to specified destinations.

<!-- TOC -->

- [Configure Telegraf to read CSV files](#configure-telegraf-to-read-csv-files)
- [Configure Telegraf to write to InfluxDB](#configure-telegraf-to-write-to-influxdb)
    - [Other Telegraf configuration options](#other-telegraf-configuration-options)

<!-- /TOC -->

## Configure Telegraf to read CSV files

1.  Add and enable the [`inputs.file` plugin](/telegraf/v1/plugins/#input-file)
    in your Telegraf configuration file.
2.  Use the `files` option to specify the list of CSV files to read.
    CSV files must be accessible by the Telegraf agent.
3.  Set the `data_format` option to `csv`.
4.  Define all other `csv_` configuration options specific to the CSV data you
    want to write to InfluxDB.
    _For detailed information about each of the CSV format configuration options,
    see [CSV input data format](/telegraf/v1/data_formats/input/csv/)._

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
[`influxdb_v2` output plugin](/telegraf/v1/output-plugins/influxdb_v2/)
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

- **`DATABASE_NAME`**: the name of the InfluxDB [database](/influxdb3/cloud-dedicated/admin/databases/) to write data to

To learn more about configuration options, see [Enable and configure the InfluxDB v2 output plugin](/influxdb3/cloud-dedicated/write-data/use-telegraf/configure/#enable-and-configure-the-influxdb-v2-output-plugin).

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

- **`DATABASE_NAME`**: the name of the InfluxDB [database](/influxdb3/cloud-dedicated/admin/databases/) to write data to

**`INFLUX_TOKEN`** is an environment variable you created in the [Setup instructions](/influxdb3/cloud-dedicated/get-started/setup/?t=Telegraf) of the Get Started tutorial.

{{% /expand %}}
{{< /expand-wrapper >}}

**Restart the Telegraf agent** to apply the configuration change and write the CSV
data to InfluxDB.

#### Other Telegraf configuration options

The preceding examples describe Telegraf configurations necessary for writing to {{% product-name %}}.
The output plugin provides several other options for configuring the Telegraf client:

- `influx_uint_support`: supported by the InfluxDB 3 storage engine.
- See [`influxdb_v2` plugin options](/telegraf/v1/output-plugins/influxdb_v2/) on GitHub.
