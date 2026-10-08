---
title: Write an external plugin
description: >
  Write a Telegraf external plugin in any language, run it through an execd
  plugin, and submit it to the community external plugin list.
menu:
  telegraf_v1:
    name: Write an external plugin
    parent: External plugins
weight: 202
related:
  - /telegraf/v1/input-plugins/execd/
  - /telegraf/v1/processor-plugins/execd/
  - /telegraf/v1/output-plugins/execd/
---

Set up your plugin to use it with `execd`.

> [!Note]
> For listed
> [external plugins](https://github.com/influxdata/telegraf/blob/master/EXTERNAL_PLUGINS.md),
> the author of the external plugin is responsible for the maintenance and
> feature development of the plugin.
> Expect users to open issues on the plugin's own GitHub repository.

1. Write your Telegraf plugin.
   Follow InfluxData's best practices for the plugin type:
   - [Input plugins](https://github.com/influxdata/telegraf/blob/master/docs/INPUTS.md)
   - [Processor plugins](https://github.com/influxdata/telegraf/blob/master/docs/PROCESSORS.md)
   - [Aggregator plugins](https://github.com/influxdata/telegraf/blob/master/docs/AGGREGATORS.md)
   - [Output plugins](https://github.com/influxdata/telegraf/blob/master/docs/OUTPUTS.md)
2. If your plugin is written in Go, follow the steps to
   [use the `execd` shim](/telegraf/v1/configure_plugins/external_plugins/shim/).
3. Add usage and development instructions in the homepage of your
   repository for running your plugin with its respective `execd` plugin.
   Refer to
   [openvpn](https://github.com/danielnelson/telegraf-execd-openvpn#usage)
   and [awsalarms](https://github.com/vipinvkmenon/awsalarms#installation)
   for examples.
   Include the following steps:
   - How to download the release package for your platform or how to clone
     the binary for your external plugin
   - Commands to build your binary
   - Location to edit your `telegraf.conf`
   - Configuration to run your external plugin with
     [inputs.execd](/telegraf/v1/input-plugins/execd/),
     [processors.execd](/telegraf/v1/processor-plugins/execd/), or
     [outputs.execd](/telegraf/v1/output-plugins/execd/)
4. Submit your plugin by opening a PR to add it to the
   [external plugins list](https://github.com/influxdata/telegraf/blob/master/EXTERNAL_PLUGINS.md).
   Include the plugin name, a link to the plugin repository, and a short
   description of the plugin.
