---
title: API compatibility
description: >-
  ### Write data


  InfluxDB 3 Cloud Serverless provides the following HTTP API endpoints for
  writing data:


  - **Recommended**: `/api/v2/write` endpoint
    for new write workloads or for bringing existing InfluxDB v2 write workloads to InfluxDB 3.
  - `/write` endpoint for bringing existing InfluxDB v1 write workloads to
  InfluxDB 3.


  Both endpoints accept the same line protocol format and process data in the
  same way.


  ### Query data


  InfluxDB 3 Cloud Serverless provides the following protocols for executing a
  query:


  - **Recommended**: _Flight+gRPC_ request that contains an SQL or InfluxQL
  query.

  - HTTP API `/query` request that contains an InfluxQL query.
    Use this protocol when bringing existing InfluxDB v1 query workloads to InfluxDB 3.

  ### InfluxDB v2 compatibility


  The HTTP API `/api/v2/write` endpoint works with the `Token` authentication
  scheme and existing InfluxDB 2.x tools and code.


  ### InfluxDB v1 compatibility


  The HTTP API `/write` endpoint and `/query` endpoint work with InfluxDB 1.x
  username/password authentication schemes and existing InfluxDB 1.x tools and
  code.
type: api
layout: single
staticFilePath: >-
  /openapi/influxdb3-cloud-serverless/tags/influxdb3-cloud-serverless-api-compatibility.yaml
weight: 100
tag: API compatibility
isConceptual: true
menuGroup: Other
specDownloadPath: /openapi/influxdb3-cloud-serverless.yml
articleDataKey: influxdb3-cloud-serverless
articleSection: api
tagDescription: >-
  ### Write data


  InfluxDB 3 Cloud Serverless provides the following HTTP API endpoints for
  writing data:


  - **Recommended**: `/api/v2/write` endpoint
    for new write workloads or for bringing existing InfluxDB v2 write workloads to InfluxDB 3.
  - `/write` endpoint for bringing existing InfluxDB v1 write workloads to
  InfluxDB 3.


  Both endpoints accept the same line protocol format and process data in the
  same way.


  ### Query data


  InfluxDB 3 Cloud Serverless provides the following protocols for executing a
  query:


  - **Recommended**: _Flight+gRPC_ request that contains an SQL or InfluxQL
  query.

  - HTTP API `/query` request that contains an InfluxQL query.
    Use this protocol when bringing existing InfluxDB v1 query workloads to InfluxDB 3.

  ### InfluxDB v2 compatibility


  The HTTP API `/api/v2/write` endpoint works with the `Token` authentication
  scheme and existing InfluxDB 2.x tools and code.


  ### InfluxDB v1 compatibility


  The HTTP API `/write` endpoint and `/query` endpoint work with InfluxDB 1.x
  username/password authentication schemes and existing InfluxDB 1.x tools and
  code.
related:
  - title: Get started querying InfluxDB
    href: /influxdb3/cloud-serverless/get-started/query/
  - title: Write data
    href: /influxdb3/cloud-serverless/write-data/
  - title: Use the v2 HTTP API with Cloud Serverless
    href: /influxdb3/cloud-serverless/guides/api-compatibility/v2/
  - title: Use the v1 HTTP API with Cloud Serverless
    href: /influxdb3/cloud-serverless/guides/api-compatibility/v1/
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
