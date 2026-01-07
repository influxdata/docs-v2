---
title: Buckets
description: >
  Store your data in InfluxDB
  [buckets](/influxdb3/cloud-serverless/reference/glossary/#bucket).

  A bucket is a named location where time series data is stored. All buckets

  have a [retention
  period](/influxdb3/cloud-serverless/reference/glossary/#retention-period),

  a duration of time that each data point persists. InfluxDB drops all

  points with timestamps older than the bucket’s retention period.

  A bucket belongs to an organization.


  ### Related guides


  - [Manage buckets](/influxdb3/cloud-serverless/admin/buckets/)
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/tags/tags/influxdb-cloud-serverless-buckets.yaml
weight: 100
tag: Buckets
isConceptual: false
menuGroup: Other
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
---
