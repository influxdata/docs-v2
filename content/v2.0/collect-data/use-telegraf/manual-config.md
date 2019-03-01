---
title: Manually configure Telegraf
seotitle: Manually configure Telegraf for InfluxDB v2.0
description: >
  Manually configure Telegraf to write to InfluxDB v2.0 using Telegraf's `influxdb_v2`
  output plugin, then start Telegraf using the custom configuration.
menu:
  v2_0:
    parent: Use Telegraf
weight: 202
---

Telegraf's `influxdb_v2` output plugin pushes all metrics collected by Telegraf
into an InfluxDB v2.0 bucket.
This article walks through manually configuring Telegraf, enabling the `influxdb_v2`
output plugin, then starting Telegraf using the configuration file.

{{% note %}}
_View the [requirements](/v2.0/collect-data/use-telegraf#requirements)
for using Telegraf with InfluxDB v2.0._
{{% /note %}}

## Configure Telegraf input and output plugins
Configure your Telegraf agents' input and output plugins in your Telegraf configuration file (typically named `telegraf.conf`).
[Input plugins](https://docs.influxdata.com/telegraf/v1.9/plugins/inputs/) collect metrics.
[Output plugins](https://docs.influxdata.com/telegraf/v1.9/plugins/outputs/) define destinations to which metrics are sent.

## Enable and configure the InfluxDB v2 output plugin
To have Telegraf write data to InfluxDB v2.0, enable in the
[`influxdb_v2` output plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb_v2/README.md)
in your `telegraf.conf`.

The following settings are required:

##### urls
An array of URLs for your InfluxDB v2.0 instances.
_By default, InfluxDB runs on port `9999`._

##### token
Your InfluxDB v2.0 authorization token.
For information about viewing tokens, see [View tokens](/v2.0/users/tokens/view-tokens/).

{{% note %}}
A secure alternative to storing your InfluxDB authentication token in plain text in your
`telegraf.conf` is setting the `INFLUX_TOKEN` environment variable and reading it into your config.

```sh
export INFLUX_TOKEN=YourAuthenticationToken
```

_See the [example `telegraf.conf` below](#example-influxdb-v2-configuration)._
{{% /note %}}

##### organization
The name of the organization to which the target bucket belongs.

##### bucket
The name of the bucket to which to write.

#### Example influxdb_v2 configuration
```toml
# ...

[[outputs.influxdb_v2]]
  urls = ["http://localhost:9999"]
  token = "$INFLUX_TOKEN"
  organization = "example-org"
  bucket = "example-bucket"

# ...
```

{{% note %}}
##### Write to InfluxDB v1.x and v2.0
For existing Telegraf agents already writing to an InfluxDB v1.x database,
enabling the InfluxDB v2 output plugin will "dual land" data in your InfluxDB
v1.x and InfluxDB v2.0 instances.
{{% /note %}}

## Start Telegraf
Start the Telegraf service using the `-config` flag to specify the location of your `telegraf.conf`.

```sh
telegraf -config /path/to/custom/telegraf.conf
```
