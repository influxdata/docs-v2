---
title: Write an external plugin
description:
menu:
  telegraf_1_19:
     name: Write an external plugin
     weight: 50
     parent: External plugins
---
Set up your plugin to use it with `execd`.

{{% note %}}
For listed [external plugins](/EXTERNAL_PLUGINS.md), the author of the external plugin is also responsible for the maintenance
and feature development of external plugins.
{{% /note %}}

1. Write your Telegraf plugin. Follow InfluxData's best practices:
   - [Input plugins](https://github.com/influxdata/telegraf/blob/master/docs/INPUTS.md)
   - [Processor plugins](https://github.com/influxdata/telegraf/blob/master/docs/PROCESSORS.md)
   - [Aggregator plugins](https://github.com/influxdata/telegraf/blob/master/docs/AGGREGATORS.md)
   - [Output plugins](https://github.com/influxdata/telegraf/blob/master/docs/OUTPUTS.md)
2. If your plugin is written in Go, follow the steps for the [Execd Go Shim](/telegraf/latest/external_plugins/shim).
3. Add usage and development instructions in the homepage of your repository for running your plugin with its respective `execd` plugin. Refer to [openvpn](https://github.com/danielnelson/telegraf-execd-openvpn#usage) and [awsalarms](https://github.com/vipinvkmenon/awsalarms#installation) for examples.
Include the following steps:
     - How to download the release package for your platform or how to clone the binary for your external plugin
     - Commands to build your binary
     - Location to edit your `telegraf.conf`
     - Configuration to run your external plugin with [inputs.execd](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/execd),
     [processors.execd](/plugins/processors/execd) or [outputs.execd](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/execd)
4. Submit your plugin by opening a PR to add your external plugin to the [/EXTERNAL_PLUGINS.md](https://github.com/influxdata/telegraf/blob/master/EXTERNAL_PLUGINS.md) list. Include the plugin name, a link to the plugin repository and a short description of the plugin.
