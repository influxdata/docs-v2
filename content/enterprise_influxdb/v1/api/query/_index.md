---
title: Query
description: |-
  Query data using InfluxQL. The `/query` endpoint supports both read queries
  (SELECT, SHOW) and write queries (CREATE, DROP, ALTER, etc.).
type: api
layout: list
staticFilePath: /openapi/influxdb-enterprise-v1/ref/tags/influxdb-enterprise-v1-ref-query.yaml
weight: 100
tag: Query
isConceptual: false
menuGroup: Other
operations:
  - operationId: GetQuery
    method: GET
    path: /query
    summary: Query data (GET)
    tags:
      - Query
  - operationId: PostQuery
    method: POST
    path: /query
    summary: Query data (POST)
    tags:
      - Query
  - operationId: PostApiV2Query
    method: POST
    path: /api/v2/query
    summary: Query with Flux (v2 compatible)
    tags:
      - Query
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
