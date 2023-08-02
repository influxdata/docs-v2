---
title: Telegraf input data formats
description: Telegraf supports parsing input data formats into Telegraf metrics.
menu:
  telegraf_1_27_ref:

    name: Input data formats
    weight: 1
    parent: Data formats
---

Telegraf contains many general purpose plugins that use a configurable parser for parsing input data into metrics.
This allows input plugins such as the [`kafka_consumer` plugin](/telegraf/v1.27/plugins/#input-kafka_consumer)
to consume and process different data formats, such as InfluxDB line
protocol or JSON.
Telegraf supports the following input **data formats**:

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
  data_format = "json_v2"
```

[metrics]: /telegraf/v1.27/metrics/
