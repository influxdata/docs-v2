---
title: Use the InfluxDB v2 API with InfluxDB Cloud Dedicated (Single-tenant)
list_title: Use the InfluxDB v2 API
description: >
  Use InfluxDB v2 API authentication, endpoints, and tools with InfluxDB Cloud Dedicated (Single-tenant).
  Use the v2 API for new workloads and existing v2 workloads.
weight: 3
menu:
  influxdb_cloud_dedicated:
    parent: API primers
    name: v2 API primer
influxdb/cloud-dedicated/tags: [write, line protocol]
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