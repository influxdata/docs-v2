---
title: CSV input data format
list_title: CSV
description: Use the `csv` input data format to parse comma-separated values into Telegraf metrics.
menu:
  telegraf_v1_ref:
    name: CSV
    weight: 10
    parent: Input data formats
metadata: [CSV parser plugin]
---

Use the `csv` input data format to parse comma-separated values into Telegraf metrics.

## Configuration

```toml
[[inputs.file]]
  files = ["example"]

  ## The data format to consume.
  ## Type: string
  ## Each data format has its own unique set of configuration options.
  ## For more information about input data formats and options,
  ## see https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "csv"

  ## Specifies the number of rows to treat as the header.
  ## Type: integer
  ## Default: 0
  ## The value can be 0 or greater.
  ## If `0`, doesn't use a header; the parser treats all rows as data and uses the names specified in `csv_column_names`.
  ## If `1`, uses the first row as the header.
  ## If greater than `1`, concatenates that number of values for each column.
  ## Values specified in `csv_column_names` override column names in the header.
  csv_header_row_count = 0

  ## Specifies custom names for columns.
  ## Type: []string
  ## Default: []
  ## Specify names in order by column; unnamed columns are ignored by the parser.
  ## Required if `csv_header_row_count` is set to `0`.
  csv_column_names = []

  ## Specifies data types for columns.
  ## Type: []string{"int", "float", "bool", "string"}
  ## Default: Tries to convert each column to one of the possible types, in the following order: "int", "float", "bool", "string".
  ## Possible values: "int", "float", "bool", "string".
  ## Specify types in order by column (for example, `["string", "int", "float"]`).
  csv_column_types = []

  ## Specifies the number of rows to skip before looking for metadata and header information.
  ## Default: 0
  csv_skip_rows = 0

  ## Specifies the number of rows to parse as metadata (before looking for header information).
  ## Type: integer
  ## Default: 0; no metadata rows to parse.
  ## If set, parses the rows using the characters specified in `csv_metadata_separators`, and then adds the
  ## parsed key-value pairs as tags in the data.
  ## To convert the tags to fields, use the converter processor.
  csv_metadata_rows = 0

  ## Specifies metadata separators, in order of precedence, for parsing metadata rows.
  ## Type: []string
  ## At least one separator is required if `csv_metadata_rows` is set.
  ## The specified values set the order of precedence for separators used to parse `csv_metadata_rows` into key-value pairs.
  ## Separators are case-sensitive.
  csv_metadata_separators = [":", "="]

  ## Specifies a set of characters to trim from metadata rows.
  ## Type: string
  ## Default: empty; the parser doesn't trim metadata rows.
  ## Trim characters are case sensitive.
  csv_metadata_trim_set = ""

  ## Specifies the number of columns to skip in header and data rows.
  ## Type: integer
  ## Default: 0; no columns are skipped
  csv_skip_columns = 0

  ## Specifies the separator for columns in the CSV.
  ## Type: string
  ## Default: a comma (`,`)
  ## If you specify an invalid delimiter (for example, `"\u0000"`),
  ## the parser converts commas to `"\ufffd"` and converts invalid delimiters
  ## to commas, parses the data, and then reverts invalid characters and commas
  ## to their original values.
  csv_delimiter = ","

  ## Specifies the character used to indicate a comment row.
  ## Type: string
  ## Default: empty; no rows are treated as comments
  ## The parser skips rows that begin with the specified character.
  csv_comment = ""

  ## Specifies whether to remove leading whitespace from fields.
  ## Type: boolean
  ## Default: false
  csv_trim_space = false

  ## Specifies columns (by name) to use as tags.
  ## Type: []string
  ## Default: empty
  ## Columns not specified as tags or measurement name are considered fields.
  csv_tag_columns = []

  ## Specifies whether column tags overwrite metadata and default tags.
  ## Type: boolean
  ## Default: false
  ## If true, the column tag value takes precedence over metadata
  ## or default tags that have the same name.
  csv_tag_overwrite = false

  ## Specifies the CSV column to use for the measurement name.
  ## Type: string
  ## Default: empty; uses the input plugin name for the measurement name.
  ## If set, the measurement name is extracted from values in the specified
  ## column and the column isn't included as a field.
  csv_measurement_column = ""

  ## Specifies the CSV column to use for the timestamp.
  ## Type: string
  ## Default: empty; uses the current system time as the timestamp in metrics
  ## If set, the parser extracts time values from the specified column
  ## to use as timestamps in metrics, and the column isn't included
  ## as a field in metrics.
  ## If set, you must also specify a value for `csv_timestamp_format`.
  ## For more information, see [timestamps](/telegraf/v1/data_formats/input/csv/#timestamps).
  csv_timestamp_column = ""

  ## Specifies the timestamp format for values extracted from `csv_timestamp_column`.
  ## Type: string
  ## Possible values: "unix", "unix_ms", "unix_us", "unix_ns", the Go reference time in one of the predefined layouts
  ## Default: empty
  ## Required if `csv_timestamp_column` is specified.
  ## For more information, see [timestamps](/telegraf/v1/data_formats/input/csv/#timestamps).
  csv_timestamp_format = ""

  ## Specifies the time zone to use and outputs location-specific timestamps in metrics.
  ## Only used if `csv_timestamp_format` is the Go reference time in one of the
  ## predefined layouts; unix formats are in UTC.
  ## Type: string
  ## Default: empty
  ## Possible values: a time zone name in TZ syntax. For a list of names, see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List.
  csv_timezone = ""
  ## For more information, see [timestamps](/telegraf/v1/data_formats/input/csv/#timestamps).

  ## Specifies values to skip--for example, an empty string (`""`).
  ## Type: []string
  ## Default: empty
  ## The parser skips field values that match any of the specified values.
  csv_skip_values = []

  ## Specifies whether to skip CSV lines that can't be parsed.
  ## Type: boolean
  ## Default: false
  csv_skip_errors = false

  ## Specifies whether to reset the parser after each call.
  ## Type: string
  ## Default: "none"
  ## Possible values:
  ## - "none": Do not reset the parser.
  ## - "always": Reset the parser's state after reading each file in the gather
  ##   cycle. If parsing by line, the setting is ignored.
  ## Resetting the parser state after parsing each file is helpful when reading
  ## full CSV structures that include headers or metadata.
  csv_reset_mode = "none"
  ```

