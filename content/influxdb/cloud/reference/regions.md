---
title: InfluxDB Cloud regions
description: >
  InfluxDB Cloud is available on multiple cloud providers and in multiple regions.
  Each region has a unique InfluxDB Cloud URL and API endpoint.
aliases:
  - /influxdb/cloud/reference/urls/
weight: 6
menu:
  influxdb_cloud_ref:
    name: InfluxDB Cloud regions
---

InfluxDB Cloud is available on multiple cloud providers and in multiple regions.
Each region has a unique InfluxDB Cloud URL and API endpoint.
Use the URLs below to interact with your InfluxDB Cloud instances with the
[InfluxDB API](/influxdb/cloud/reference/api/), [InfluxDB client libraries](/influxdb/cloud/api-guide/client-libraries/),
[`influx` CLI](/influxdb/cloud/reference/cli/influx/), or [Telegraf](/influxdb/cloud/write-data/no-code/use-telegraf/).

<a href="https://www.influxdata.com/influxdb-cloud-2-0-provider-region/" target="_blank" class="btn">Request a cloud region</a>

{{% note %}}
#### Regions with multiple clusters
Some InfluxDB Cloud regions have multiple InfluxDB clusters, each with a unique URL.
To find out which cluster you're using, [login to your InfluxDB Cloud organization](https://cloud2.influxdata.com)
and look at the URL of your organization. The first subdomain identifies your 
InfluxDB Cloud cluster. For example:

<pre class="highlight">
https://<span class="bp" style="font-weight:bold;margin:0 .15rem">us-west-2-1</span>.aws.cloud2.influxdata.com/orgs/03a2bbf46249a000/...
</pre>
{{% /note %}}

{{< cloud_regions >}}
