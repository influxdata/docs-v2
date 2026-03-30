---
title: Organizations
description: >-
  View and manage InfluxDB 3 Cloud Serverless organizations, which are
  workspaces that group users, buckets, and resources.
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/api/tags/influxdb-cloud-serverless-api-organizations.yaml
specDownloadPath: /openapi/influxdb-cloud-serverless-api.yml
weight: 100
tag: Organizations
isConceptual: false
operations:
  - operationId: GetOrgs
    method: GET
    path: /api/v2/orgs
    summary: List organizations
    tags:
      - Organizations
  - operationId: PostOrgs
    method: POST
    path: /api/v2/orgs
    summary: Create an organization
    tags:
      - Organizations
  - operationId: GetOrgsID
    method: GET
    path: /api/v2/orgs/{orgID}
    summary: Retrieve an organization
    tags:
      - Organizations
  - operationId: PatchOrgsID
    method: PATCH
    path: /api/v2/orgs/{orgID}
    summary: Update an organization
    tags:
      - Organizations
  - operationId: DeleteOrgsID
    method: DELETE
    path: /api/v2/orgs/{orgID}
    summary: Delete an organization
    tags:
      - Organizations
  - operationId: GetOrgsIDMembers
    method: GET
    path: /api/v2/orgs/{orgID}/members
    summary: List all members of an organization
    tags:
      - Organizations
  - operationId: PostOrgsIDMembers
    method: POST
    path: /api/v2/orgs/{orgID}/members
    summary: Add a member to an organization
    tags:
      - Organizations
  - operationId: DeleteOrgsIDMembersID
    method: DELETE
    path: /api/v2/orgs/{orgID}/members/{userID}
    summary: Remove a member from an organization
    tags:
      - Organizations
  - operationId: GetOrgsIDOwners
    method: GET
    path: /api/v2/orgs/{orgID}/owners
    summary: List all owners of an organization
    tags:
      - Organizations
  - operationId: PostOrgsIDOwners
    method: POST
    path: /api/v2/orgs/{orgID}/owners
    summary: Add an owner to an organization
    tags:
      - Organizations
  - operationId: DeleteOrgsIDOwnersID
    method: DELETE
    path: /api/v2/orgs/{orgID}/owners/{userID}
    summary: Remove an owner from an organization
    tags:
      - Organizations
related:
  - title: View and manage organizations
    href: /influxdb3/cloud-serverless/admin/
  - title: InfluxDB 3 API client libraries
    href: /influxdb3/cloud-serverless/reference/client-libraries/v3/
---
