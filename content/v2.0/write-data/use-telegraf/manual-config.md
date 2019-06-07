---
title: Manually configure Telegraf
seotitle: Manually configure Telegraf for InfluxDB v2.0
description: >
  Update existing or create new Telegraf configurations to use the `influxdb_v2`
  output plugin to write to InfluxDB v2.0.
  Start Telegraf using the custom configuration.
aliases:
  - /v2.0/collect-data/use-telegraf/manual-config
menu:
  v2_0:
    parent: Use Telegraf
weight: 202
---

Use the Telegraf `influxdb_v2` output plugin to collect and write metrics into an InfluxDB v2.0 bucket.
This article describes how to enable the `influxdb_v2` output plugin in new and existing Telegraf configurations,
then start Telegraf using the custom configuration file.

{{% note %}}
_View the [requirements](/v2.0/write-data/use-telegraf#requirements)
for using Telegraf with InfluxDB v2.0._
{{% /note %}}

## Configure Telegraf input and output plugins
Configure Telegraf input and output plugins in the Telegraf configuration file (typically named `telegraf.conf`).
Input plugins collect metrics. Output plugins define destinations where metrics are sent.

_See [Telegraf plugins](/v2.0/reference/telegraf-plugins/) for a complete list of available plugins._

## Enable and configure the InfluxDB v2 output plugin
To send data to an InfluxDB v2.0 instance, enable in the
[`influxdb_v2` output plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb_v2/README.md)
in the `telegraf.conf`.

Specify the following:

##### urls
An array of URLs for your InfluxDB v2.0 instances.
_By default, InfluxDB runs on port `9999`._

{{% cloud-msg %}}
To write data to an {{< cloud-name "short" >}} instance, use the URL of your {{< cloud-name "short" >}}
user interface (UI).
For example: <code>https:<nolink>//us-west-2-1.aws.cloud2.influxdata.com</code>
{{% /cloud-msg %}}

##### token
Your InfluxDB v2.0 authorization token.
For information about viewing tokens, see [View tokens](/v2.0/security/tokens/view-tokens/).

{{% note %}}
#### Avoid storing tokens in plain text
InfluxData does not recommend storing authentication tokens in plain text in the `telegraf.conf`.
A secure alternative is to set the `INFLUX_TOKEN` environment variable and include
it into your configuration file.

```sh
export INFLUX_TOKEN=YourAuthenticationToken
```

_See the [example `telegraf.conf` below](#example-influxdb-v2-configuration)._
{{% /note %}}

##### organization
The name of the organization that owns the target bucket.

##### bucket
The name of the bucket to write data to.

#### Example influxdb_v2 configuration
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[InfluxDB OSS](#)
[{{< cloud-name "short" >}}](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```toml
# ...

[[outputs.influxdb_v2]]
  urls = ["http://localhost:9999"]
  token = "$INFLUX_TOKEN"
  organization = "example-org"
  bucket = "example-bucket"

# ...
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
# ...

[[outputs.influxdb_v2]]
  urls = ["https://us-west-2-1.aws.cloud2.influxdata.com"]
  token = "$INFLUX_TOKEN"
  organization = "example-org"
  bucket = "example-bucket"

# ...
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% note %}}
##### Write to InfluxDB v1.x and v2.0
If a Telegraf agent is already writing to an InfluxDB v1.x database,
enabling the InfluxDB v2 output plugin will write data to both v1.x and v2.0 instances.
{{% /note %}}

## Start Telegraf
Start the Telegraf service using the `-config` flag to specify the location of your `telegraf.conf`.

```sh
telegraf -config /path/to/custom/telegraf.conf
```
