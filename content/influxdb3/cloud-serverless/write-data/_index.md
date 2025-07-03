---
title: Write data to InfluxDB
list_title: Write data
description: >
  Collect and write time series data to InfluxDB Cloud Serverless and InfluxDB OSS.
weight: 3
menu:
  influxdb3_cloud_serverless:
    name: Write data
influxdb3/cloud-serverless/tags: [write, line protocol]
related:
  - /influxdb3/cloud-serverless/api/#tag/Write, InfluxDB API /write endpoint
  - /influxdb3/cloud-serverless/reference/syntax/line-protocol
  - /influxdb3/cloud-serverless/reference/cli/influx/write
---

Write data to {{% product-name %}} using the following tools and methods:

> [!Note]
> 
> #### Choose the write endpoint for your workload
> 
> When bringing existing v1 write workloads, use the {{% product-name %}} HTTP API [`/write` endpoint](/influxdb3/cloud-serverless/guides/api-compatibility/v1/).
> When creating new write workloads, use the HTTP API [`/api/v2/write` endpoint](/influxdb3/cloud-serverless/guides/api-compatibility/v2/).

{{< children >}}
