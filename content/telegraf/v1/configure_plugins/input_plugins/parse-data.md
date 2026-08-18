---
title: Parse incoming data
description: >
  Choose and configure a Telegraf parser to convert raw data, such as CSV and
  JSON, into Telegraf metrics. Includes timestamp format reference and worked
  parsing examples.
menu:
  telegraf_v1:
    name: Parse incoming data
    parent: Input plugins
weight: 201
related:
  - /telegraf/v1/data_formats/input/
  - /telegraf/v1/concepts/metrics/
  - /telegraf/v1/configure_plugins/output_plugins/serialize-data/
---

Telegraf doesn't store raw data internally.
When an input plugin reads raw data, a **parser** converts it into
[Telegraf metrics](/telegraf/v1/concepts/metrics/): a measurement name, tags,
fields, and a timestamp.
Configuring a parser means telling Telegraf how to split your data across
those four parts.

- [Choose a parser](#choose-a-parser)
- [Choose between tags and fields](#choose-between-tags-and-fields)
- [Parse timestamps](#parse-timestamps)
- [Examples](#examples)

## Choose a parser

Input plugins that read raw data support the `data_format` option, which
selects one of the [input data formats](/telegraf/v1/data_formats/input/).
For most formats, such as CSV or Graphite, one parser clearly matches the
data.

### JSON parsers

JSON is the exception.
Three parsers read JSON data, and choosing the right one depends on the
structure of your data:

- [`json`](/telegraf/v1/data_formats/input/json/): best for flat JSON data.
  If the JSON contains nested objects or arrays of objects, use one of the
  other two parsers.
- [`json_v2`](/telegraf/v1/data_formats/input/json_v2/): parses JSON objects
  and handles more advanced cases at the cost of additional configuration.
- [`xpath_json`](/telegraf/v1/data_formats/input/xpath_json/): the most
  capable of the three.
  Despite the XML association of the name, it selects JSON values using
  XPath expressions.
  We recommend `xpath_json` over `json_v2` for new
  configurations, especially when working with arrays.

For a side-by-side comparison, see
[Choose a JSON parser](/telegraf/v1/data_formats/input/#choose-a-json-parser).

## Choose between tags and fields

Tags are values you want to search or group by, and are always strings.
Fields hold the raw data values, such as numeric readings.
Telegraf treats parsed data as fields unless you configure it as a tag.
For guidance, see
[tags versus fields](/telegraf/v1/concepts/metrics/).

## Parse timestamps

To parse a timestamp, tell the parser which part of the data holds the
timestamp and what format the timestamp uses.
If you don't, Telegraf assigns the time the data was read.

### Unix timestamps

| Timestamp             | Timestamp format |
| --------------------- | ---------------- |
| `1709572232`          | `unix`           |
| `1709572232123`       | `unix_ms`        |
| `1709572232123456`    | `unix_us`        |
| `1709572232123456789` | `unix_ns`        |

Unix timestamps are always in UTC.
There is no concept of a timezone for a Unix timestamp.

Some devices report a Unix-style numeric timestamp in the device's local
timezone instead of UTC.
The `timestamp_tz` formats handle this case by computing the offset between
a configured local timezone and UTC:

| Timestamp             | Timestamp format  |
| --------------------- | ----------------- |
| `1709572232`          | `timestamp_tz`    |
| `1709572232123`       | `timestamp_tz_ms` |
| `1709572232123456`    | `timestamp_tz_us` |
| `1709572232123456789` | `timestamp_tz_ns` |

For an example, see
[Parse CSV data with a local timestamp](#parse-csv-data-with-a-local-timestamp).

### Named timestamp formats

| Timestamp                             | Named format  |
| ------------------------------------- | ------------- |
| `Mon Jan _2 15:04:05 2006`            | `ANSIC`       |
| `Mon Jan _2 15:04:05 MST 2006`        | `UnixDate`    |
| `Mon Jan 02 15:04:05 -0700 2006`      | `RubyDate`    |
| `02 Jan 06 15:04 MST`                 | `RFC822`      |
| `02 Jan 06 15:04 -0700`               | `RFC822Z`     |
| `Monday, 02-Jan-06 15:04:05 MST`      | `RFC850`      |
| `Mon, 02 Jan 2006 15:04:05 MST`       | `RFC1123`     |
| `Mon, 02 Jan 2006 15:04:05 -0700`     | `RFC1123Z`    |
| `2006-01-02T15:04:05Z07:00`           | `RFC3339`     |
| `2006-01-02T15:04:05.999999999Z07:00` | `RFC3339Nano` |
| `Jan _2 15:04:05`                     | `Stamp`       |
| `Jan _2 15:04:05.000`                 | `StampMilli`  |
| `Jan _2 15:04:05.000000`              | `StampMicro`  |
| `Jan _2 15:04:05.000000000`           | `StampNano`   |

### Custom timestamp formats

If your timestamp doesn't match a Unix or named format, specify a custom
format using [Go reference time](https://pkg.go.dev/time#pkg-constants)
notation.
In Go reference time, you describe your format by writing the specific
reference moment, `Mon Jan 2 15:04:05 MST 2006`, in your data's layout:

| Timestamp                     | Go reference time                |
| ----------------------------- | -------------------------------- |
| `2024-03-04T17:10:32`         | `2006-01-02T15:04:05`            |
| `04 Mar 24 10:10 -0700`       | `02 Jan 06 15:04 -0700`          |
| `2024-03-04T10:10:32Z07:00`   | `2006-01-02T15:04:05Z07:00`      |
| `2024-03-04 17:10:32.123+00`  | `2006-01-02 15:04:05.999+00`     |
| `2024-03-04T10:10:32.123456Z` | `2006-01-02T15:04:05.000000Z`    |
| `2024-03-04T10:10:32.123456Z` | `2006-01-02T15:04:05.999999999Z` |

For fractional seconds, use either `9`s or `0`s.
A `0` requires a digit at that position, while `9`s match digits only if
they are present.

> [!Warning]
> Timezone abbreviations are ambiguous.
> For example, `MST` can stand for either Mountain Standard Time (UTC-07)
> or Malaysia Standard Time (UTC+08).
> Avoid abbreviated timezones in your data when possible.

## Examples

The following examples show a sample of incoming data, the parser
configuration, and the resulting metrics in line protocol.

### Parse CSV data

Given the following CSV data:

```csv
node,temp,humidity,alarm,time
node1,32.3,23,false,2023-03-06T16:52:23Z
node2,22.6,44,false,2023-03-06T16:52:23Z
node3,17.9,56,true,2023-03-06T16:52:23Z
```

The following configuration names the columns, stores `node` as a tag, and
parses the `time` column with a custom timestamp format:

```toml
[[inputs.file]]
  files = ["test.csv"]
  data_format = "csv"

  csv_header_row_count = 1
  csv_column_names = ["node","temp","humidity","alarm","time"]
  csv_tag_columns = ["node"]
  csv_timestamp_column = "time"
  csv_timestamp_format = "2006-01-02T15:04:05Z"
```

Telegraf produces the following metrics:

```text
file,node=node1 temp=32.3,humidity=23i,alarm=false 1678121543000000000
file,node=node2 temp=22.6,humidity=44i,alarm=false 1678121543000000000
file,node=node3 temp=17.9,humidity=56i,alarm=true 1678121543000000000
```

For all CSV parser options, see the
[CSV input data format](/telegraf/v1/data_formats/input/csv/).

### Parse CSV data with a local timestamp

Given the following CSV data, where the `time` column holds a Unix-style
timestamp in the device's local timezone rather than UTC:

```csv
node,temp,humidity,alarm,time
node1,32.3,23,false,1568338208
node2,22.6,44,false,1568338208
```

The following configuration uses the `timestamp_tz` format and names the
timezone the device reports in:

```toml
[[inputs.file]]
  files = ["test.csv"]
  data_format = "csv"

  csv_header_row_count = 1
  csv_column_names = ["node","temp","humidity","alarm","time"]
  csv_tag_columns = ["node"]
  csv_timestamp_column = "time"
  csv_timestamp_format = "timestamp_tz"
  csv_timezone = "Pacific/Fiji"
```

Telegraf produces the following metrics:

```text
file,node=node1 temp=32.3,humidity=23i,alarm=false 1568295008000000000
file,node=node2 temp=22.6,humidity=44i,alarm=false 1568295008000000000
```

Telegraf interprets the raw value as `Pacific/Fiji` local time (UTC+12), so
the resulting UTC timestamp is 12 hours earlier than the raw value.

### Parse flat JSON data

Given the following flat JSON data:

```json
{ "node": "node", "temp": 32.3, "humidity": 23, "alarm": false, "time": "1709572232123456789"}
```

The `json` parser handles flat data directly:

```toml
[[inputs.file]]
  files = ["test.json"]
  precision = "1ns"
  data_format = "json"

  tag_keys = ["node"]
  json_time_key = "time"
  json_time_format = "unix_ns"
```

Telegraf produces the following metric:

```text
file,node=node temp=32.3,humidity=23 1709572232123456789
```

The `json` parser reads only numeric values as fields.
The boolean `alarm` value is dropped.
To include strings and booleans, use the `json_string_fields` option or one
of the other JSON parsers.

### Parse JSON objects

Given the following JSON data, where each element of the `metrics` array
should become its own metric:

```json
{
    "metrics": [
        { "node": "node1", "temp": 32.3, "humidity": 23, "alarm": "false", "time": "1678121543"},
        { "node": "node2", "temp": 22.6, "humidity": 44, "alarm": "false", "time": "1678121543"},
        { "node": "node3", "temp": 17.9, "humidity": 56, "alarm": "true", "time": "1678121543"}
    ]
}
```

The `json_v2` parser selects the array with `path` and controls the type of
each value:

```toml
[[inputs.file]]
  files = ["test.json"]
  data_format = "json_v2"

  [[inputs.file.json_v2]]
    [[inputs.file.json_v2.object]]
      path = "metrics"
      timestamp_key = "time"
      timestamp_format = "unix"
      [[inputs.file.json_v2.object.tag]]
        path = "#.node"
      [[inputs.file.json_v2.object.field]]
        path = "#.temp"
        type = "float"
      [[inputs.file.json_v2.object.field]]
        path = "#.humidity"
        type = "int"
      [[inputs.file.json_v2.object.field]]
        path = "#.alarm"
        type = "bool"
```

Telegraf produces the following metrics:

```text
file,node=node1 temp=32.3,humidity=23i,alarm=false 1678121543000000000
file,node=node2 temp=22.6,humidity=44i,alarm=false 1678121543000000000
file,node=node3 temp=17.9,humidity=56i,alarm=true 1678121543000000000
```

For a complete walkthrough of the `json_v2` parser against a live API, see
[Collect JSON data from an HTTP API](/telegraf/v1/examples/collect-json-http-api/).

### Parse JSON with XPath expressions

Given the following JSON data, structured as name, tags, fields, and
timestamp:

```json
{
  "fields": {"temp": 32.3, "humidity": 23, "alarm": false},
  "name": "measurement",
  "tags": {"node": "node1"},
  "time": "2024-03-04T10:10:32.123456Z"
}
```

The `xpath_json` parser maps each part of the document with an XPath
expression:

```toml
[[inputs.file]]
  files = ["test.json"]
  precision = "1us"
  data_format = "xpath_json"

  [[inputs.file.xpath]]
    metric_name = "/name"
    field_selection = "fields/*"
    tag_selection = "tags/*"
    timestamp = "/time"
    timestamp_format = "2006-01-02T15:04:05.999999999Z"
```

Telegraf produces the following metric:

```text
measurement,node=node1 alarm="false",humidity="23",temp="32.3" 1709547032123456000
```

XPath selections return strings by default, so the fields above are string
values.
Use the `field_selection` type options described in the
[xpath_json input data format](/telegraf/v1/data_formats/input/xpath_json/)
to convert field types.

## Next steps

- For all parsers and their options, see
  [input data formats](/telegraf/v1/data_formats/input/).
- To convert metrics into a specific output format, see
  [Serialize outgoing data](/telegraf/v1/configure_plugins/output_plugins/serialize-data/).
