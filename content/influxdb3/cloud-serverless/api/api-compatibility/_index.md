---
title: API compatibility
description: >-
  Use InfluxDB v1 and v2 compatible endpoints to write and query data.


  ### Write data


  InfluxDB 3 Cloud Serverless provides the following HTTP API endpoints for
  writing data:


  - **Recommended**: `/api/v2/write` endpoint
    for new write workloads or for bringing existing InfluxDB v2 write workloads to InfluxDB Cloud Serverless.
  - `/write` endpoint for bringing existing InfluxDB v1 write workloads to
  InfluxDB Cloud Serverless.


  Both endpoints accept the same line protocol format and process data in the
  same way.


  ### Query data


  InfluxDB 3 Cloud Serverless provides the following protocols for executing a
  query:


  - **Recommended**: _Flight+gRPC_ request that contains an SQL or InfluxQL
  query. See how to [get started querying InfluxDB using Flight and
  SQL](/influxdb3/cloud-serverless/get-started/query/).

  - HTTP API [`/query` request](/influxdb3/cloud-serverless/api/) that contains
  an InfluxQL query.
    Use this protocol when bringing existing InfluxDB v1 query workloads to InfluxDB Cloud Serverless.

  ### InfluxDB v2 compatibility


  The HTTP API `/api/v2/write` endpoint works with the `Token` authentication
  scheme and existing InfluxDB 2.x tools and code for [writing
  data](/influxdb3/cloud-serverless/write-data/).


  See how to [use the InfluxDB v2 HTTP API with InfluxDB 3 Cloud
  Serverless](/influxdb3/cloud-serverless/guides/api-compatibility/v2/).


  ### InfluxDB v1 compatibility


  The HTTP API `/write` endpoint and `/query` endpoint work with InfluxDB 1.x
  username/password authentication schemes and existing InfluxDB 1.x tools and
  code.


  See how to [use the InfluxDB v1 HTTP API with InfluxDB 3 Cloud
  Serverless](/influxdb3/cloud-serverless/guides/api-compatibility/v1/).
type: api
layout: single
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/ref/tags/influxdb-cloud-serverless-ref-api-compatibility.yaml
weight: 100
tag: API compatibility
isConceptual: true
menuGroup: Other
tagDescription: >-
  Use InfluxDB v1 and v2 compatible endpoints to write and query data.


  ### Write data


  InfluxDB 3 Cloud Serverless provides the following HTTP API endpoints for
  writing data:


  - **Recommended**: `/api/v2/write` endpoint
    for new write workloads or for bringing existing InfluxDB v2 write workloads to InfluxDB Cloud Serverless.
  - `/write` endpoint for bringing existing InfluxDB v1 write workloads to
  InfluxDB Cloud Serverless.


  Both endpoints accept the same line protocol format and process data in the
  same way.


  ### Query data


  InfluxDB 3 Cloud Serverless provides the following protocols for executing a
  query:


  - **Recommended**: _Flight+gRPC_ request that contains an SQL or InfluxQL
  query. See how to [get started querying InfluxDB using Flight and
  SQL](/influxdb3/cloud-serverless/get-started/query/).

  - HTTP API [`/query` request](/influxdb3/cloud-serverless/api/) that contains
  an InfluxQL query.
    Use this protocol when bringing existing InfluxDB v1 query workloads to InfluxDB Cloud Serverless.

  ### InfluxDB v2 compatibility


  The HTTP API `/api/v2/write` endpoint works with the `Token` authentication
  scheme and existing InfluxDB 2.x tools and code for [writing
  data](/influxdb3/cloud-serverless/write-data/).


  See how to [use the InfluxDB v2 HTTP API with InfluxDB 3 Cloud
  Serverless](/influxdb3/cloud-serverless/guides/api-compatibility/v2/).


  ### InfluxDB v1 compatibility


  The HTTP API `/write` endpoint and `/query` endpoint work with InfluxDB 1.x
  username/password authentication schemes and existing InfluxDB 1.x tools and
  code.


  See how to [use the InfluxDB v1 HTTP API with InfluxDB 3 Cloud
  Serverless](/influxdb3/cloud-serverless/guides/api-compatibility/v1/).
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
