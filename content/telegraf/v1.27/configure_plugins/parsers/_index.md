---
title: Configure parsers for input plugins
description: |
  Configure parsers used in input plugins to process data.
  Learn about options and schema used by parsers to process input data formats into metrics.
menu:
  telegraf_1_27:
     name: Parsers
     weight: 10
     parent: Configure plugins
---

Telegraf parsers are plugins used by Telegraf [input plugins](/{{< latest "telegraf" >}}/plugins/inputs/) to process input data into metrics.
When you specify a `data_format` in an input plugin configuration, the input plugin uses the associated parser for converting data from its source format into metrics.
Parsers often provide additional configuration options for specifying details about your data schema and how it maps to fields in metrics.

{{< children type="articles" >}}