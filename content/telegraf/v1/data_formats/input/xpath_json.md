---
title: XPath JSON input data format
list_title: XPath JSON
description: >
  Use the `xpath_json` input data format and XPath expressions to parse JSON
  into Telegraf metrics. Includes the JSON-to-tree mapping, a complete option
  reference, and verified examples.
menu:
  telegraf_v1_ref:
    name: XPath JSON
    parent: Input data formats
weight: 10
related:
  - /telegraf/v1/data_formats/input/json/
  - /telegraf/v1/data_formats/input/json_v2/
  - /telegraf/v1/configure_plugins/input_plugins/parse-data/
---

Use the `xpath_json` input data format to parse JSON into Telegraf metrics
using [XPath 1.0](https://www.w3.org/TR/xpath/) expressions.
It is the most capable of the three JSON parsers and the recommended choice
for nested documents and arrays.
For a side-by-side comparison, see
[Choose a JSON parser](/telegraf/v1/data_formats/input/#choose-a-json-parser).

`xpath_json` is one of the formats provided by the Telegraf XPath parser.
The same configuration options and query syntax also apply to the
[XML](/telegraf/v1/data_formats/input/xml/),
[MessagePack](/telegraf/v1/data_formats/input/xpath_msgpack/),
[CBOR](/telegraf/v1/data_formats/input/xpath_cbor/), and
[Protocol Buffers](/telegraf/v1/data_formats/input/xpath_protobuf/) input
data formats.
For supported XPath functions, see the
[underlying XPath library](https://github.com/antchfx/xpath).

- [How JSON maps to the query tree](#how-json-maps-to-the-query-tree)
- [Configuration](#configuration)
- [Parser options](#parser-options)
- [Query options](#query-options)
- [Field types](#field-types)
- [Examples](#examples)
- [Troubleshoot queries](#troubleshoot-queries)

## How JSON maps to the query tree

The parser converts the JSON document into an internal tree and runs your
XPath queries against it.
Writing correct queries requires knowing the mapping:

- The document root is `/`.
- **Object keys** become named child nodes.
  In the document below, `/gateway/name` selects `"Main Gateway"`.
- **Array elements** become *unnamed* child nodes of the array's key node.
  Select them with the `*` wildcard: `/sensors/*` selects each element of
  the `sensors` array.
- **Values** become the text content of their node.

For example, the following document:

```json
{
    "gateway": {
        "name": "Main Gateway",
        "location": "building-a"
    },
    "timestamp": 1709572232,
    "sensors": [
        {"id": "sensor-1", "temp": 22.5, "humidity": 41, "active": true},
        {"id": "sensor-2", "temp": 25.1, "humidity": 38, "active": false}
    ]
}
```

produces this tree:

```text
/
├── gateway
│   ├── name        ("Main Gateway")
│   └── location    ("building-a")
├── timestamp       (1709572232)
└── sensors
    ├── *           (id, temp, humidity, active)
    └── *           (id, temp, humidity, active)
```

> [!Important]
> To produce one metric per array element, select the anonymous element
> nodes, not the array key:
> `metric_selection = "/sensors/*"`.
> Selecting `/sensors` or `//sensors` matches the *container* node.
> Relative queries like `id` then silently return nothing, resulting in
> missing tags and fields.

## Configuration

```toml
[[inputs.file]]
  files = ["example.json"]
  data_format = "xpath_json"

  ## Keep native JSON types instead of converting everything to strings.
  ## Applies to batch-selected fields (field_selection).
  # xpath_native_types = false

  ## Allow a parsing section to match nothing without raising an error.
  # xpath_allow_empty_selection = false

  ## Print the internal document when debug logging is enabled.
  # xpath_print_document = false

  ## One or more parsing sections. Each section produces metrics.
  [[inputs.file.xpath]]
    ## Select the nodes that become individual metrics.
    ## If not set, one metric is produced from the document root.
    # metric_selection = "/sensors/*"

    ## Override the measurement name.
    # metric_name = "string('sensors')"

    ## Timestamp query, value format, and timezone.
    # timestamp = "/timestamp"
    # timestamp_format = "unix"
    # timezone = "UTC"

    ## Explicit tag definitions.
    [inputs.file.xpath.tags]
      id = "id"

    ## Explicit integer field definitions.
    [inputs.file.xpath.fields_int]
      humidity = "humidity"

    ## Explicit field definitions.
    ## Set types with XPath functions: number(), boolean(), string().
    [inputs.file.xpath.fields]
      temp = "number(temp)"
      active = "active = 'true'"

    ## Batch field specification (alternative to explicit fields).
    # field_selection = "*"
    # field_name = "name()"
    # field_value = "."
    # field_name_expansion = false

    ## Batch tag specification (alternative to explicit tags).
    # tag_selection = "child::*"
    # tag_name = "name()"
    # tag_value = "."
    # tag_name_expansion = false
```

A configuration can contain multiple `xpath` sections.
Each section runs against the document and produces its own metrics.
Consider using an XPath tester such as
[Code Beautify's XPath Tester](https://codebeautify.org/Xpath-Tester) to
develop and debug your queries.

## Parser options

### xpath_native_types

By default, all fields gathered through `field_selection` are strings.
Set to `true` to keep the native JSON types (number, boolean, string)
instead.
Fields defined in `fields` and `fields_int` are unaffected.
Their types come from the query.

**Type:** boolean  
**Default:** `false`

### xpath_allow_empty_selection

Allow the results of a parsing section to be empty instead of raising an
error.
Useful when not all input documents have the same structure.

**Type:** boolean  
**Default:** `false`

### xpath_print_document

Print the internal document when debug logging is enabled
(`telegraf --debug` or the `debug` agent setting).
Useful for working out queries, especially for non-text formats such as
MessagePack and Protocol Buffers.
Note that the printed XML shows array elements as repeated named elements;
in queries you address them as anonymous children (`key/*`).

**Type:** boolean  
**Default:** `false`

## Query options

### metric_selection

An XPath query that selects the nodes that become individual metrics.
Every matched node produces one metric, and all relative queries in the
section are evaluated relative to it.
To specify an absolute path in a relative context, start the query with
`/`.

If not set, one metric is produced from the document root.

**Type:** string  
**Default:** Not set

### metric_name

An XPath query that sets the measurement name.
To use a literal name, wrap it in the XPath `string()` function, for
example `string('sensors')`.
If not set, the input plugin's default name is used.

**Type:** string  
**Default:** Not set

### timestamp, timestamp_format, and timezone

`timestamp` is an XPath query for the value that becomes the metric time.
If not set, the time of parsing is used.

`timestamp_format` describes the value: `unix`, `unix_ms`, `unix_us`,
`unix_ns`, or a
[Go reference time](https://pkg.go.dev/time#pkg-constants) layout.
If not set, `unix` is assumed.
For reference-time details, see
[Parse timestamps](/telegraf/v1/configure_plugins/input_plugins/parse-data/#parse-timestamps).

`timezone` locates parsed times in a timezone when the value doesn't carry
an offset, such as `2023-03-09 14:04:40`.
Use a Unix TZ value, such as `America/New_York`, `Local` for the system
timezone, or `UTC` (the default).
It is ignored for `unix` formats and for values that already include an
offset.

### tags

Explicit tag definitions in `name = query` format.
Paths can be absolute (starting with `/`) or relative to the node selected
by `metric_selection`.
Tag values are always strings.

### fields

Explicit field definitions in `name = query` format.
The field type is set by the XPath expression:

- `number(...)` produces a float.
- Comparison expressions, such as `active = 'true'`, and `boolean(...)`
  produce a boolean.
- Everything else produces a string.

### fields_int

Explicit integer field definitions in `name = query` format.
XPath has no integer conversion function, so this section is the only way
to produce integer fields.
The conversion fails if the query result isn't convertible to an integer.

### fields_bytes_as_hex and fields_bytes_as_base64

Lists of fields to convert to hex or base64 strings when they contain byte
arrays.
Byte arrays don't occur in JSON input.
These options apply to binary formats such as Protocol Buffers.

**Type:** array of strings  
**Default:** `[]`; byte arrays convert to strings

### field_selection, field_name, and field_value

`field_selection` is an XPath query that selects a *set* of nodes to
become fields, one field per node.
Use it when the field names aren't known in advance or there are too many
to list.

By default, each field is named after its node and takes the node content
as its value.
Override either with the optional `field_name` and `field_value` queries,
which are evaluated relative to each selected node.

Batch-selected field values are strings unless
[`xpath_native_types = true`](#xpath_native_types).
Batch selection can be combined with explicit `fields` and `fields_int`
definitions.
Explicit definitions take precedence on name collisions.

### field_name_expansion

Set to `true` to name batch-selected fields with their full path relative
to the selected node.
Use this when the selected nodes have duplicate names, for example when
selecting all leaf nodes of a subtree.

**Type:** boolean  
**Default:** `false`

### tag_selection, tag_name, tag_value, and tag_name_expansion

Batch tag specification that works like
[`field_selection`](#field_selection-field_name-and-field_value) and
`field_name_expansion`, producing tags instead of fields.

## Field types

Which mechanism controls a field's type:

| Definition | Type behavior |
| --- | --- |
| `fields` with `number(...)` | float |
| `fields` with a comparison or `boolean(...)` | boolean |
| `fields` without conversion | string |
| `fields_int` | integer |
| `field_selection` | string, or native JSON types with `xpath_native_types = true` |

> [!Warning]
> XPath conversion functions always succeed.
> If `number()` receives a non-numeric string, it returns `NaN` instead of
> an error, and Telegraf then drops the field because line protocol doesn't
> support `NaN`.
> If a field is missing from your output, check the Telegraf log for
> `could not serialize field ... is NaN` messages and verify the query
> path.

## Examples

The examples below parse the
[sensor document above](#how-json-maps-to-the-query-tree).

### One metric from selected values

Without `metric_selection`, one metric is produced from the document root.
XPath functions compute values across the document, including counting and
filtering array elements with predicates:

```toml
[[inputs.file]]
  files = ["example.json"]
  data_format = "xpath_json"

  [[inputs.file.xpath]]
    metric_name = "string('gateway')"
    timestamp = "/timestamp"
    timestamp_format = "unix"

    [inputs.file.xpath.tags]
      name = "/gateway/name"

    [inputs.file.xpath.fields_int]
      sensors = "count(/sensors/*)"

    [inputs.file.xpath.fields]
      location = "string(/gateway/location)"
      all_active = "count(/sensors/*[active='true']) = count(/sensors/*)"
```

Output:

```text
gateway,name=Main\ Gateway all_active=false,location="building-a",sensors=2i 1709572232000000000
```

### One metric per array element

Select the anonymous array element nodes with `/sensors/*`.
All relative queries (`id`, `humidity`, `temp`, `active`) are evaluated
against each element, while absolute queries (`/gateway/name`,
`/timestamp`) still reach the rest of the document:

```toml
[[inputs.file]]
  files = ["example.json"]
  data_format = "xpath_json"

  [[inputs.file.xpath]]
    metric_selection = "/sensors/*"
    metric_name = "string('sensor')"
    timestamp = "/timestamp"
    timestamp_format = "unix"

    [inputs.file.xpath.tags]
      id = "id"
      gateway = "/gateway/name"

    [inputs.file.xpath.fields_int]
      humidity = "humidity"

    [inputs.file.xpath.fields]
      temp = "number(temp)"
      active = "active = 'true'"
```

Output:

```text
sensor,gateway=Main\ Gateway,id=sensor-1 active=true,humidity=41i,temp=22.5 1709572232000000000
sensor,gateway=Main\ Gateway,id=sensor-2 active=false,humidity=38i,temp=25.1 1709572232000000000
```

### Batch field selection with native types

When the fields aren't known in advance, select all child nodes of each
array element as fields.
With `xpath_native_types = true`, values keep their JSON types:

```toml
[[inputs.file]]
  files = ["example.json"]
  data_format = "xpath_json"
  xpath_native_types = true

  [[inputs.file.xpath]]
    metric_selection = "/sensors/*"
    metric_name = "string('sensor')"
    timestamp = "/timestamp"
    timestamp_format = "unix"
    field_selection = "*"

    [inputs.file.xpath.tags]
      id = "id"
```

Output:

```text
sensor,id=sensor-1 active=true,humidity=41,id="sensor-1",temp=22.5 1709572232000000000
sensor,id=sensor-2 active=false,humidity=38,id="sensor-2",temp=25.1 1709572232000000000
```

Note that `id` appears as both a tag and a field because `field_selection`
matched it too.
To drop the duplicate field, add
[metric filtering](/telegraf/v1/configuration/filtering/) with
`fieldexclude = ["id"]` to the input plugin.

## Troubleshoot queries

- Run Telegraf with `--test --debug` and
  [`xpath_print_document = true`](#xpath_print_document) to inspect the
  parsed document.
- Missing tags or fields usually mean a relative query doesn't match.
  Check that `metric_selection` selects array *elements* (`/sensors/*`), not the
  array container.
- Missing numeric fields with `could not serialize field ... is NaN` log
  messages mean `number()` received a non-numeric or empty value.
- If documents legitimately vary in structure, set
  [`xpath_allow_empty_selection = true`](#xpath_allow_empty_selection) to
  keep non-matching sections from raising errors.
