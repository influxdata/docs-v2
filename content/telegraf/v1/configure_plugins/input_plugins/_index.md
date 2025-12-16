---
title: Collect data with input plugins
description: |
  Collect data from a variety of sources with Telegraf input plugins.
menu:
  telegraf_v1:

     name: Input plugins
     weight: 10
     parent: Configure plugins
related:
  - /telegraf/v1/input-plugins/
---

Telegraf input plugins are used with the InfluxData time series platform to collect metrics from the system, services, or third-party APIs. All metrics are gathered from the inputs you enable and configure in the [Telegraf configuration file](/telegraf/v1/configuration/).

For a complete list of input plugins and links to their detailed configuration options, see [input plugins](/telegraf/v1/plugins/#input-plugins).

In addition to plugin-specific data formats, Telegraf supports a set of [common data formats](/telegraf/v1/data_formats/input/) available when configuring many of the Telegraf input plugins.
