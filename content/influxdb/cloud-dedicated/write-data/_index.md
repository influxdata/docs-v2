---
title: Write data to InfluxDB Cloud Dedicated (Single-tenant)
list_title: Write data
description: >
  Collect and write time series data to InfluxDB Cloud Dedicated.
weight: 3
menu:
  influxdb_cloud_dedicated:
    name: Write data
influxdb/cloud-dedicated/tags: [write, line protocol]
# related:
#   - /influxdb/cloud/api/#tag/Write, InfluxDB API /write endpoint
#   - /influxdb/cloud/reference/syntax/line-protocol
#   - /influxdb/cloud/reference/syntax/annotated-csv
#   - /influxdb/cloud/reference/cli/influx/write
#   - /resources/videos/ingest-data/, How to Ingest Data in InfluxDB (Video)
---

Write data to {{% product-name %}} using the following tools and methods:

{{% note %}}

#### Choose the write endpoint for your workload

When bringing existing v1 write workloads, use the {{% product-name %}} HTTP API [`/write` endpoint](/influxdb/cloud-dedicated/guides/api-compatibility/v1/).
When creating new write workloads, use the HTTP API [`/api/v2/write` endpoint](/influxdb/cloud-dedicated/guides/api-compatibility/v2/).

{{% /note %}}

{{< children >}}
 