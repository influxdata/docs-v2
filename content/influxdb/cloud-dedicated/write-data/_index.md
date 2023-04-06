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

Write data to InfluxDB Cloud Dedicated using the InfluxDB v2 `/api/v2/write` endpoint or v1 `/write` endpoint. 

Write data with the InfluxDB v2 API `/api/v2/write` endpoint for Cloud Dedicated:
  - Use v2 API requests from client libraries, Telegraf, or your own code.
    - You can't use the InfluxDB `influx` CLI.
    - For questions about the best workflows for your situation, [contact the Engineering team](link).
  <!-- v2 SAMPLE CODE -->

Write data with the InfluxDB v1 API `/write` endpoint for Cloud Dedicated:
  - Use your existing InfluxDB v1 write workloads.
  - Use v1 API requests from the Telegraf v1 Output Plugin or your own code.
  <!-- v1 SAMPLE CODE -->
    - Supports Basic Auth.
      - Use a Database Token as your Basic Auth password.

{{< children >}}
