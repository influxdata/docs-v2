---
title: Query
description: |-
  Query data using InfluxQL. The `/query` endpoint supports both read queries
  (SELECT, SHOW) and write queries (CREATE, DROP, ALTER, etc.).
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-enterprise-v1/influxdb-enterprise-v1-openapi/tags/influxdb-enterprise-v1-influxdb-enterprise-v1-openapi-query.yaml
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
---
