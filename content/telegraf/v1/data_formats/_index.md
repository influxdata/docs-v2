---
title: Telegraf data formats
list_title: Data formats
description: >
  Telegraf parsers convert incoming data into metrics, and serializers
  convert metrics into output formats. Reference for all supported input
  and output data formats.
menu:
  telegraf_v1_ref:
    name: Data formats
weight: 4
related:
  - /telegraf/v1/configure_plugins/input_plugins/parse-data/
  - /telegraf/v1/configure_plugins/output_plugins/serialize-data/
---

Telegraf supports data formats on both sides of the pipeline:

- **Input data formats (parsers)** convert raw data, such as JSON, CSV, or
  Prometheus exposition format, into Telegraf metrics.
  Input plugins that support parsing provide the `data_format` option to
  select one.
- **Output data formats (serializers)** convert Telegraf metrics into the
  format a destination expects, such as InfluxDB line protocol, JSON, or
  Graphite.
  Output plugins that support serialization provide the `data_format`
  option to select one.

This section is the reference for every format and its options:

{{< children hlevel="h2" >}}

For task-focused guides with worked examples, see
[Parse incoming data](/telegraf/v1/configure_plugins/input_plugins/parse-data/)
and
[Serialize outgoing data](/telegraf/v1/configure_plugins/output_plugins/serialize-data/).
