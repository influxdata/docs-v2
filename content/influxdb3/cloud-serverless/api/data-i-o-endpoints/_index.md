---
title: Data I/O endpoints
description: API reference for Data I/O endpoints
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/tags/tags/influxdb-cloud-serverless-data-i-o-endpoints.yaml
weight: 100
tag: Data I/O endpoints
isConceptual: false
menuGroup: Other
operations:
  - operationId: PostWrite
    method: POST
    path: /api/v2/write
    summary: Write data
    tags:
      - Data I/O endpoints
  - operationId: GetLegacyQuery
    method: GET
    path: /query
    summary: Query using the InfluxDB v1 HTTP API
    tags:
      - Data I/O endpoints
  - operationId: PostLegacyWrite
    method: POST
    path: /write
    summary: Write data using the InfluxDB v1 HTTP API
    tags:
      - Data I/O endpoints
---
