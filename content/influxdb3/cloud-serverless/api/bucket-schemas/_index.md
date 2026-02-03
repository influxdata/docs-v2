---
title: Bucket Schemas
description: API reference for Bucket Schemas
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/ref/tags/influxdb-cloud-serverless-ref-bucket-schemas.yaml
weight: 100
tag: Bucket Schemas
isConceptual: false
menuGroup: Other
operations:
  - operationId: getMeasurementSchemas
    method: GET
    path: /api/v2/buckets/{bucketID}/schema/measurements
    summary: List measurement schemas of a bucket
    tags:
      - Bucket Schemas
  - operationId: createMeasurementSchema
    method: POST
    path: /api/v2/buckets/{bucketID}/schema/measurements
    summary: Create a measurement schema for a bucket
    tags:
      - Bucket Schemas
  - operationId: getMeasurementSchema
    method: GET
    path: /api/v2/buckets/{bucketID}/schema/measurements/{measurementID}
    summary: Retrieve a measurement schema
    tags:
      - Bucket Schemas
  - operationId: updateMeasurementSchema
    method: PATCH
    path: /api/v2/buckets/{bucketID}/schema/measurements/{measurementID}
    summary: Update a measurement schema
    tags:
      - Bucket Schemas
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
