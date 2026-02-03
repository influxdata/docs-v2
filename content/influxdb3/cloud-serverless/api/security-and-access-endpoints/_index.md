---
title: Security and access endpoints
description: API reference for Security and access endpoints
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/ref/tags/influxdb-cloud-serverless-ref-security-and-access-endpoints.yaml
weight: 100
tag: Security and access endpoints
isConceptual: false
menuGroup: Other
operations:
  - operationId: GetAuthorizations
    method: GET
    path: /api/v2/authorizations
    summary: List authorizations
    tags:
      - Security and access endpoints
  - operationId: PostAuthorizations
    method: POST
    path: /api/v2/authorizations
    summary: Create an authorization
    tags:
      - Security and access endpoints
  - operationId: GetAuthorizationsID
    method: GET
    path: /api/v2/authorizations/{authID}
    summary: Retrieve an authorization
    tags:
      - Security and access endpoints
  - operationId: PatchAuthorizationsID
    method: PATCH
    path: /api/v2/authorizations/{authID}
    summary: Update an API token to be active or inactive
    tags:
      - Security and access endpoints
  - operationId: DeleteAuthorizationsID
    method: DELETE
    path: /api/v2/authorizations/{authID}
    summary: Delete an authorization
    tags:
      - Security and access endpoints
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
