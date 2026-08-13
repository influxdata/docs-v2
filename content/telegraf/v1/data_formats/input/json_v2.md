---
title: JSON v2 input data format
list_title: JSON v2
description: >
  Use the `json_v2` input data format to select values out of JSON documents
  with GJSON paths and map them to Telegraf metric names, tags, fields, and
  timestamps. Includes a complete option reference and worked examples.
menu:
  telegraf_v1_ref:
    name: JSON v2
    parent: Input data formats
weight: 10
related:
  - /telegraf/v1/data_formats/input/json/
  - /telegraf/v1/data_formats/input/xpath_json/
  - /telegraf/v1/configure_plugins/input_plugins/parse-data/
---

Use the `json_v2` input data format to parse a [JSON](https://www.json.org/)
document into Telegraf metrics.
Instead of flattening the whole document like the
[JSON input data format](/telegraf/v1/data_formats/input/json/), you
describe the metrics you want: which values become tags, fields, the
measurement name, and the timestamp.
Values are selected with
[GJSON path syntax](https://github.com/tidwall/gjson/blob/v1.7.5/SYNTAX.md).
Use the [GJSON playground](https://gjson.dev/) to develop and test your
path expressions.

> [!Important]
> We recommend the
> [xpath_json input data format](/telegraf/v1/data_formats/input/xpath_json/)
> over `json_v2` for new configurations, especially when working with
> arrays.
> For a side-by-side comparison of the three JSON parsers, see
> [Choose a JSON parser](/telegraf/v1/data_formats/input/#choose-a-json-parser).

- [Configuration overview](#configuration-overview)
- [Root options](#root-options)
- [Gather single values with field and tag](#gather-single-values-with-field-and-tag)
- [Gather structures with object](#gather-structures-with-object)
- [How arrays and objects become metrics](#how-arrays-and-objects-become-metrics)
- [Types](#types)
- [Examples](#examples)

## Configuration overview

The parser configuration is a `json_v2` sub-table of the input plugin,
containing any number of `field`, `tag`, and `object` sub-tables:

```toml
[[inputs.file]]
  files = ["example.json"]
  data_format = "json_v2"

  [[inputs.file.json_v2]]
    measurement_name = ""       # Measurement name to use
    measurement_name_path = ""  # GJSON path for the measurement name
    timestamp_path = ""         # GJSON path to a single timestamp value
    timestamp_format = ""       # Format of the timestamp value
    timestamp_timezone = ""     # Timezone for the timestamp

    [[inputs.file.json_v2.tag]]
      path = ""                 # GJSON path to a single value or array
      rename = ""               # Rename the resulting tag key
      optional = false          # Suppress errors if the path doesn't match

    [[inputs.file.json_v2.field]]
      path = ""                 # GJSON path to a single value or array
      rename = ""               # Rename the resulting field key
      type = ""                 # Type: int, uint, float, string, bool
      optional = false          # Suppress errors if the path doesn't match

    [[inputs.file.json_v2.object]]
      path = ""                 # GJSON path to an object or array
      optional = false          # Suppress errors if the path doesn't match
      timestamp_key = ""        # JSON key with the timestamp value
      timestamp_format = ""     # Format of the timestamp value
      timestamp_timezone = ""   # Timezone for the timestamp
      tags = []                 # Keys to store as tags instead of fields
      included_keys = []        # Only these keys are included
      excluded_keys = []        # These keys are excluded
      disable_prepend_keys = false  # Don't prefix nested keys with parents

      [inputs.file.json_v2.object.renames]
        # json_key = "new name"
      [inputs.file.json_v2.object.fields]
        # json_key = "int"      # Force a type per key

      [[inputs.file.json_v2.object.tag]]
        path = ""               # GJSON path relative to document root
        rename = ""
      [[inputs.file.json_v2.object.field]]
        path = ""
        rename = ""
        type = ""
```

You can define multiple `json_v2` tables, and multiple `field`, `tag`, and
`object` tables within each.

## Root options

### measurement_name

Sets the measurement name of emitted metrics.

**Type:** string  
**Default:** Not set; the input plugin's default name is used

### measurement_name_path

A GJSON path that sets the measurement name from the JSON input.
The query must return a single value.
If it returns nothing or multiple values, the default measurement name is
used.
Takes precedence over `measurement_name`.

**Type:** string  
**Default:** Not set

### timestamp_path

A GJSON path to a single value that becomes the metric timestamp.
If the query returns nothing, the current time is used.
Requires `timestamp_format`.

**Type:** string  
**Default:** Not set; the current time is used

### timestamp_format

The layout of the value selected by `timestamp_path`.
Use `unix`, `unix_ms`, `unix_us`, `unix_ns`, or a
[Go reference time](https://pkg.go.dev/time#pkg-constants) layout.
For reference-time details, see
[Parse timestamps](/telegraf/v1/configure_plugins/input_plugins/parse-data/#parse-timestamps).

**Type:** string  
**Default:** Not set; required when `timestamp_path` is set

### timestamp_timezone

Timezone for parsed timestamps that don't include an offset.
Use a Unix TZ value, such as `America/New_York`, `Local` to use the system
timezone, or `UTC`.

**Type:** string  
**Default:** `UTC`

## Gather single values with field and tag

`field` and `tag` tables each select a value, or an array of values that
share one name and type, from anywhere in the document:

- If the path returns a **single value**, the parser produces one metric
  containing that field or tag.
- If the path returns an **array of values** (using the GJSON `#`
  character), the parser produces one metric per element.
- If the path returns an **object**, it is ignored.
  Use an [object table](#gather-structures-with-object) instead.
  `field` and `tag` don't preserve relationships between values; each
  table is handled as separate data.

Tag values are always strings.
Field values can be any [line protocol type](#types).

When `field` or `tag` tables are combined with `object` tables, they act as
*global* values: the parser adds them to every metric the object produces,
regardless of where they appear in the document.

### field and tag options

#### path

A GJSON path to a non-array, non-object value, or to an array of such
values.

**Type:** string  
**Default:** None; required

#### rename

A new name for the resulting field or tag key.
If not set, the key defaults to the trailing word of the path.
For example, `device.status.temp` produces the key `temp`.

**Type:** string  
**Default:** Not set

#### type

The type to convert the field value to: `int`, `uint`, `float`, `string`,
or `bool`.
Not available on `tag` tables; tag values are always strings.

**Type:** string  
**Default:** Not set; the JSON type is kept

#### optional

Suppress errors when the path doesn't match the JSON data.
Useful when one input receives documents with different shapes, such as an
MQTT consumer subscribed to multiple topics.
Use with caution: it removes the safety net of verifying the path.

**Type:** boolean  
**Default:** `false`

## Gather structures with object

An `object` table selects an object or array and turns its contents into
one or more metrics.
By default, every key in the object becomes a field.

### object options

The required [`path`](#path) selects the object or array to gather, and
[`optional`](#optional) suppresses errors when the path doesn't match,
both as described for `field` and `tag` tables.
The following options are specific to `object` tables:

#### tags

Keys to store as tags instead of fields.
For a nested key, prepend the parent keys with underscores, for example
`status_code`.
If a listed key is an array or object, all of its nested values become
tags.
Keys listed here don't need to be in `included_keys`.

**Type:** array of strings  
**Default:** `[]`

#### included_keys

If set, only these keys (plus keys in `tags`) are included in the result.
For a nested key, prepend the parent keys with underscores.

**Type:** array of strings  
**Default:** `[]`; everything is included

#### excluded_keys

Keys to drop from the result.
For a nested key, prepend the parent keys with underscores.

**Type:** array of strings  
**Default:** `[]`

#### timestamp_key

A JSON key inside the object whose value becomes the metric timestamp.
For a nested key, prepend the parent keys with underscores.
Requires `timestamp_format` (same values as the
[root option](#timestamp_format)), and `timestamp_timezone` is available
as well.

**Type:** string  
**Default:** Not set

#### disable_prepend_keys

By default, nested keys are named with their parent keys prepended by
underscores: `{"status": {"temp": 1}}` produces the field `status_temp`.
Set to `true` to use the bare key names instead (`temp`).

**Type:** boolean  
**Default:** `false`

> [!Warning]
> With `disable_prepend_keys = true`, nested keys that share a name
> overwrite each other in the resulting metric.

#### renames

A map of JSON keys to new key names.
For nested keys, use the underscore-prepended name on the left side.

**Type:** table  
**Default:** Not set

#### fields

A map of JSON keys to types (`int`, `uint`, `float`, `string`, `bool`).
If a listed key is an array or object, all of its nested values take the
type.

**Type:** table  
**Default:** Not set

#### tag and field sub-tables

An `object` can contain its own `tag` and `field` sub-tables.
They work like the
[top-level tables](#gather-single-values-with-field-and-tag) with two
differences: their paths can select arrays and objects, and the selected
values attach to the object's metrics according to where they sit in the
document structure.
Use them to add specific values by GJSON path instead of listing keys in
`included_keys`.
If a selected value isn't inside the object returned by the object's
`path`, it isn't included.

## How arrays and objects become metrics

Two rules govern how the parser expands data:

- **Array**: every element in an array becomes a *separate* metric.
- **Object**: every key-value in an object becomes part of a *single*
  metric.

The rules apply recursively.
When an object contains multiple arrays, each array element becomes its own
metric that also carries the object's non-array values.
See the [multiple arrays example](#parse-an-object-that-contains-multiple-arrays).

## Types

Type handling follows these rules:

- If a type is explicitly defined (with `type` on a `field` table or the
  `fields` map on an `object` table), the parser enforces it and converts
  the value if possible.
  If the value can't be converted, the parser fails.
- If no type is defined, the value keeps its JSON type: int, float,
  string, or bool.
  Unlike the [JSON input data format](/telegraf/v1/data_formats/input/json/),
  integer JSON numbers stay integers.

Available conversions:

- `int` and `uint`: from bool, float, and numeric strings
- `float`: from integers and numeric strings
- `string`: from any value
- `bool`: from the strings `true` or `false` (any capitalization) and the
  integers `0` or `1`

## Examples

### Select specific values

Build a metric by picking individual values out of a nested document:

```toml
[[inputs.file]]
  files = ["example.json"]
  data_format = "json_v2"

  [[inputs.file.json_v2]]
    measurement_name = "device_status"
    timestamp_path = "ts"
    timestamp_format = "unix"

    [[inputs.file.json_v2.tag]]
      path = "device.name"
      rename = "device"

    [[inputs.file.json_v2.field]]
      path = "device.status.temp"

    [[inputs.file.json_v2.field]]
      path = "device.status.ok"
      type = "bool"
```

Input:

```json
{
    "device": {
        "name": "sensor-1",
        "status": {
            "temp": 22.5,
            "ok": true
        }
    },
    "ts": 1709572232
}
```

Output:

```text
device_status,device=sensor-1 temp=22.5,ok=true 1709572232000000000
```

The field keys default to the trailing word of each path (`temp`, `ok`),
and `rename` changes the tag key from `name` to `device`.

### Parse an array of objects

Use an `object` table to produce one metric per element of an array,
with a timestamp and tags taken from each element:

```toml
[[inputs.file]]
  files = ["example.json"]
  data_format = "json_v2"

  [[inputs.file.json_v2]]
    [[inputs.file.json_v2.object]]
      path = "metrics"
      timestamp_key = "time"
      timestamp_format = "unix"
      tags = ["node"]
      excluded_keys = ["debug"]
```

Input:

```json
{
    "metrics": [
        { "node": "node1", "temp": 32.3, "humidity": 23, "debug": "x", "time": 1678121543},
        { "node": "node2", "temp": 22.6, "humidity": 44, "debug": "y", "time": 1678121543}
    ]
}
```

Output:

```text
file,node=node1 temp=32.3,humidity=23 1678121543000000000
file,node=node2 temp=22.6,humidity=44 1678121543000000000
```

### Parse an object that contains multiple arrays

Every array element becomes its own metric, carrying the object's
non-array values with it:

```toml
[[inputs.file]]
  files = ["example.json"]
  data_format = "json_v2"

  [[inputs.file.json_v2]]
    [[inputs.file.json_v2.object]]
      path = "book"
      tags = ["title"]
      disable_prepend_keys = true
```

Input:

```json
{
    "book": {
        "title": "The Lord Of The Rings",
        "chapters": [
            "A Long-expected Party",
            "The Shadow of the Past"
        ],
        "author": "Tolkien",
        "characters": [
            {
                "name": "Bilbo",
                "species": "hobbit"
            },
            {
                "name": "Frodo",
                "species": "hobbit"
            }
        ],
        "random": [
            1,
            2
        ]
    }
}
```

Output:

```text
file,title=The\ Lord\ Of\ The\ Rings author="Tolkien",chapters="A Long-expected Party"
file,title=The\ Lord\ Of\ The\ Rings author="Tolkien",chapters="The Shadow of the Past"
file,title=The\ Lord\ Of\ The\ Rings author="Tolkien",name="Bilbo",species="hobbit"
file,title=The\ Lord\ Of\ The\ Rings author="Tolkien",name="Frodo",species="hobbit"
file,title=The\ Lord\ Of\ The\ Rings author="Tolkien",random=1
file,title=The\ Lord\ Of\ The\ Rings author="Tolkien",random=2
```

With `disable_prepend_keys = true`, the character fields are `name` and
`species`.
Without it, they would be `characters_name` and `characters_species`.

For more examples, see the
[json_v2 test data](https://github.com/influxdata/telegraf/tree/master/plugins/parsers/json_v2/testdata)
in the Telegraf repository, where each directory contains an input,
a configuration, and the expected output.
