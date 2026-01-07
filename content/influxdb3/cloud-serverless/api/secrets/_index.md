---
title: Secrets
description: API reference for Secrets
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/tags/tags/influxdb-cloud-serverless-secrets.yaml
weight: 100
tag: Secrets
isConceptual: false
menuGroup: Other
operations:
  - operationId: GetOrgsIDSecrets
    method: GET
    path: /api/v2/orgs/{orgID}/secrets
    summary: List all secret keys for an organization
    tags:
      - Secrets
  - operationId: PatchOrgsIDSecrets
    method: PATCH
    path: /api/v2/orgs/{orgID}/secrets
    summary: Update secrets in an organization
    tags:
      - Secrets
  - operationId: DeleteOrgsIDSecretsID
    method: DELETE
    path: /api/v2/orgs/{orgID}/secrets/{secretID}
    summary: Delete a secret from an organization
    tags:
      - Secrets
  - operationId: PostOrgsIDSecrets
    method: POST
    path: /api/v2/orgs/{orgID}/secrets/delete
    summary: Delete secrets from an organization
    tags:
      - Secrets
---
