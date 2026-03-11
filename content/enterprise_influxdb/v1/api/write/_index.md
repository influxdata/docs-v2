---
title: Write
description: >-
  Write time series data using InfluxDB line protocol.


  **Enterprise Feature**: Use the `consistency` parameter to control write
  consistency

  across cluster nodes.
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-enterprise-v1/influxdb-enterprise-v1-openapi/tags/influxdb-enterprise-v1-influxdb-enterprise-v1-openapi-write.yaml
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
---
