
Use the Telegraf `file` input plugin to read and parse CSV data into
[line protocol](/influxdb3/version/reference/syntax/line-protocol/)
and write it to {{< product-name >}}.
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
    want to write to {{< product-name >}}.
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

To send data to {{< product-name >}}, enable and configure the
[`influxdb_v2` output plugin](/influxdb3/version/write-data/use-telegraf/configure/#enable-and-configure-the-influxdb-v2-output-plugin)
in your `telegraf.conf`.

{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
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
  urls = ["http://{{< influxdb/host >}}"]
  token = "AUTH_TOKEN"
  organization = ""
  bucket = "DATABASE_NAME"
  content_encoding = "gzip"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to write data to
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% token-link %}}.
  _Store this in a secret store or environment variable to avoid exposing the raw token string._

  > [!Tip]
  >
  > ##### Store your authorization token as an environment variable
  >
  > Avoid storing a plain text token in your Telegraf configuration file.
  > Store the token as an environment variable and then
  > reference the environment variable in your configuration file using string
  > interpolation. For example:
  > 
  > ```toml
  > [[outputs.influxdb_v2]]
  >   urls = ["http://{{< influxdb/host >}}"]
  >   token = "${INFLUX_TOKEN}"
  >   # ...
  > ```


**Restart the Telegraf agent** to apply the configuration change and write the
CSV data to {{% product-name %}}.

#### Other Telegraf configuration options

The preceding examples describe Telegraf configurations necessary for writing to
{{% product-name %}}. The `influxdb_v2` output plugin provides several other
configuration options. For more information, see the
[`influxdb_v2` plugin options](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb_v2/README.md)
on GitHub.
