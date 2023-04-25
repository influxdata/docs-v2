---
title: Use Telegraf to write CSV data
description: >
  Use the Telegraf `file` input plugin to read and parse CSV data into
  [line protocol](/influxdb/cloud-serverless/reference/syntax/line-protocol/)
  and write it to InfluxDB.
menu:
  influxdb_cloud_serverless:
    name: Use Telegraf
    identifier: write-csv-telegraf
    parent: Write CSV data
weight: 203
related:
  - /{{< latest "telegraf" >}}/data_formats/input/csv/
  - /influxdb/cloud-serverless/write-data/use-telegraf/
---

Use the Telegraf `file` input plugin to read and parse CSV data into
[line protocol](/influxdb/cloud-serverless/reference/syntax/line-protocol/)
and write it to InfluxDB.
[Telegraf](/{{< latest "telegraf" >}}/) is a plugin-based agent that collects
metrics from different sources and writes them to specified destinations.

## Configure Telegraf to read CSV files

1.  And and enable the [`inputs.file` plugin](/{{< latest "telegraf" >}}/plugins/#input-file)
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

1.  Add and enable the the [`outputs.influxdb_v2`](/{{< latest "telegraf" >}}/plugins/#output-influxdb_v2)
    plugin in your Telegraf configuration file.
2.  Include the following options:

    - **urls**: List of
      [InfluxDB Cloud Serverless region URLs](/influxdb/cloud-serverless/reference/regions/)
      to write data to.
    - **token**: InfluxDB API token.
    - **organization**: InfluxDB organization name.
    - **bucket**: InfluxDB bucket to write to.

```toml
[[outputs.influxdb_v2]]
  urls = ["http://localhost:8086"]
  token = "$INFLUX_TOKEN"
  organization = "example-org"
  bucket = "example-bucket"
```

{{< expand-wrapper >}}
{{% expand "View full example Telegraf configuration file" %}}

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
  urls = ["http://localhost:8086"]
  token = "$INFLUX_TOKEN"
  organization = "example-org"
  bucket = "example-bucket"
```

{{% /expand %}}
{{< /expand-wrapper >}}

**Restart the Telegraf agent** to apply the configuration change and write the CSV
data to InfluxDB.