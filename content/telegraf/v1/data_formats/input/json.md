---
title: JSON input data format
list_title: JSON
description: >
  Use the `json` input data format to parse flat JSON objects, or an array
  of flat objects, into Telegraf metrics. Includes a complete option
  reference and worked examples.
menu:
  telegraf_v1_ref:
    name: JSON
    parent: Input data formats
weight: 10
related:
  - /telegraf/v1/data_formats/input/json_v2/
  - /telegraf/v1/data_formats/input/xpath_json/
  - /telegraf/v1/configure_plugins/input_plugins/parse-data/
---

Use the `json` input data format to parse a [JSON](https://www.json.org/)
object, or an array of objects, into Telegraf metric fields.
It is the simplest of the three JSON parsers and works best for flat data.
For nested objects and arrays, or when you need control over individual
values, compare the parsers in
[Choose a JSON parser](/telegraf/v1/data_formats/input/#choose-a-json-parser).

How this parser reads values:

- **Numbers** become float fields.
- **Strings and booleans are ignored** unless you list the key in
  `tag_keys` (to make it a tag) or `json_string_fields` (to keep it as a
  field).
- **Nested objects** are flattened.
  Keys are joined with underscores, so `{"b": {"c": 6}}` becomes the field
  `b_c`.
- **A top-level array** produces one metric per array element.

- [Configuration](#configuration)
- [Option reference](#option-reference)
- [Examples](#examples)

## Configuration

```toml
[[inputs.file]]
  files = ["example.json"]
  data_format = "json"

  ## When strict is true and a JSON array is being parsed, all objects
  ## within the array must be valid.
  json_strict = true

  ## GJSON path to a subset of the document to parse instead of the
  ## whole document.
  json_query = ""

  ## Keys to store as tags instead of fields.
  ## Supports wildcard glob matching.
  tag_keys = []

  ## String or boolean keys to keep as string fields.
  ## Supports wildcard glob matching.
  json_string_fields = []

  ## Key to use as the measurement name.
  json_name_key = ""

  ## Key containing the metric timestamp, and the format of its value.
  json_time_key = ""
  json_time_format = ""

  ## Timezone for timestamps that don't include an offset.
  json_timezone = ""
```

## Option reference

### json_query

A [GJSON](https://github.com/tidwall/gjson) path that selects a portion of
the document to parse instead of the whole document.
The query runs before any other option is applied, and its result must be a
JSON object or an array of objects.
Use the [GJSON playground](https://gjson.dev/) to develop and debug
queries.

**Type:** string  
**Default:** Not set; the whole document is parsed

### tag_keys

Keys to store as tags instead of fields.
Matching keys are no longer saved as fields.
Supports wildcard glob matching, for example `tags_*`.
Nested keys use their flattened name, for example `b_my_tag`.

**Type:** array of strings  
**Default:** `[]`

### json_string_fields

String or boolean keys to keep as fields.
Without this option, the parser drops all string and boolean values.
Supports wildcard glob matching.
Nested keys use their flattened name, for example `b_my_field`.

**Type:** array of strings  
**Default:** `[]`

### json_name_key

The key whose value becomes the measurement name, replacing the input
plugin's default.

**Type:** string  
**Default:** Not set

### json_time_key

The key containing the timestamp for the metric.
Requires `json_time_format`.
If not set, all metrics use the time the data was parsed.
If set, metrics missing the key or failing to parse it are skipped.

**Type:** string  
**Default:** Not set

### json_time_format

The layout of the value in `json_time_key`.
Use `unix`, `unix_ms`, `unix_us`, `unix_ns`, or a
[Go reference time](https://pkg.go.dev/time#pkg-constants) layout such as
`2006-01-02T15:04:05Z07:00`.
For reference-time details, see
[Parse timestamps](/telegraf/v1/configure_plugins/input_plugins/parse-data/#parse-timestamps).

**Type:** string  
**Default:** Not set; required when `json_time_key` is set

### json_timezone

Timezone for timestamps that don't include an offset, such as
`04/06/2016 12:41:45`.
Use a Unix TZ value, such as `America/New_York`, `Local` to use the system
timezone, or `UTC`.

**Type:** string  
**Default:** `""` (UTC)

### json_strict

When parsing a JSON array, require every object in the array to be valid.
When `false`, the parser skips invalid objects instead of returning an
error.

**Type:** boolean  
**Default:** `true`

## Examples

### Basic parsing

Nested numeric values flatten into underscore-joined field names, and the
string value is dropped:

```toml
[[inputs.file]]
  files = ["example.json"]
  name_override = "myjsonmetric"
  data_format = "json"
```

Input:

```json
{
    "a": 5,
    "b": {
        "c": 6
    },
    "ignored": "I'm a string"
}
```

Output:

```text
myjsonmetric a=5,b_c=6
```

### Set the name, tags, and string fields

Note that the nested string field is referenced by its flattened name,
`b_my_field`:

```toml
[[inputs.file]]
  files = ["example.json"]
  json_name_key = "name"
  tag_keys = ["my_tag_1"]
  json_string_fields = ["b_my_field"]
  data_format = "json"
```

Input:

```json
{
    "a": 5,
    "b": {
        "c": 6,
        "my_field": "description"
    },
    "my_tag_1": "foo",
    "name": "my_json"
}
```

Output:

```text
my_json,my_tag_1=foo a=5,b_c=6,b_my_field="description"
```

### Parse an array of objects

When the document is an array, each object within the array is parsed with
the configured settings and produces its own metric:

```toml
[[inputs.file]]
  files = ["example.json"]
  data_format = "json"
  json_time_key = "b_time"
  json_time_format = "02 Jan 06 15:04 MST"
```

Input:

```json
[
    {
        "a": 5,
        "b": {
            "c": 6,
            "time":"04 Jan 06 15:04 MST"
        }
    },
    {
        "a": 7,
        "b": {
            "c": 8,
            "time":"11 Jan 07 15:04 MST"
        }
    }
]
```

Output:

```text
file a=5,b_c=6 1136387040000000000
file a=7,b_c=8 1168527840000000000
```

### Parse a subset of the document

Use `json_query` to select a nested array of objects.
Values outside the query result are not parsed:

```toml
[[inputs.file]]
  files = ["example.json"]
  data_format = "json"
  tag_keys = ["first"]
  json_string_fields = ["last"]
  json_query = "obj.friends"
```

Input:

```json
{
    "obj": {
        "name": {"first": "Tom", "last": "Anderson"},
        "age":37,
        "children": ["Sara","Alex","Jack"],
        "fav.movie": "Deer Hunter",
        "friends": [
            {"first": "Dale", "last": "Murphy", "age": 44},
            {"first": "Roger", "last": "Craig", "age": 68},
            {"first": "Jane", "last": "Murphy", "age": 47}
        ]
    }
}
```

Output:

```text
file,first=Dale last="Murphy",age=44
file,first=Roger last="Craig",age=68
file,first=Jane last="Murphy",age=47
```

## When to use a different JSON parser

Move to [json_v2](/telegraf/v1/data_formats/input/json_v2/) or
[xpath_json](/telegraf/v1/data_formats/input/xpath_json/) when you need to:

- Keep numbers as integers, or set the type of individual values.
- Select specific values out of nested structures instead of flattening
  everything.
- Produce metrics from arrays nested inside a document.
- Set tags, fields, or names from different levels of the document.

For a side-by-side comparison, see
[Choose a JSON parser](/telegraf/v1/data_formats/input/#choose-a-json-parser).
