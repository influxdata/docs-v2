---
title: XML input data format
list_title: XML
description: >
  Use the `xml` input data format and XPath expressions to parse XML data
  into Telegraf metrics.
menu:
  telegraf_v1_ref:
    name: XML
    parent: Input data formats
weight: 10
related:
  - /telegraf/v1/data_formats/input/xpath_json/
  - /telegraf/v1/configure_plugins/input_plugins/parse-data/
---

Use the `xml` input data format to parse XML data into Telegraf metrics
using [XPath 1.0](https://www.w3.org/TR/xpath/) expressions.

`xml` is one of the formats provided by the Telegraf XPath parser.
It shares its configuration options and query syntax with the
[XPath JSON input data format](/telegraf/v1/data_formats/input/xpath_json/).
See that page for the complete option reference, including batch field and
tag selection and the parser-level options.
For supported XPath functions, see the
[underlying XPath library](https://github.com/antchfx/xpath).

> [!Note]
> The parser configuration section is named `xpath` for all formats in the
> XPath parser family, including XML.
> For example, use `[[inputs.file.xpath]]` with `data_format = "xml"`.

## Configuration

```toml
[[inputs.file]]
  files = ["example.xml"]
  data_format = "xml"

  ## Multiple parsing sections are allowed
  [[inputs.file.xpath]]
    ## Optional: XPath-query to select a subset of nodes from the XML document.
    # metric_selection = "/Bus/child::Sensor"

    ## Optional: XPath-query to set the metric (measurement) name.
    # metric_name = "string('example')"

    ## Optional: Query to extract metric timestamp.
    ## If not specified the time of execution is used.
    # timestamp = "/Gateway/Timestamp"
    ## Optional: Format of the timestamp determined by the query above.
    ## This can be any of "unix", "unix_ms", "unix_us", "unix_ns" or a valid
    ## Golang time format. If not specified, "unix" is expected.
    # timestamp_format = "2006-01-02T15:04:05Z"

    ## Tag definitions using the given XPath queries.
    [inputs.file.xpath.tags]
      name = "substring-after(Sensor/@name, ' ')"

    ## Integer field definitions using XPath queries.
    [inputs.file.xpath.fields_int]
      consumers = "Variable/@consumers"

    ## Non-integer field definitions using XPath queries.
    ## Set types with XPath functions: number(), boolean(), string().
    [inputs.file.xpath.fields]
      temperature = "number(Variable/@temperature)"
      ok = "Mode != 'error'"
```

## Examples

The following `example.xml` document is used in the examples below:

```xml
<?xml version="1.0"?>
<Gateway>
  <Name>Main Gateway</Name>
  <Timestamp>2020-08-01T15:04:03Z</Timestamp>
  <Sequence>12</Sequence>
  <Status>ok</Status>
</Gateway>

<Bus>
  <Sensor name="Sensor Facility A">
    <Variable temperature="20.0"/>
    <Variable power="123.4"/>
    <Variable frequency="49.78"/>
    <Variable consumers="3"/>
    <Mode>busy</Mode>
  </Sensor>
  <Sensor name="Sensor Facility B">
    <Variable temperature="23.1"/>
    <Variable power="14.3"/>
    <Variable frequency="49.78"/>
    <Variable consumers="1"/>
    <Mode>standby</Mode>
  </Sensor>
  <Sensor name="Sensor Facility C">
    <Variable temperature="19.7"/>
    <Variable power="0.02"/>
    <Variable frequency="49.78"/>
    <Variable consumers="0"/>
    <Mode>error</Mode>
  </Sensor>
</Bus>
```

### Basic parsing

Without `metric_selection`, one metric is produced from the document root
using explicit tag and field definitions:

```toml
[[inputs.file]]
  files = ["example.xml"]
  data_format = "xml"

  [[inputs.file.xpath]]
    [inputs.file.xpath.tags]
      gateway = "substring-before(/Gateway/Name, ' ')"

    [inputs.file.xpath.fields_int]
      seqnr = "/Gateway/Sequence"

    [inputs.file.xpath.fields]
      ok = "/Gateway/Status = 'ok'"
```

Output:

```text
file,gateway=Main,host=Hugin seqnr=12i,ok=true 1598610830000000000
```

The XPath function `substring-before()` extracts the sub-string before the
space in the gateway name.
Because XPath has no integer conversion function, the `fields_int` section
produces the integer `seqnr` field, and the `ok` field is a boolean
produced by comparing `/Gateway/Status` to the string `ok`.

### Time and metric names from the document

The metric name and timestamp can come from the document itself:

```toml
[[inputs.file]]
  files = ["example.xml"]
  data_format = "xml"

  [[inputs.file.xpath]]
    metric_name = "name(/Gateway/Status)"

    timestamp = "/Gateway/Timestamp"
    timestamp_format = "2006-01-02T15:04:05Z"

    [inputs.file.xpath.tags]
      gateway = "substring-before(/Gateway/Name, ' ')"

    [inputs.file.xpath.fields]
      ok = "/Gateway/Status = 'ok'"
```

Output:

```text
Status,gateway=Main,host=Hugin ok=true 1596294243000000000
```

### One metric per selected node

Use `metric_selection` to produce one metric per matched node.
All relative queries are evaluated against each selected node, while the
timestamp query stays relative to the document root:

```toml
[[inputs.file]]
  files = ["example.xml"]
  data_format = "xml"

  [[inputs.file.xpath]]
    metric_selection = "/Bus/child::Sensor"
    metric_name = "string('sensors')"

    timestamp = "/Gateway/Timestamp"
    timestamp_format = "2006-01-02T15:04:05Z"

    [inputs.file.xpath.tags]
      name = "substring-after(@name, ' ')"

    [inputs.file.xpath.fields_int]
      consumers = "Variable/@consumers"

    [inputs.file.xpath.fields]
      temperature = "number(Variable/@temperature)"
      power       = "number(Variable/@power)"
      frequency   = "number(Variable/@frequency)"
      ok          = "Mode != 'error'"
```

Output:

```text
sensors,host=Hugin,name=Facility\ A consumers=3i,frequency=49.78,ok=true,power=123.4,temperature=20 1596294243000000000
sensors,host=Hugin,name=Facility\ B consumers=1i,frequency=49.78,ok=true,power=14.3,temperature=23.1 1596294243000000000
sensors,host=Hugin,name=Facility\ C consumers=0i,frequency=49.78,ok=false,power=0.02,temperature=19.7 1596294243000000000
```

### Batch field processing

When fields aren't known in advance, use `field_selection` to derive them
from the document.
The `field_name` and `field_value` queries determine each field's name and
value from the first attribute of each selected node:

```toml
[[inputs.file]]
  files = ["example.xml"]
  data_format = "xml"

  [[inputs.file.xpath]]
    metric_selection = "/Bus/child::Sensor"
    metric_name = "string('sensors')"

    timestamp = "/Gateway/Timestamp"
    timestamp_format = "2006-01-02T15:04:05Z"

    field_selection = "child::Variable"
    field_name = "name(@*[1])"
    field_value = "number(@*[1])"

    [inputs.file.xpath.tags]
      name = "substring-after(@name, ' ')"
```

Output:

```text
sensors,host=Hugin,name=Facility\ A consumers=3,frequency=49.78,power=123.4,temperature=20 1596294243000000000
sensors,host=Hugin,name=Facility\ B consumers=1,frequency=49.78,power=14.3,temperature=23.1 1596294243000000000
sensors,host=Hugin,name=Facility\ C consumers=0,frequency=49.78,power=0.02,temperature=19.7 1596294243000000000
```

Batch-selected field values are strings unless converted in the
`field_value` query or, for formats that carry type information, with
[`xpath_native_types`](/telegraf/v1/data_formats/input/xpath_json/#xpath_native_types).
