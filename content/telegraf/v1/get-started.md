---
title: Get started with Telegraf
description: >
  Create a Telegraf configuration, start Telegraf, read the metrics it
  collects, and then write metrics to InfluxDB.
menu:
  telegraf_v1:
    name: Get started
weight: 3
aliases:
  - /telegraf/v1/introduction/getting-started/
  - /telegraf/v1/get_started/
related:
  - /telegraf/v1/install/
  - /telegraf/v1/concepts/
  - /telegraf/v1/configuration/
  - /telegraf/v1/plugins/
---

After you [install Telegraf](/telegraf/v1/install/), use this guide to
collect your first metrics:

1. [Create a configuration file](#create-a-configuration-file)
2. [Start Telegraf](#start-telegraf)
3. [Read the output](#read-the-output)
4. [Write metrics to InfluxDB](#write-metrics-to-influxdb)
5. [Go deeper](#go-deeper)

## Create a configuration file

Telegraf requires a configuration file that enables at least one input
plugin to collect data and one output plugin to write data.
This example collects CPU and memory metrics and writes them to standard output.

Use the `telegraf config` command to generate the configuration file:

```bash
telegraf --input-filter cpu:mem --output-filter file config > telegraf.conf
```

The generated file enables the following plugins:

- The [cpu](/telegraf/v1/input-plugins/cpu/) and
  [mem](/telegraf/v1/input-plugins/mem/) input plugins, which collect CPU
  and memory usage from the local system.
- The [file](/telegraf/v1/output-plugins/file/) output plugin, which writes
  metrics to standard output by default.

For the configuration file structure and default file locations, see
[Telegraf configuration file](/telegraf/v1/configuration/file/).

For an overview of how to configure a plugin, watch the following video:

{{< youtube a0js7wiQEJ4 >}}

## Start Telegraf

Start Telegraf and point it at the configuration file:

<!--pytest.mark.skip-->

```bash
telegraf --config telegraf.conf
```

Telegraf prints startup information, including the loaded configuration file
and plugins, and then prints metrics as it collects them.

If you installed Telegraf as a service, start it with your service manager
instead.
For example, on Linux systems with systemd:

<!--pytest.mark.skip-->

```bash
sudo systemctl start telegraf
```

To try a configuration without starting the full pipeline, run Telegraf with
the `--test` flag.
Telegraf collects metrics once, prints them to standard output, and exits:

<!--pytest.mark.skip-->

```bash
telegraf --config telegraf.conf --test
```

## Read the output

By default, Telegraf writes metrics as
[InfluxDB line protocol](/telegraf/v1/data_formats/output/influx/):

```text
cpu,cpu=cpu-total,host=myhost usage_idle=95.8,usage_user=2.1 1717000000000000000
mem,host=myhost used_percent=64.2 1717000000000000000
```

Each line is one metric with a measurement name (`cpu`, `mem`), tags that
identify the source (`cpu`, `host`), fields that hold the measured values
(`usage_idle`, `used_percent`), and a timestamp.
To learn how Telegraf models data, see
[Telegraf metrics](/telegraf/v1/concepts/metrics/).

## Write metrics to InfluxDB

To write metrics to InfluxDB instead of standard output, replace the
`[[outputs.file]]` table in your configuration file with the
[influxdb_v3](/telegraf/v1/output-plugins/influxdb_v3/) output plugin:

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[[outputs.influxdb_v3]]
  urls = ["http://localhost:8181"]
  token = "AUTH_TOKEN"
  database = "DATABASE_NAME"
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your InfluxDB authorization token
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to write your data into

Then restart Telegraf to apply the change.

> [!Note]
> Keep credentials out of the configuration file by referencing an
> [environment variable](/telegraf/v1/configuration/environment-variables/),
> such as `token = "${INFLUX_TOKEN}"`, or by using a
> [secret store](/telegraf/v1/configuration/secrets/).

For other InfluxDB versions, use the
[influxdb](/telegraf/v1/output-plugins/influxdb/) (1.x) or
[influxdb_v2](/telegraf/v1/output-plugins/influxdb_v2/) (2.x and Cloud)
output plugin.

## Go deeper

- Learn the metric model and data pipeline in
  [How Telegraf works](/telegraf/v1/concepts/).
- Explore agent settings, metric filtering, and more in
  [Configure Telegraf](/telegraf/v1/configuration/).
- Browse the [Plugin directory](/telegraf/v1/plugins/) to collect from and
  write to your systems.
- Parse and serialize other formats with
  [data formats](/telegraf/v1/data_formats/).
- Managing a fleet of Telegraf agents? Use
  [Telegraf Controller](/telegraf/controller/) to centrally manage
  configurations and monitor agents.
