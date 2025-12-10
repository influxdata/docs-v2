---
title: Write data with output plugins
description: |
  Output plugins define where Telegraf will deliver the collected metrics.
menu:
  telegraf_v1:

     name: Output plugins
     weight: 20
     parent: Configure plugins
related:
  - /telegraf/v1/output-plugins/
---
Output plugins define where Telegraf will deliver the collected metrics. Send metrics to InfluxDB or to a variety of other datastores, services, and message queues, including Graphite, OpenTSDB, Datadog, Librato, Kafka, MQTT, and NSQ.

For a complete list of output plugins and links to their detailed configuration options, see [output plugins](/telegraf/v1/plugins/#output-plugins).

In addition to plugin-specific data formats, Telegraf supports a set of [common data formats](/telegraf/v1/data_formats/output/) available when configuring many of the Telegraf output plugins.
