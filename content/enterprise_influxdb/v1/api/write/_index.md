---
title: Write
description: >-
  Write time series data using InfluxDB line protocol.


  **Enterprise Feature**: Use the `consistency` parameter to control write
  consistency

  across cluster nodes.
type: api
layout: list
staticFilePath: /openapi/influxdb-enterprise-v1/ref/tags/influxdb-enterprise-v1-ref-write.yaml
weight: 100
tag: Write
isConceptual: false
menuGroup: Other
operations:
  - operationId: PostWrite
    method: POST
    path: /write
    summary: Write data
    tags:
      - Write
  - operationId: PostApiV2Write
    method: POST
    path: /api/v2/write
    summary: Write data (v2 compatible)
    tags:
      - Write
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
