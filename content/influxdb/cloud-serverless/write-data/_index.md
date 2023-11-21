---
title: Write data to InfluxDB
list_title: Write data
description: >
  Collect and write time series data to InfluxDB Cloud Serverless and InfluxDB OSS.
weight: 3
menu:
  influxdb_cloud_serverless:
    name: Write data
influxdb/cloud-serverless/tags: [write, line protocol]
related:
  - /influxdb/cloud-serverless/api/#tag/Write, InfluxDB API /write endpoint
  - /influxdb/cloud-serverless/reference/syntax/line-protocol
  - /influxdb/cloud-serverless/reference/cli/influx/write
---

Write data to {{% product-name %}} using the following tools and methods:

{{% note %}}

#### Choose the write endpoint for your workload

When bringing existing v1 write workloads, use the {{% product-name %}} HTTP API [`/write` endpoint](/influxdb/cloud-serverless/guides/api-compatibility/v1/).
When creating new write workloads, use the HTTP API [`/api/v2/write` endpoint](/influxdb/cloud-serverless/guides/api-compatibility/v2/).

{{% /note %}}

{{< children >}}
