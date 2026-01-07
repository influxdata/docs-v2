---
title: Write
description: >
  Write time series data to
  [buckets](/influxdb3/cloud-serverless/reference/glossary/#bucket) using
  InfluxDB v1 or v2 endpoints.
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/tags/tags/influxdb-cloud-serverless-write.yaml
weight: 100
tag: Write
isConceptual: false
menuGroup: Other
operations:
  - operationId: PostWrite
    method: POST
    path: /api/v2/write
    summary: Write data
    tags:
      - Write
  - operationId: PostLegacyWrite
    method: POST
    path: /write
    summary: Write data using the InfluxDB v1 HTTP API
    tags:
      - Write
---
