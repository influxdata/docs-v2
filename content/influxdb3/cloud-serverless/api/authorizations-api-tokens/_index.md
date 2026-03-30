---
title: Authorizations (API tokens)
description: >-
  Create and manage API token authorizations that grant read and write
  permissions to InfluxDB 3 Cloud Serverless organization resources.
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/api/tags/influxdb-cloud-serverless-api-authorizations-api-tokens.yaml
specDownloadPath: /openapi/influxdb-cloud-serverless-api.yml
weight: 100
tag: Authorizations (API tokens)
isConceptual: false
operations:
  - operationId: GetAuthorizations
    method: GET
    path: /api/v2/authorizations
    summary: List authorizations
    tags:
      - Authorizations (API tokens)
  - operationId: PostAuthorizations
    method: POST
    path: /api/v2/authorizations
    summary: Create an authorization
    tags:
      - Authorizations (API tokens)
  - operationId: GetAuthorizationsID
    method: GET
    path: /api/v2/authorizations/{authID}
    summary: Retrieve an authorization
    tags:
      - Authorizations (API tokens)
  - operationId: PatchAuthorizationsID
    method: PATCH
    path: /api/v2/authorizations/{authID}
    summary: Update an API token to be active or inactive
    tags:
      - Authorizations (API tokens)
  - operationId: DeleteAuthorizationsID
    method: DELETE
    path: /api/v2/authorizations/{authID}
    summary: Delete an authorization
    tags:
      - Authorizations (API tokens)
related:
  - title: Manage API tokens
    href: /influxdb3/cloud-serverless/security/tokens/
  - title: InfluxDB 3 API client libraries
    href: /influxdb3/cloud-serverless/reference/client-libraries/v3/
---
