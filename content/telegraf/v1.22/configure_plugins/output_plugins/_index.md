---
title: Write data with output plugins
description:
menu:
  telegraf_1_22:

     name: Output plugins
     weight: 20
     parent: Configure plugins
---
Output plugins define where Telegraf will deliver the collected metrics. Send metrics to InfluxDB or to a variety of other datastores, services, and message queues, including Graphite, OpenTSDB, Datadog, Librato, Kafka, MQTT, and NSQ.

For a complete list of output plugins, see [output plugins](({{< latest "telegraf" >}}/plugins/outputs/).


plugin readmes

In addition to output-specific data formats, Telegraf supports the following set of common data formats that may be selected when configuring many of the Telegraf output plugins.
