---
title: InfluxDB Cloud Serverless regions
description: >
  InfluxDB Cloud Serverless is available on multiple cloud providers and in multiple regions.
  Each region has a unique URL and API endpoint.
aliases:
  - /influxdb3/cloud-serverless/reference/urls/
weight: 106
menu:
  influxdb3_cloud_serverless:
    name: InfluxDB Cloud regions
    parent: Reference
---

InfluxDB Cloud Serverless is available on on the following cloud providers and regions.
Each region has a unique URL and API endpoint.
Use the URLs below to interact with your InfluxDB Cloud Serverless instances with the
[InfluxDB API](/influxdb3/cloud-serverless/reference/api/),
[InfluxDB client libraries](/influxdb3/cloud-serverless/reference/client-libraries/),
[`influx` CLI](/influxdb3/cloud-serverless/reference/cli/influx/), or
[Telegraf](/influxdb3/cloud-serverless/write-data/use-telegraf/).

> [!Note]
> #### InfluxDB 3 cloud regions
> 
> We are in the process of deploying and enabling the InfluxDB 3 storage engine
> on other cloud providers and regions.

<a href="https://www.influxdata.com/influxdb-cloud-2-0-provider-region/" target="_blank" class="btn">Request a cloud region</a>

<!-- ** Uncomment this when we add a v3 region with multiple clusters **

> [!Note]
> #### Regions with multiple clusters
>
> Some InfluxDB Cloud Serverless regions have multiple Cloud clusters, each with a unique URL.
> To find your cluster URL, [log in to your InfluxDB Cloud Serverless organization](https://cloud2.influxdata.com)
> and review your organization URL. The first subdomain identifies your 
> InfluxDB Cloud Serverless cluster. For example:
> 
> {{< code-callout "us-west-2-1" >}}
```sh
https://us-west-2-1.aws.cloud2.influxdata.com/orgs/03a2bbf46249a000/...
```
{{< /code-callout >}}
-->

{{< cloud_regions type="iox-table" >}}
