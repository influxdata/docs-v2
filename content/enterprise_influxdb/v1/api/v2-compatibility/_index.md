---
title: v2 Compatibility
description: |-
  InfluxDB 2.x API compatibility endpoints. These endpoints allow you to use
  InfluxDB 2.x client libraries with InfluxDB Enterprise 1.8+.

  Use the `Token` scheme with v1.x credentials:
  ```
  Authorization: Token username:password
  ```
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-enterprise-v1/ref/tags/influxdb-enterprise-v1-ref-v2-compatibility.yaml
weight: 100
tag: v2 Compatibility
isConceptual: false
menuGroup: Other
operations:
  - operationId: GetHealth
    method: GET
    path: /health
    summary: Check server health
    tags:
      - v2 Compatibility
  - operationId: PostApiV2Query
    method: POST
    path: /api/v2/query
    summary: Query with Flux (v2 compatible)
    tags:
      - v2 Compatibility
  - operationId: PostApiV2Write
    method: POST
    path: /api/v2/write
    summary: Write data (v2 compatible)
    tags:
      - v2 Compatibility
  - operationId: GetApiV2Buckets
    method: GET
    path: /api/v2/buckets
    summary: List buckets (v2 compatible)
    tags:
      - v2 Compatibility
  - operationId: PostApiV2Buckets
    method: POST
    path: /api/v2/buckets
    summary: Create bucket (v2 compatible)
    tags:
      - v2 Compatibility
  - operationId: DeleteApiV2BucketsBucketID
    method: DELETE
    path: /api/v2/buckets/{bucketID}
    summary: Delete bucket (v2 compatible)
    tags:
      - v2 Compatibility
  - operationId: PostApiV2Delete
    method: POST
    path: /api/v2/delete
    summary: Delete data (v2 compatible)
    tags:
      - v2 Compatibility
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
