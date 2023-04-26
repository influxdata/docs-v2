---
title: InfluxDB Cloud Serverless regions
description: >
  InfluxDB Cloud Serverless is available on multiple cloud providers and in multiple regions.
  Each region has a unique URL and API endpoint.
aliases:
  - /influxdb/cloud-serverless/reference/urls/
weight: 106
menu:
  influxdb_cloud_serverless:
    name: InfluxDB Cloud regions
    parent: Reference
---

InfluxDB Cloud Serverless is available on on the following cloud providers and regions.
Each region has a unique URL and API endpoint.
Use the URLs below to interact with your InfluxDB Cloud Serverless instances with the
[InfluxDB API](/influxdb/cloud-serverless/reference/api/), [InfluxDB client libraries](/influxdb/cloud/api-guide/client-libraries/),
[`influx` CLI](/influxdb/cloud-serverless/reference/cli/influx/), or [Telegraf](/influxdb/cloud-serverless/write-data/use-telegraf/).

{{% note %}}
#### InfluxDB IOx-enabled cloud regions

We are in the process of deploying and enabling the InfluxDB IOx storage engine
on other cloud providers and regions.
{{% /note %}}

<a href="https://www.influxdata.com/influxdb-cloud-2-0-provider-region/" target="_blank" class="btn">Request a cloud region</a>

<!-- ** Uncomment this when we add an IOx region with multiple clusters **

{{% note %}}
#### Regions with multiple clusters
Some InfluxDB Cloud Serverless regions have multiple Cloud clusters, each with a unique URL.
To find your cluster URL, [log in to your InfluxDB Cloud Serverless organization](https://cloud2.influxdata.com)
and review your organization URL. The first subdomain identifies your 
InfluxDB Cloud Serverless cluster. For example:

{{< code-callout "us-west-2-1" >}}
```sh
https://us-west-2-1.aws.cloud2.influxdata.com/orgs/03a2bbf46249a000/...
```
{{< /code-callout >}}

{{% /note %}} -->

{{< cloud_regions type="iox-table" >}}
