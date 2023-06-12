---
title: Collect data with input plugins
description: |
  Collect data from a variety of sources with Telegraf input plugins.
menu:
  telegraf_1_27:

     name: Input plugins
     weight: 10
     parent: Configure plugins
---

Telegraf input plugins are used with the InfluxData time series platform to collect metrics from the system, services, or third-party APIs. All metrics are gathered from the inputs you enable and configure in the [Telegraf configuration file](/telegraf/v1.26/configuration/).

For a complete list of input plugins and links to their detailed configuration options, see [input plugins](/{{< latest "telegraf" >}}/plugins/inputs/).

In addition to plugin-specific data formats, Telegraf supports a set of [common data formats](/{{< latest "telegraf" >}}/data_formats/input/) available when configuring many of the Telegraf input plugins.