## Metrics

With the default configuration, the CSV data format parser creates one metric
for each CSV row, and adds CSV columns as fields in the metric.
A field's data type is automatically determined from its value.

Data format configuration options let you customize how the parser handles
specific CSV rows, columns, and data types.

[Metric filtering](/telegraf/v1/configuration/#metric-filtering) and [aggregator and processor plugins](/telegraf/v1/configure_plugins/aggregator_processor/) provide additional data transformation options--for example:
- Use metric filtering to skip columns and rows.
- Use the [converter processor](https://github.com/influxdata/telegraf/tree/master/plugins/processors/converter/) to convert parsed metadata from tags to fields.

## Timestamps

Every metric has a timestamp--a date and time associated with the fields.
The default timestamp for created metrics is the _current time_ in UTC.

To use extracted values from the CSV as timestamps for metrics, specify
the `csv_timestamp_column` and `csv_timestamp_format` options.

### csv_timestamp_column

The `csv_timestamp_column` option specifies the key (column name) in the CSV data
that contains the time value to extract and use as the timestamp in metrics.

A unix time value may be one of the following data types:

- int64
- float64
- string

If you specify a [Go format](https://go.dev/src/time/format.go) for `csv_timestamp_format`,
values in your timestamp column must be strings.

When using the [`"unix"` format](#csv_timestamp_format), an optional fractional component is allowed.
Other unix time formats, such as `"unix_ms"`, cannot have a fractional component.

### csv_timestamp_format

If specifying `csv_timestamp_column`, you must also specify the format of timestamps in the column.
To specify the format, set `csv_timestamp_format` to one of the following values:

- `"unix"`
- `"unix_ms"`
- `"unix_us"`
- `"unix_ns"`
- a predefined layout from Go [`time` constants](https://pkg.go.dev/time#pkg-constants) using the
  Go _reference time_--for example, `"Mon Jan 2 15:04:05 MST 2006"` (the `UnixDate` format string).

For more information about time formats, see the following:

- Unix time documentation
- Go [time][time parse] package documentation

### Time zone

Telegraf outputs timestamps in UTC.

To parse location-aware timestamps in your data,
specify a [`csv_timestamp_format`](#csv_timestamp_format)
that contains time zone information.

If timestamps in the `csv_timestamp_column` contain a time zone offset, the parser uses the offset to calculate the timestamp in UTC.

If `csv_timestamp_format` and your timestamp data contain a time zone abbreviation, then the parser tries to resolve the abbreviation to a location in the [IANA Time Zone Database](https://www.iana.org/time-zones) and return a UTC offset for that location.
To set the location that the parser should use when resolving time zone abbreviations, specify a value for `csv_timezone`, following the TZ syntax in the [Internet Assigned Numbers Authority time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List).

{{% warn %}}
Prior to Telegraf v1.27, the Telegraf parser ignored abbreviated time zones (for example, "EST") in parsed time values, and used UTC for the timestamp location.
{{% /warn %}}

## Examples

### Extract timestamps from a time column using RFC3339 format

Configuration:

```toml
[agent]
  omit_hostname = true
[[inputs.file]]
  files = ["example"]
  data_format = "csv"
  csv_header_row_count = 1
  csv_measurement_column = "measurement"
  csv_timestamp_column = "time"
  csv_timestamp_format = "2006-01-02T15:04:05Z07:00"
[[outputs.file]]
  files = ["metrics.out"]
  influx_sort_fields = true
```

Input:

```csv
measurement,cpu,time_user,time_system,time_idle,time
cpu,cpu0,42,42,42,2018-09-13T13:03:28Z
```

<!--
```bash
cat <<EOF > telegraf.conf
[agent]
  omit_hostname = true
[[inputs.file]]
  files = ["example"]
  data_format = "csv"
  csv_header_row_count = 1
  csv_measurement_column = "measurement"
  csv_timestamp_column = "time"
  csv_timestamp_format = "2006-01-02T15:04:05Z07:00"
[[outputs.file]]
  files = ["metrics.out"]
  influx_sort_fields = true
EOF

cat <<EOF > example
measurement,cpu,time_user,time_system,time_idle,time
cpu,cpu0,42,42,42,2018-09-13T13:03:28Z
EOF

telegraf --once --config telegraf.conf && cat metrics.out && rm metrics.out
```
-->

Output:

<!--pytest-codeblocks:expected-output-->

```
cpu cpu="cpu0",time_idle=42i,time_system=42i,time_user=42i 1536843808000000000
```

### Parse timestamp abbreviations

The following example specifies `csv_timezone` for resolving an associated time zone (`EST`) in the input data:

Configuration:

```toml
[agent]
  omit_hostname = true
[[inputs.file]]
  files = ["example"]
  data_format = "csv"
  csv_header_row_count = 1
  csv_measurement_column = "measurement"
  csv_timestamp_column = "time"
  csv_timestamp_format = "Mon, 02 Jan 2006 15:04:05 MST"
  csv_timezone = "America/New_York"
[[outputs.file]]
  files = ["metrics.out"]
  influx_sort_fields = true
```

Input:

```csv
measurement,cpu,time_user,time_system,time_idle,time
cpu,cpu1,42,42,42,"Mon, 02 Jan 2006 15:04:05 EST"
cpu,cpu1,42,42,42,"Mon, 02 Jan 2006 15:04:05 GMT"
```

<!--
```bash
cat <<EOF > telegraf.conf
[agent]
  omit_hostname = true
[[inputs.file]]
  files = ["example"]
  data_format = "csv"
  csv_header_row_count = 1
  csv_measurement_column = "measurement"
  csv_timestamp_column = "time"
  csv_timestamp_format = "Mon, 02 Jan 2006 15:04:05 MST"
  csv_timezone = "America/New_York"
[[outputs.file]]
  files = ["metrics.out"]
  influx_sort_fields = true
EOF

cat <<EOF > example
measurement,cpu,time_user,time_system,time_idle,time
cpu,cpu1,42,42,42,"Mon, 02 Jan 2006 15:04:05 EST"
cpu,cpu1,42,42,42,"Mon, 02 Jan 2006 15:04:05 GMT"
EOF

telegraf --once --config telegraf.conf && cat metrics.out && rm metrics.out
```
-->

The parser resolves the `GMT` and `EST` abbreviations and outputs the following:

<!--pytest-codeblocks:expected-output-->

```
cpu cpu="cpu1",time_idle=42i,time_system=42i,time_user=42i 1136232245000000000
cpu cpu="cpu1",time_idle=42i,time_system=42i,time_user=42i 1136214245000000000
```

The timestamps represent the following dates, respectively:

```text
2006-01-02 20:04:05
2006-01-02 15:04:05
```

### Parse metadata into tags

Configuration:

```toml
[agent]
  omit_hostname = true
[[inputs.file]]
  files = ["example"]
  data_format = "csv"
  csv_measurement_column = "measurement"
  csv_metadata_rows = 2
  csv_metadata_separators = [":", "="]
  csv_metadata_trim_set = "# "
  csv_header_row_count = 1
  csv_tag_columns = ["Version","cpu"]
  csv_timestamp_column = "time"
  csv_timestamp_format = "2006-01-02T15:04:05Z07:00"
[[outputs.file]]
  files = ["metrics.out"]
  influx_sort_fields = true
```

Input:

```csv
# Version=1.1
# File Created: 2021-11-17T07:02:45+10:00
Version,measurement,cpu,time_user,time_system,time_idle,time
1.2,cpu,cpu0,42,42,42,2018-09-13T13:03:28Z
```

<!--
```bash
cat <<EOF > telegraf.conf
[agent]
  omit_hostname = true
[[inputs.file]]
  files = ["example"]
  data_format = "csv"
  csv_measurement_column = "measurement"
  csv_metadata_rows = 2
  csv_metadata_separators = [":", "="]
  csv_metadata_trim_set = "# "
  csv_header_row_count = 1
  csv_tag_columns = ["Version","cpu"]
  csv_timestamp_column = "time"
  csv_timestamp_format = "2006-01-02T15:04:05Z07:00"
[[outputs.file]]
  files = ["metrics.out"]
  influx_sort_fields = true
EOF

cat <<EOF > example
# Version=1.1
# File Created: 2021-11-17T07:02:45+10:00
Version,measurement,cpu,time_user,time_system,time_idle,time
1.2,cpu,cpu0,42,42,42,2018-09-13T13:03:28Z
EOF

telegraf --once --config telegraf.conf && cat metrics.out && rm metrics.out
```
-->

Output:

<!--pytest-codeblocks:expected-output-->

```
cpu,File\ Created=2021-11-17T07:02:45+10:00,Version=1.1,cpu=cpu0 time_idle=42i,time_system=42i,time_user=42i 1536843808000000000
```

### Allow tag column values to overwrite parsed metadata

Configuration:

```toml
[agent]
  omit_hostname = true
[[inputs.file]]
  files = ["example"]
  data_format = "csv"
  csv_measurement_column = "measurement"
  csv_metadata_rows = 2
  csv_metadata_separators = [":", "="]
  csv_metadata_trim_set = " #"
  csv_header_row_count = 1
  csv_tag_columns = ["Version","cpu"]
  csv_tag_overwrite = true
  csv_timestamp_column = "time"
  csv_timestamp_format = "2006-01-02T15:04:05Z07:00"
[[outputs.file]]
  files = ["metrics.out"]
  influx_sort_fields = true
```

Input:

```csv
# Version=1.1
# File Created: 2021-11-17T07:02:45+10:00
Version,measurement,cpu,time_user,time_system,time_idle,time
1.2,cpu,cpu0,42,42,42,2018-09-13T13:03:28Z
```

<!--
```bash
cat <<EOF > telegraf.conf
[agent]
  omit_hostname = true
[[inputs.file]]
  files = ["example"]
  data_format = "csv"
  csv_measurement_column = "measurement"
  csv_metadata_rows = 2
  csv_metadata_separators = [":", "="]
  csv_metadata_trim_set = " #"
  csv_header_row_count = 1
  csv_tag_columns = ["Version","cpu"]
  csv_tag_overwrite = true
  csv_timestamp_column = "time"
  csv_timestamp_format = "2006-01-02T15:04:05Z07:00"
[[outputs.file]]
  files = ["metrics.out"]
  influx_sort_fields = true
EOF

cat <<EOF > example
# Version=1.1
# File Created: 2021-11-17T07:02:45+10:00
Version,measurement,cpu,time_user,time_system,time_idle,time
1.2,cpu,cpu0,42,42,42,2018-09-13T13:03:28Z
EOF

telegraf --once --config telegraf.conf && cat metrics.out && rm metrics.out
```
-->

Output:

<!--pytest-codeblocks:expected-output-->

```
cpu,File\ Created=2021-11-17T07:02:45+10:00,Version=1.2,cpu=cpu0 time_idle=42i,time_system=42i,time_user=42i 1536843808000000000
```

### Combine multiple header rows

Configuration:

```toml
[agent]
  omit_hostname = true
[[inputs.file]]
  files = ["example"]
  data_format = "csv"
  csv_comment = "#"
  csv_header_row_count = 2
  csv_measurement_column = "measurement"
  csv_timestamp_column = "time"
  csv_timestamp_format = "2006-01-02T15:04:05Z07:00"
[[outputs.file]]
  ## Files to write to.
  files = ["metrics.out"]
  ## Use determinate ordering.
  influx_sort_fields = true
```

Input:

```csv
# Version=1.1
# File Created: 2021-11-17T07:02:45+10:00
Version,measurement,cpu,time,time,time,time
_system,,,_user,_system,_idle,
1.2,cpu,cpu0,42,42,42,2018-09-13T13:03:28Z
```

<!--
```bash
cat <<EOF > telegraf.conf
[agent]
  omit_hostname = true
[[inputs.file]]
  files = ["example"]
  data_format = "csv"
  csv_comment = "#"
  csv_header_row_count = 2
  csv_measurement_column = "measurement"
  csv_timestamp_column = "time"
  csv_timestamp_format = "2006-01-02T15:04:05Z07:00"
[[outputs.file]]
  ## Files to write to.
  files = ["metrics.out"]
  ## Use determinate ordering.
  influx_sort_fields = true
EOF

cat <<EOF > example
# Version=1.1
# File Created: 2021-11-17T07:02:45+10:00
Version,measurement,cpu,time,time,time,time
_system,,,_user,_system,_idle,
1.2,cpu,cpu0,42,42,42,2018-09-13T13:03:28Z
EOF

telegraf --once --config telegraf.conf && cat metrics.out && rm metrics.out
```
-->

Output:

<!--pytest-codeblocks:expected-output-->

```
cpu Version_system=1.2,cpu="cpu0",time_idle=42i,time_system=42i,time_user=42i 1536843808000000000
```

[time parse]: https://pkg.go.dev/time#Parse
[metric filtering]: /telegraf/v1/configuration/#metric-filtering
