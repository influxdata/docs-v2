---
title: Authorizations (API tokens)
description: >-
  Create and manage authorizations (API tokens).


  An _authorization_ contains a list of `read` and `write`

  permissions for organization resources and provides an API token for
  authentication.

  An authorization belongs to an organization and only contains permissions for
  that organization.


  We recommend the following for managing your tokens:


  - Create a generic user to create and manage tokens for writing data.

  - Store your tokens in a secure password vault for future access.


  ### User sessions with authorizations


  Optionally, when creating an authorization, you can scope it to a specific
  user.

  If the user signs in with username and password, creating a _user session_,

  the session carries the permissions granted by all the user's authorizations.

  For more information, see [how to assign a token to a specific
  user](/influxdb3/cloud-serverless/security/tokens/create-token/).

  To create a user session, use the `POST /api/v2/signin` endpoint.


  ### Related endpoints


  - Signin

  - Signout


  ### Related guides


  - [Authorize API requests](/influxdb3/cloud-serverless/api-guide/api_intro/)

  - [Manage API tokens](/influxdb3/cloud-serverless/security/tokens/)

  - [Assign a token to a specific
  user](/influxdb3/cloud-serverless/security/tokens/create-token/)
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/ref/tags/influxdb-cloud-serverless-ref-authorizations-api-tokens.yaml
weight: 100
tag: Authorizations (API tokens)
isConceptual: false
menuGroup: Other
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
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
