---
title: Use Telegraf plugins
description: >
  Use Telegraf plugins to collect metrics from a variety of sources, transform
  them, and write them to your destinations.
menu:
  telegraf_v1:
    name: Use plugins
weight: 6
related:
  - /telegraf/v1/plugins/
  - /telegraf/v1/concepts/
  - /telegraf/v1/configuration/
---

Telegraf plugins collect, transform, and write metrics.
Input plugins collect metrics, processor and aggregator plugins transform them,
and output plugins write them to your destinations.

The guides in this section show how to configure and combine each plugin type:

{{< children hlevel="h2" >}}

For the complete list of available plugins, see the
[Plugin directory](/telegraf/v1/plugins/).
To learn how metrics move through the Telegraf data pipeline, see
[How Telegraf works](/telegraf/v1/concepts/).
