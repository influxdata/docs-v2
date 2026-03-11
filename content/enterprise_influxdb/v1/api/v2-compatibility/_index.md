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
  /openapi/influxdb-enterprise-v1/influxdb-enterprise-v1-openapi/tags/influxdb-enterprise-v1-influxdb-enterprise-v1-openapi-v2-compatibility.yaml
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
---
