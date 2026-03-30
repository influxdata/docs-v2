---
title: API compatibility
description: >-
  InfluxDB Cloud Serverless supports a subset of the InfluxDB v2 API.

  Other endpoints in this reference are for the InfluxDB Cloud (TSM) API —

  they may be accessible, but are not supported or recommended for use with

  InfluxDB Cloud Serverless, which is powered by the InfluxDB 3 storage engine.


  ### Write data


  InfluxDB Cloud Serverless provides the following HTTP API endpoints for
  writing data:


  - **Recommended**: `/api/v2/write` endpoint
    for new write workloads or for bringing existing InfluxDB v2 write workloads.
  - `/write` endpoint for bringing existing InfluxDB v1 write workloads.


  Both endpoints accept line protocol format and process data in the same way.


  ### Query data


  InfluxDB Cloud Serverless provides the following protocols for executing a
  query:


  - **Recommended**: _Flight+gRPC_ request that contains an SQL or InfluxQL
  query.

  - HTTP API `/query` request that contains an InfluxQL query.
    Use this endpoint when bringing existing InfluxDB v1 query workloads.

  ### Management endpoints


  Use the following endpoints to manage Cloud Serverless resources:


  - API tokens (authorizations) — create and manage API tokens

  - Buckets — create and manage storage buckets

  - Organizations — view and manage organizations

  - Accounts — manage account information


  ### InfluxDB v2 compatibility


  The `/api/v2/write` endpoint works with the Token authentication scheme and
  existing InfluxDB 2.x tools and code.


  ### InfluxDB v1 compatibility


  The `/write` and `/query` endpoints work with InfluxDB 1.x username/password
  authentication and existing InfluxDB 1.x tools and code.
type: api
layout: single
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/api/tags/influxdb-cloud-serverless-api-api-compatibility.yaml
specDownloadPath: /openapi/influxdb-cloud-serverless-api.yml
weight: 100
tag: API compatibility
isConceptual: true
tagDescription: >-
  InfluxDB Cloud Serverless supports a subset of the InfluxDB v2 API.

  Other endpoints in this reference are for the InfluxDB Cloud (TSM) API —

  they may be accessible, but are not supported or recommended for use with

  InfluxDB Cloud Serverless, which is powered by the InfluxDB 3 storage engine.


  ### Write data


  InfluxDB Cloud Serverless provides the following HTTP API endpoints for
  writing data:


  - **Recommended**: `/api/v2/write` endpoint
    for new write workloads or for bringing existing InfluxDB v2 write workloads.
  - `/write` endpoint for bringing existing InfluxDB v1 write workloads.


  Both endpoints accept line protocol format and process data in the same way.


  ### Query data


  InfluxDB Cloud Serverless provides the following protocols for executing a
  query:


  - **Recommended**: _Flight+gRPC_ request that contains an SQL or InfluxQL
  query.

  - HTTP API `/query` request that contains an InfluxQL query.
    Use this endpoint when bringing existing InfluxDB v1 query workloads.

  ### Management endpoints


  Use the following endpoints to manage Cloud Serverless resources:


  - API tokens (authorizations) — create and manage API tokens

  - Buckets — create and manage storage buckets

  - Organizations — view and manage organizations

  - Accounts — manage account information


  ### InfluxDB v2 compatibility


  The `/api/v2/write` endpoint works with the Token authentication scheme and
  existing InfluxDB 2.x tools and code.


  ### InfluxDB v1 compatibility


  The `/write` and `/query` endpoints work with InfluxDB 1.x username/password
  authentication and existing InfluxDB 1.x tools and code.
related:
  - title: Write data
    href: /influxdb3/cloud-serverless/write-data/
  - title: Get started querying InfluxDB
    href: /influxdb3/cloud-serverless/get-started/query/
  - title: Manage API tokens
    href: /influxdb3/cloud-serverless/security/tokens/
  - title: Manage buckets
    href: /influxdb3/cloud-serverless/admin/buckets/
  - title: Use the v2 HTTP API with Cloud Serverless
    href: /influxdb3/cloud-serverless/guides/api-compatibility/v2/
  - title: Use the v1 HTTP API with Cloud Serverless
    href: /influxdb3/cloud-serverless/guides/api-compatibility/v1/
---
