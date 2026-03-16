---
title: DBRPs
description: >-
  Manage database and retention policy (DBRP) mappings that route InfluxDB
  v1-compatible requests to InfluxDB 3 Cloud Serverless buckets.
type: api
layout: list
staticFilePath: /openapi/influxdb3-cloud-serverless/tags/influxdb3-cloud-serverless-dbrps.yaml
weight: 100
tag: DBRPs
isConceptual: false
menuGroup: Other
specDownloadPath: /openapi/influxdb3-cloud-serverless.yml
articleDataKey: influxdb3-cloud-serverless
articleSection: api
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
related:
  - title: Database and retention policy mapping
    href: /influxdb3/cloud-serverless/reference/api/influxdb-1x/dbrp/
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
---
