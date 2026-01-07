---
title: Bucket Schemas
description: API reference for Bucket Schemas
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/tags/tags/influxdb-cloud-serverless-bucket-schemas.yaml
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
---
