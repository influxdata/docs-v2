---
title: Buckets
description: >-
  Create and manage named storage locations (buckets) in InfluxDB 3 Cloud
  Serverless, each with a configurable retention period.
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/api/tags/influxdb-cloud-serverless-api-buckets.yaml
specDownloadPath: /openapi/influxdb-cloud-serverless-api.yml
weight: 100
tag: Buckets
isConceptual: false
operations:
  - operationId: GetBuckets
    method: GET
    path: /api/v2/buckets
    summary: List buckets
    tags:
      - Buckets
  - operationId: PostBuckets
    method: POST
    path: /api/v2/buckets
    summary: Create a bucket
    tags:
      - Buckets
  - operationId: GetBucketsID
    method: GET
    path: /api/v2/buckets/{bucketID}
    summary: Retrieve a bucket
    tags:
      - Buckets
  - operationId: PatchBucketsID
    method: PATCH
    path: /api/v2/buckets/{bucketID}
    summary: Update a bucket
    tags:
      - Buckets
  - operationId: DeleteBucketsID
    method: DELETE
    path: /api/v2/buckets/{bucketID}
    summary: Delete a bucket
    tags:
      - Buckets
  - operationId: GetBucketsIDLabels
    method: GET
    path: /api/v2/buckets/{bucketID}/labels
    summary: List all labels for a bucket
    tags:
      - Buckets
  - operationId: PostBucketsIDLabels
    method: POST
    path: /api/v2/buckets/{bucketID}/labels
    summary: Add a label to a bucket
    tags:
      - Buckets
  - operationId: DeleteBucketsIDLabelsID
    method: DELETE
    path: /api/v2/buckets/{bucketID}/labels/{labelID}
    summary: Delete a label from a bucket
    tags:
      - Buckets
  - operationId: GetBucketsIDMembers
    method: GET
    path: /api/v2/buckets/{bucketID}/members
    summary: List all users with member privileges for a bucket
    tags:
      - Buckets
  - operationId: PostBucketsIDMembers
    method: POST
    path: /api/v2/buckets/{bucketID}/members
    summary: Add a member to a bucket
    tags:
      - Buckets
  - operationId: DeleteBucketsIDMembersID
    method: DELETE
    path: /api/v2/buckets/{bucketID}/members/{userID}
    summary: Remove a member from a bucket
    tags:
      - Buckets
  - operationId: GetBucketsIDOwners
    method: GET
    path: /api/v2/buckets/{bucketID}/owners
    summary: List all owners of a bucket
    tags:
      - Buckets
  - operationId: PostBucketsIDOwners
    method: POST
    path: /api/v2/buckets/{bucketID}/owners
    summary: Add an owner to a bucket
    tags:
      - Buckets
  - operationId: DeleteBucketsIDOwnersID
    method: DELETE
    path: /api/v2/buckets/{bucketID}/owners/{userID}
    summary: Remove an owner from a bucket
    tags:
      - Buckets
related:
  - title: Manage buckets
    href: /influxdb3/cloud-serverless/admin/buckets/
  - title: InfluxDB 3 API client libraries
    href: /influxdb3/cloud-serverless/reference/client-libraries/v3/
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
  v1: /influxdb/v1/api/
  enterprise-v1: /enterprise_influxdb/v1/api/
---
