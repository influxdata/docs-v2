---
title: Query
description: >
  Query data stored in a bucket.


  - HTTP clients can query the v1 [`/query`
  endpoint](/influxdb3/cloud-serverless/api/#operation/GetLegacyQuery)

  using **InfluxQL** and retrieve data in **CSV** or **JSON** format.

  - _Flight + gRPC_ clients can query using **SQL** or **InfluxQL** and retrieve
  data in **Arrow** format.


  #### Related guides


  - [Get started querying
  InfluxDB](/influxdb3/cloud-serverless/get-started/query/)

  - [Execute queries](/influxdb3/cloud-serverless/query-data/execute-queries/)
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/tags/tags/influxdb-cloud-serverless-query.yaml
weight: 100
tag: Query
isConceptual: false
menuGroup: Other
operations:
  - operationId: PostQuery
    method: POST
    path: /api/v2/query
    summary: Query data
    tags:
      - Query
  - operationId: PostQueryAnalyze
    method: POST
    path: /api/v2/query/analyze
    summary: Analyze a Flux query
    tags:
      - Query
  - operationId: PostQueryAst
    method: POST
    path: /api/v2/query/ast
    summary: Generate a query Abstract Syntax Tree (AST)
    tags:
      - Query
  - operationId: GetQuerySuggestions
    method: GET
    path: /api/v2/query/suggestions
    summary: List Flux query suggestions
    tags:
      - Query
  - operationId: GetQuerySuggestionsName
    method: GET
    path: /api/v2/query/suggestions/{name}
    summary: Retrieve a query suggestion for a branching suggestion
    tags:
      - Query
  - operationId: GetLegacyQuery
    method: GET
    path: /query
    summary: Query using the InfluxDB v1 HTTP API
    tags:
      - Query
---
