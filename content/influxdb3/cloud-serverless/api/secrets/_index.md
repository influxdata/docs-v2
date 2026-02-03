---
title: Secrets
description: API reference for Secrets
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/ref/tags/influxdb-cloud-serverless-ref-secrets.yaml
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
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
