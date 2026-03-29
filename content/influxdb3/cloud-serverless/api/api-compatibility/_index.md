---
title: API compatibility
description: >-
  Use InfluxDB v1 and v2 compatible endpoints to write and query data.


  ### Write data


  InfluxDB 3 Cloud Serverless provides the following HTTP API endpoints for
  writing data:


  - `/api/v2/write` endpoint (recommended) for new write workloads or for
    bringing existing InfluxDB v2 write workloads to InfluxDB Cloud Serverless.
  - `/write` endpoint for bringing existing InfluxDB v1 write workloads to
    InfluxDB Cloud Serverless.

  Both endpoints accept line protocol format and process data the same way.


  ### Query data


  InfluxDB 3 Cloud Serverless provides the following protocols for executing a
  query:


  - Flight+gRPC request (recommended) that contains an SQL or InfluxQL query.

  - HTTP API `/query` request that contains an InfluxQL query.
    Use this protocol for existing InfluxDB v1 query workloads.

  ### InfluxDB v2 compatibility


  The `/api/v2/write` endpoint works with Token authentication and existing

  InfluxDB 2.x tools and code.


  ### InfluxDB v1 compatibility


  The `/write` and `/query` endpoints work with InfluxDB 1.x username/password

  authentication and existing InfluxDB 1.x tools and code.
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


  - `/api/v2/write` endpoint (recommended) for new write workloads or for
    bringing existing InfluxDB v2 write workloads to InfluxDB Cloud Serverless.
  - `/write` endpoint for bringing existing InfluxDB v1 write workloads to
    InfluxDB Cloud Serverless.

  Both endpoints accept line protocol format and process data the same way.


  ### Query data


  InfluxDB 3 Cloud Serverless provides the following protocols for executing a
  query:


  - Flight+gRPC request (recommended) that contains an SQL or InfluxQL query.

  - HTTP API `/query` request that contains an InfluxQL query.
    Use this protocol for existing InfluxDB v1 query workloads.

  ### InfluxDB v2 compatibility


  The `/api/v2/write` endpoint works with Token authentication and existing

  InfluxDB 2.x tools and code.


  ### InfluxDB v1 compatibility


  The `/write` and `/query` endpoints work with InfluxDB 1.x username/password

  authentication and existing InfluxDB 1.x tools and code.
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
