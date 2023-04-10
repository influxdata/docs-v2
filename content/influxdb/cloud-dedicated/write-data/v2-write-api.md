---
title: Write data to InfluxDB Cloud Dedicated (Single-tenant) with the v2 API /api/v2/write endpoint
list_title: Write data with the v2 API /api/v2/write endpoint
description: >
  Use the v2 API /api/v2/write endpoint to write time series data to InfluxDB Cloud Dedicated.
weight: 3
menu:
  influxdb_cloud_dedicated:
    name: Write data with the API
influxdb/cloud-dedicated/tags: [write, line protocol]
# related:
#   - /influxdb/cloud/api/#tag/Write, InfluxDB API /write endpoint
#   - /influxdb/cloud/reference/syntax/line-protocol
#   - /influxdb/cloud/reference/syntax/annotated-csv
#   - /influxdb/cloud/reference/cli/influx/write
#   - /resources/videos/ingest-data/, How to Ingest Data in InfluxDB (Video)
---

Write data with the InfluxDB v2 API `/api/v2/write` endpoint for InfluxDB Cloud:
  - Send v2 API requests from client libraries, Telegraf, or your own code.
    - You can't use the InfluxDB `influx` CLI with InfluxDB Cloud Dedicated.
    - For help finding the best workflow for your situation, [contact the Engineering team](link).
  <!-- v2 SAMPLE CODE -->
    - Authentication and authorization
      - Use a Database Token with the `Authorization: Token` scheme or the `Authorization: Bearer`(???) scheme.
    - Responses
  - Use client libraries with the v2 API write endpoint
  - Use Telegraf with the v2 API write endpoint
  - Use the v2 API write endpoint