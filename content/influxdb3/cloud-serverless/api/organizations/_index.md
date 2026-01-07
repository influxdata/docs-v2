---
title: Organizations
description: >
  Manage your
  [organization](/influxdb3/cloud-serverless/reference/glossary/#organization).

  An organization is a workspace for a group of users. Organizations can be

  used to separate different environments, projects, teams or users within

  InfluxDB.


  Use the `/api/v2/orgs` endpoints to view and manage organizations.
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/tags/tags/influxdb-cloud-serverless-organizations.yaml
weight: 100
tag: Organizations
isConceptual: false
menuGroup: Other
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
---
