---
title: Telegraf input data formats
description: Telegraf supports parsing input data formats into Telegraf metrics for InfluxDB Line Protocol, CollectD, CSV, Dropwizard, Graphite, Grok, JSON, Logfmt, Nagios, Value, and Wavefront.
menu:
  telegraf_1_18:
    name: Input data formats
    weight: 1
    parent: Data formats
---

Telegraf contains many general purpose plugins that support parsing input data
using a configurable parser into [metrics][].  This allows, for example, the
`kafka_consumer` input plugin to process messages in either InfluxDB Line
Protocol or in JSON format. Telegraf supports the following input data formats:

{{< children >}}

Any input plugin containing the `data_format` option can use it to select the
desired parser:

```toml
[[inputs.exec]]
  ## Commands array
  commands = ["/tmp/test.sh", "/usr/bin/mycollector --foo=bar"]

  ## measurement name suffix (for separating different commands)
  name_suffix = "_mycollector"

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "json"
```

[metrics]: /telegraf/v1.15/concepts/metrics/
