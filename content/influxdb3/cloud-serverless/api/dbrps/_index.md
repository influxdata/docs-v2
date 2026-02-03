---
title: DBRPs
description: >-
  The InfluxDB 1.x data model includes
  [databases](/influxdb3/cloud-serverless/reference/glossary/)

  and [retention policies](/influxdb3/cloud-serverless/reference/glossary/).

  InfluxDB 2.x replaces databases and retention policies with buckets.

  To support InfluxDB 1.x query and write patterns in InfluxDB 2.x,

  databases and retention policies are mapped to buckets using the

  database and retention policy (DBRP) mapping service.

  The DBRP mapping service uses the database and retention policy

  specified in 1.x compatibility API requests to route operations to a bucket.


  ### Related guides


  - [Database and retention policy
  mapping](/influxdb3/cloud-serverless/reference/api/influxdb-1x/dbrp/)
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/ref/tags/influxdb-cloud-serverless-ref-dbrps.yaml
weight: 100
tag: DBRPs
isConceptual: false
menuGroup: Other
operations:
  - operationId: GetDBRPs
    method: GET
    path: /api/v2/dbrps
    summary: List database retention policy mappings
    tags:
      - DBRPs
  - operationId: PostDBRP
    method: POST
    path: /api/v2/dbrps
    summary: Add a database retention policy mapping
    tags:
      - DBRPs
  - operationId: GetDBRPsID
    method: GET
    path: /api/v2/dbrps/{dbrpID}
    summary: Retrieve a database retention policy mapping
    tags:
      - DBRPs
  - operationId: PatchDBRPID
    method: PATCH
    path: /api/v2/dbrps/{dbrpID}
    summary: Update a database retention policy mapping
    tags:
      - DBRPs
  - operationId: DeleteDBRPID
    method: DELETE
    path: /api/v2/dbrps/{dbrpID}
    summary: Delete a database retention policy
    tags:
      - DBRPs
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
