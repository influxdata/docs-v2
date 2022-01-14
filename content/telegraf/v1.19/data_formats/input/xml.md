---
title: XML input data format
description: Use the XML input data format to parse XML data into Telegraf metrics.
menu:
  telegraf_1_19:
    name: XML
    weight: 110
    parent: Input data formats
---

The XML input data format parses XML data into Telegraf metrics.


## Configuration

```toml
[[inputs.file]]
  files = ["example.xml"]

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "xml"

  ## Multiple parsing sections are allowed
  [[inputs.file.xml]]
    ## Optional: XPath-query to select a subset of nodes from the XML document.
    #metric_selection = "/Bus/child::Sensor"

    ## Optional: XPath-query to set the metric (measurement) name.
    #metric_name = "string('example')"

    ## Optional: Query to extract metric timestamp.
    ## If not specified the time of execution is used.
    #timestamp = "/Gateway/Timestamp"
    ## Optional: Format of the timestamp determined by the query above.
    ## This can be any of "unix", "unix_ms", "unix_us", "unix_ns" or a valid Golang
    ## time format. If not specified, a "unix" timestamp (in seconds) is expected.
    #timestamp_format = "2006-01-02T15:04:05Z"

    ## Tag definitions using the given XPath queries.
    [inputs.file.xml.tags]
      name   = "substring-after(Sensor/@name, ' ')"
      device = "string('the ultimate sensor')"

    ## Integer field definitions using XPath queries.
    [inputs.file.xml.fields_int]
      consumers = "Variable/@consumers"

    ## Non-integer field definitions using XPath queries.
    ## The field type is defined using XPath expressions such as number(), boolean() or string(). If no conversion is performed the field will be of type string.
    [inputs.file.xml.fields]
      temperature = "number(Variable/@temperature)"
      power       = "number(Variable/@power)"
      frequency   = "number(Variable/@frequency)"
      ok          = "Mode != 'ok'"
```
