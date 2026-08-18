---
title: Collect data with input plugins
description: >
  Configure Telegraf input plugins to collect metrics from systems, services,
  and third-party APIs. Learn the difference between polling and service
  inputs and how to test an input configuration.
menu:
  telegraf_v1:
    name: Input plugins
    parent: Use plugins
weight: 101
related:
  - /telegraf/v1/input-plugins/
  - /telegraf/v1/data_formats/input/
  - /telegraf/v1/configuration/plugin-options/
---

Input plugins collect metrics from systems, services, and third-party APIs.
Telegraf gathers metrics from every input you enable and configure in the
[configuration file](/telegraf/v1/configuration/) and passes them down the
[data pipeline](/telegraf/v1/concepts/data-pipeline/) to your outputs.

- [Choose an input plugin](#choose-an-input-plugin)
- [Configure an input plugin](#configure-an-input-plugin)
- [Polling and service inputs](#polling-and-service-inputs)
- [Test an input configuration](#test-an-input-configuration)

## Choose an input plugin

Telegraf includes input plugins for operating system metrics, databases,
message queues, network services, IoT sensors, and many other sources.
For the complete list, see
[input plugins](/telegraf/v1/input-plugins/) in the plugin directory.

If no plugin exists for your source, you can still collect the data:

- Run any program and collect its output with the
  [exec](/telegraf/v1/input-plugins/exec/) or
  [execd](/telegraf/v1/input-plugins/execd/) plugins.
- Read files with the [file](/telegraf/v1/input-plugins/file/) or
  [tail](/telegraf/v1/input-plugins/tail/) plugins.
- Poll or listen for HTTP with the
  [http](/telegraf/v1/input-plugins/http/) or
  [http_listener_v2](/telegraf/v1/input-plugins/http_listener_v2/) plugins.
- Run a program in any language as an
  [external plugin](/telegraf/v1/configure_plugins/external_plugins/).

## Configure an input plugin

Enable an input plugin by adding its
[table](/telegraf/v1/configuration/toml/#single-tables-and-arrays-of-tables) to
your TOML configuration file.
Each plugin's documentation lists its specific options.
For example, the following configuration collects CPU metrics:

```toml
[[inputs.cpu]]
  ## Report metrics for each CPU in addition to the total.
  percpu = true
  totalcpu = true
```

All input plugins also support a set of common options, including a
per-plugin `interval`, `name_override`, extra `tags`, and
[metric filters](/telegraf/v1/configuration/filtering/).
You can define multiple instances of the same plugin with different options.
See [Common plugin options](/telegraf/v1/configuration/plugin-options/).

## Polling and service inputs

Most input plugins poll.
On each collection interval, Telegraf calls the plugin to gather current
values, such as CPU usage or a database query result.

**Service input plugins** listen instead of polling.
They run continuously and emit metrics as data arrives from sources such as
message queues ([kafka_consumer](/telegraf/v1/input-plugins/kafka_consumer/),
[mqtt_consumer](/telegraf/v1/input-plugins/mqtt_consumer/)), socket
listeners, and webhooks.
The collection interval doesn't apply to service inputs.

## Test an input configuration

Use the `--test` flag to gather metrics once, print them as
[line protocol](/telegraf/v1/concepts/metrics/), and exit:

<!--pytest.mark.skip-->

```bash
telegraf --config telegraf.conf --test
```

Test mode runs inputs, processors, and aggregators, but not outputs, so
nothing is written to your destinations.

Service inputs start in test mode, but Telegraf exits after the one-time
gather before most service inputs receive any data.
Use the `--test-wait` flag to keep Telegraf running long enough for pushed
data to arrive:

<!--pytest.mark.skip-->

```bash
telegraf --config telegraf.conf --test --test-wait 10
```

To run the complete pipeline once, including writing to outputs, use the
`--once` flag instead.
For more troubleshooting techniques, see
[Troubleshoot Telegraf](/telegraf/v1/administer/troubleshoot/).

## Parse incoming data

Input plugins that read raw data, such as files, message queues, and HTTP
responses, use a parser to convert that data into Telegraf metrics.
The following guides show how to work with common incoming data:

{{< children hlevel="h3" >}}
