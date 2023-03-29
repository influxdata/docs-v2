---
title: InfluxDB Cloud regions
description: >
  InfluxDB Cloud is available on multiple cloud providers and in multiple regions.
  Each region has a unique InfluxDB Cloud URL and API endpoint.
aliases:
  - /influxdb/cloud-iox/reference/urls/
weight: 106
menu:
  influxdb_cloud_iox:
    name: InfluxDB Cloud regions
    parent: Reference
---

InfluxDB Cloud backed by InfluxDB IOx is available on on the following cloud providers and regions.
Each region has a unique InfluxDB Cloud URL and API endpoint.
Use the URLs below to interact with your InfluxDB Cloud instances with the
[InfluxDB API](/influxdb/cloud-iox/reference/api/), [InfluxDB client libraries](/influxdb/cloud/api-guide/client-libraries/),
[`influx` CLI](/influxdb/cloud-iox/reference/cli/influx/), or [Telegraf](/influxdb/cloud-iox/write-data/use-telegraf/).

{{% note %}}
#### InfluxDB IOx-enabled cloud regions

We are in the process of deploying and enabling the InfluxDB IOx storage engine
on other cloud providers and regions.
{{% /note %}}

<a href="https://www.influxdata.com/influxdb-cloud-2-0-provider-region/" target="_blank" class="btn">Request a cloud region</a>

<!-- ** Uncomment this when we add an IOx region with multiple clusters **

{{% note %}}
#### Regions with multiple clusters
Some InfluxDB Cloud regions have multiple Cloud clusters, each with a unique URL.
To find your cluster URL, [log in to your InfluxDB Cloud organization](https://cloud2.influxdata.com)
and review your organization URL. The first subdomain identifies your 
InfluxDB Cloud cluster. For example:

{{< code-callout "us-west-2-1" >}}
```sh
https://us-west-2-1.aws.cloud2.influxdata.com/orgs/03a2bbf46249a000/...
```
{{< /code-callout >}}

{{% /note %}} -->

{{< cloud_regions type="iox-table" >}}
