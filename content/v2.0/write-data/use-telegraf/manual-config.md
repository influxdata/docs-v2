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
Input plugins collect metrics.
Output plugins define destinations where metrics are sent.

_See [Telegraf plugins](/v2.0/reference/telegraf-plugins/) for a complete list of available plugins._

Find the plugin you want to enable (plugins list)
Visit the plugin page on GH
Copy and paste the example config into your telegraf.conf
Restart Telegraf

## Enable and configure the InfluxDB v2 output plugin

To send data to an InfluxDB v2.0 instance, enable in the
[`influxdb_v2` output plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb_v2/README.md)
in the `telegraf.conf`.

Specify the following:

##### urls
An array of URLs for your InfluxDB v2.0 instances.
By default, InfluxDB 2.0 OSS runs on port `9999`.
If using **{{< cloud-name >}}**, see [InfluxDB Cloud URLs](/v2.0/cloud/urls/) for information
about which URLs to use.
**{{< cloud-name "short">}} requires HTTPS**.

##### token
Your InfluxDB v2.0 authorization token.
For information about viewing tokens, see [View tokens](/v2.0/security/tokens/view-tokens/).

{{% note %}}
###### Avoid storing tokens in `telegraf.conf`
We recommend storing your tokens by setting the `INFLUX_TOKEN` environment variable and including the environment variable in your configuration file.

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS or Linux](#)
[Windows](#)
{{% /tabs %}}

{{% tab-content %}}
```sh
export INFLUX_TOKEN=YourAuthenticationToken
```
{{% /tab-content %}}

{{% tab-content %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[PowerShell](#)
[CMD](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```sh
$env:INFLUX_TOKEN = "YourAuthenticationToken"
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```sh
set INFLUX_TOKEN=YourAuthenticationToken
# Make sure to include a space character at the end of this command.
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /tab-content %}}
{{< /tabs-wrapper >}}

_See the [example `telegraf.conf` below](#example-influxdb-v2-configuration)._
{{% /note %}}

##### organization
The name of the organization that owns the target bucket.

##### bucket
The name of the bucket to write data to.

#### Example influxdb_v2 configuration
The example below illustrates `influxdb_v2` configurations that write to InfluxDB OSS or {{< cloud-name >}}.

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB OSS](#)
[{{< cloud-name "short" >}}](#)
{{% /tabs %}}
{{% tab-content %}}
```toml
# ...

[[outputs.influxdb_v2]]
  urls = ["http://localhost:9999"]
  token = "$INFLUX_TOKEN"
  organization = "example-org"
  bucket = "example-bucket"

# ...
```
{{% /tab-content %}}
{{% tab-content %}}

{{% cloud-msg %}}
For the specific URL of your {{< cloud-name "short" >}} instance, see [InfluxDB Cloud URLs](/v2.0/cloud/urls/).
{{% /cloud-msg %}}

```toml
# ...

[[outputs.influxdb_v2]]
  urls = ["https://example.cloud2.influxdata.com"]
  token = "$INFLUX_TOKEN"
  organization = "example-org"
  bucket = "example-bucket"

# ...
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

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
